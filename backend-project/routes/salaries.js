const express = require('express');
const pool = require('../db');
const router = express.Router();

const requireAuth = (req, res, next) => {
  if (req.session.user) return next();
  return res.status(401).json({ message: 'Authentication required' });
};

router.post('/', requireAuth, async (req, res) => {
  try {
    const { employeeNumber, month, grossSalary, totalDeduction, netSalary } = req.body;
    if (!employeeNumber || !month || grossSalary == null || totalDeduction == null || netSalary == null) {
      return res.status(400).json({ message: 'Employee number, month, gross salary, total deduction, and net salary are required' });
    }

    const [employeeRows] = await pool.query(
      'SELECT employeeNumber FROM Employee WHERE employeeNumber = ?',
      [employeeNumber]
    );

    if (employeeRows.length === 0) {
      return res.status(400).json({ message: 'Employee does not exist. Please create the employee before adding a salary record.' });
    }

    await pool.execute(
      `INSERT INTO Salary (employeeNumber, month, grossSalary, totalDeduction, netSalary)
       VALUES (?, ?, ?, ?, ?)`,
      [employeeNumber, month, grossSalary, totalDeduction, netSalary]
    );

    res.json({ message: 'Salary record created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.*, e.firstName, e.lastName, e.position, d.departementName
      FROM Salary s
      JOIN Employee e ON s.employeeNumber = e.employeeNumber
      LEFT JOIN Department d ON e.departementCode = d.departementCode
      ORDER BY s.salaryId DESC
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { month, grossSalary, totalDeduction, netSalary } = req.body;

    await pool.execute(
      `UPDATE Salary SET month = ?, grossSalary = ?, totalDeduction = ?, netSalary = ? WHERE salaryId = ?`,
      [month, grossSalary, totalDeduction, netSalary, id]
    );

    res.json({ message: 'Salary updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM Salary WHERE salaryId = ?', [id]);
    res.json({ message: 'Salary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
