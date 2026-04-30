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
    const { employeeNumber, firstName, lastName, position, address, telephone, gender, hiredDate, departementCode } = req.body;
    if (!employeeNumber || !firstName || !lastName || !position) {
      return res.status(400).json({ message: 'Employee number, first name, last name, and position are required' });
    }

    const [existingRows] = await pool.query('SELECT employeeNumber FROM Employee WHERE employeeNumber = ?', [employeeNumber]);
    if (existingRows.length > 0) {
      return res.status(409).json({ message: 'Employee number already exists' });
    }

    if (departementCode) {
      const [deptRows] = await pool.query('SELECT departementCode FROM Department WHERE departementCode = ?', [departementCode]);
      if (deptRows.length === 0) {
        return res.status(400).json({ message: 'Department code not found' });
      }
    }

    await pool.execute(
      `INSERT INTO Employee (employeeNumber, firstName, lastName, position, address, telephone, gender, hiredDate, departementCode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employeeNumber, firstName, lastName, position, address || null, telephone || null, gender || null, hiredDate || null, departementCode || null]
    );

    res.json({ message: 'Employee created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:employeeNumber', requireAuth, async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    const { firstName, lastName, position, address, telephone, gender, hiredDate, departementCode } = req.body;

    const [existingRows] = await pool.query('SELECT employeeNumber FROM Employee WHERE employeeNumber = ?', [employeeNumber]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (departementCode) {
      const [deptRows] = await pool.query('SELECT departementCode FROM Department WHERE departementCode = ?', [departementCode]);
      if (deptRows.length === 0) {
        return res.status(400).json({ message: 'Department code not found' });
      }
    }

    await pool.execute(
      `UPDATE Employee SET firstName = ?, lastName = ?, position = ?, address = ?, telephone = ?, gender = ?, hiredDate = ?, departementCode = ?
       WHERE employeeNumber = ?`,
      [firstName, lastName, position, address || null, telephone || null, gender || null, hiredDate || null, departementCode || null, employeeNumber]
    );

    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:employeeNumber', requireAuth, async (req, res) => {
  try {
    const { employeeNumber } = req.params;
    const [existingRows] = await pool.query('SELECT employeeNumber FROM Employee WHERE employeeNumber = ?', [employeeNumber]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await pool.execute('DELETE FROM Employee WHERE employeeNumber = ?', [employeeNumber]);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.employeeNumber, e.firstName, e.lastName, e.position, e.address, e.telephone, e.gender, e.hiredDate, e.departementCode, d.departementName
       FROM Employee e
       LEFT JOIN Department d ON e.departementCode = d.departementCode`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
