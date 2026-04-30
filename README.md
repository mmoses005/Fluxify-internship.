# Employee Payroll Management System (EPMS)

This project contains a backend and frontend for SmartPark payroll management.

## Structure

- `Full-StacK_Task_1/backend-project`: Node.js + Express backend with MySQL support.
- `Full-StacK_Task_1/frontend-project`: React + Vite frontend with Tailwind CSS.

## Backend setup

1. Copy `.env.example` to `.env`.
2. Configure MySQL connection values.
3. Run SQL script in `backend-project/sql/epms_schema.sql` to create the database and seed departments.
4. Install dependencies:
   - `cd Full-StacK_Task_1/backend-project`
   - `npm install`
5. Start backend:
   - `npm run dev`

## Frontend setup

1. Install dependencies:
   - `cd Full-StacK_Task_1/frontend-project`
   - `npm install`
2. Start frontend:
   - `npm run dev`

## Login

Default credentials:
- username: `admin`
- password: `password123`
