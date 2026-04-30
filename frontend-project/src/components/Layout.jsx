import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const navItems = [
  { path: '/employee', label: 'Employee' },
  { path: '/department', label: 'Department' },
  { path: '/salary', label: 'Salary' },
  { path: '/reports', label: 'Reports' },
];

function Layout({ children, onLogout }) {
  const navigate = useNavigate();

  const logout = async () => {
    await axios.post('/auth/logout');
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">SmartPark EPMS</h1>
          <p className="text-sm text-slate-300">Employee payroll and report management</p>
        </div>
        <button onClick={logout} className="bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-md">
          Logout
        </button>
      </header>
      <div className="flex flex-1">
        <nav className="w-56 bg-white border-r border-slate-200 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-slate-700 ${isActive ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
