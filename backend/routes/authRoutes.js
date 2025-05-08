const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');  // Ensure db connection is correctly configured

const router = express.Router();

// Hardcoded JWT_SECRET (no dotenv)
const JWT_SECRET = 'dnkfndfdkg';  // Use your actual secret key here

// Utility function for querying the DB
const queryDb = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields (name, email, password) are required' });
  }

  try {
    // Check if user already exists
    const result = await queryDb('SELECT * FROM register_users WHERE email = ?', [email]);

    if (result.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user into the database
    await queryDb(
      'INSERT INTO register_users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Check if the user was successfully inserted by querying the database
    const newUser = await queryDb('SELECT * FROM register_users WHERE email = ?', [email]);

    if (newUser.length > 0) {
      res.status(201).json({ message: 'User registered successfully', user: newUser[0] });
    } else {
      res.status(500).json({ message: 'Error inserting user data into database' });
    }

  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const result = await queryDb('SELECT * FROM register_users WHERE email = ?', [email]);

    if (result.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result[0];

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,  // Directly use the secret
      { expiresIn: '1h' } // Adjust expiration as needed
    );

    res.json({ message: 'Login successful', token });

  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
});

module.exports = router;
