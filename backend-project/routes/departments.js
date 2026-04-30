const express = require('express');
const pool = require('../db');
const router = express.Router();

const requireAuth = (req, res, next) => {
  // Temporarily disabled for testing
  return next();
  // if (req.session.user) return next();
  // return res.status(401).json({ message: 'Authentication required' });
};

router.post('/', requireAuth, async (req, res) => {
  try {
    const { departementCode, departementName, grossSalary, totalDeduction } = req.body;
    if (!departementCode || !departementName || grossSalary == null || totalDeduction == null) {
      return res.status(400).json({ message: 'Department code, name, gross salary, and total deduction are required' });
    }

    const [existing] = await pool.query('SELECT departementCode FROM Department WHERE departementCode = ?', [departementCode]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Department code already exists' });
    }

    await pool.execute(
      'INSERT INTO Department (departementCode, departementName, grossSalary, totalDeduction) VALUES (?, ?, ?, ?)',
      [departementCode, departementName, grossSalary, totalDeduction]
    );
    res.json({ message: 'Department created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Department');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
