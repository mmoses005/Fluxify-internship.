const express = require('express');
const pool = require('../db');
const router = express.Router();

const requireAuth = (req, res, next) => {
  if (req.session.user) return next();
  return res.status(401).json({ message: 'Authentication required' });
};

router.get('/payroll', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.firstName, e.lastName, e.position, d.departementName AS department,
             s.netSalary, s.month
      FROM Salary s
      JOIN Employee e ON s.employeeNumber = e.employeeNumber
      LEFT JOIN Department d ON e.departementCode = d.departementCode
      ORDER BY s.month DESC, e.lastName
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
