import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import EmployeePage from './components/EmployeePage';
import DepartmentPage from './components/DepartmentPage';
import SalaryPage from './components/SalaryPage';
import ReportsPage from './components/ReportsPage';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:4000/api';

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get('/auth/session').then((response) => {
      setAuthenticated(response.data.authenticated);
    });
  }, []);

  const handleLogin = () => setAuthenticated(true);
  const handleLogout = () => setAuthenticated(false);

  return (
    <BrowserRouter>
      {!authenticated ? (
        <Routes>
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/employee" />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/department" element={<DepartmentPage />} />
            <Route path="/salary" element={<SalaryPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<Navigate to="/employee" />} />
          </Routes>
        </Layout>
      )}
    </BrowserRouter>
  );
}

export default App;
