# EPMS ERD Design

## Entities

1. Employee
   - employeeNumber (PK)
   - firstName
   - lastName
   - position
   - address
   - telephone
   - gender
   - hiredDate
   - departementCode (FK)

2. Department
   - departementCode (PK)
   - departementName
   - grossSalary
   - totalDeduction

3. Salary
   - salaryId (PK)
   - employeeNumber (FK)
   - month
   - grossSalary
   - totalDeduction
   - netSalary

## Relationships

- Department has many Employees (1-to-many)
- Employee belongs to one Department (many-to-1)
- Employee has many Salary records (1-to-many)
- Salary belongs to one Employee (many-to-1)

## Cardinalities

- Department (1) — (M) Employee
- Employee (1) — (M) Salary

## Notes

- `departementCode` is the foreign key on `Employee`.
- `employeeNumber` is the foreign key on `Salary`.
- `grossSalary` and `totalDeduction` are stored on `Salary` so each payroll month can be tracked separately.
