CREATE DATABASE IF NOT EXISTS EPMS CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE EPMS;

CREATE TABLE IF NOT EXISTS Department (
  departementCode VARCHAR(10) PRIMARY KEY,
  departementName VARCHAR(100) NOT NULL,
  grossSalary DECIMAL(12,2) NOT NULL,
  totalDeduction DECIMAL(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Employee (
  employeeNumber VARCHAR(20) PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  telephone VARCHAR(50),
  gender VARCHAR(20),
  hiredDate DATE,
  departementCode VARCHAR(10),
  FOREIGN KEY (departementCode) REFERENCES Department(departementCode)
    ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Salary (
  salaryId INT AUTO_INCREMENT PRIMARY KEY,
  employeeNumber VARCHAR(20) NOT NULL,
  month VARCHAR(20) NOT NULL,
  grossSalary DECIMAL(12,2) NOT NULL,
  totalDeduction DECIMAL(12,2) NOT NULL,
  netSalary DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (employeeNumber) REFERENCES Employee(employeeNumber)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(255),
  email VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO Department (departementCode, departementName, grossSalary, totalDeduction)
VALUES
  ('CW', 'Carwash', 300000.00, 20000.00),
  ('ST', 'Stock', 200000.00, 5000.00),
  ('MC', 'Mechanic', 450000.00, 40000.00),
  ('ADMS', 'Administration Staff', 600000.00, 70000.00);
