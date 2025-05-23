const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all employees with their department name, salary, and address
router.get('/', (req, res) => {
  const sql = `
    SELECT e.id, e.name, e.email, e.salary, e.address, e.department_id, d.name AS department_name
    FROM employee e
    JOIN department d ON e.department_id = d.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
});

// Add employee
router.post('/', (req, res) => {
  const { name, email, salary, address, department_id } = req.body;

  // Validate all required fields
  if (!name || !email || !salary || !address || !department_id) {
    return res.status(400).json({ message: 'All fields (name, email, salary, address, department_id) are required' });
  }

  // Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Insert employee into the database
  db.query(
    'INSERT INTO employee (name, email, salary, address, department_id) VALUES (?, ?, ?, ?, ?)',
    [name, email, salary, address, department_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.status(201).json({
        message: 'Employee added successfully',
        id: result.insertId,
        name,
        email,
        salary,
        address,
        department_id,
      });
    }
  );
});

// Update employee
router.put('/:id', (req, res) => {
  const { name, email, salary, address, department_id } = req.body;

  // Validate all required fields
  if (!name || !email || !salary || !address || !department_id) {
    return res.status(400).json({ message: 'All fields (name, email, salary, address, department_id) are required' });
  }

  // Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Update employee details in the database
  db.query(
    'UPDATE employee SET name = ?, email = ?, salary = ?, address = ?, department_id = ? WHERE id = ?',
    [name, email, salary, address, department_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.status(200).json({ message: 'Employee updated successfully' });
    }
  );
});

// Delete employee
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM employee WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.status(200).json({ message: 'Employee deleted successfully' });
  });
});

module.exports = router;
