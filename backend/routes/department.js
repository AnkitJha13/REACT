const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Use 'connection' here instead of 'db'

// Get all departments
router.get('/', (req, res) => {
  connection.query('SELECT * FROM department', (err, results) => { // Use connection.query
    if (err) return res.status(500).send(err); // Handle database errors
    res.json(results); // Send the results as JSON
  });
});

module.exports = router;
