import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post(`${API_BASE}/auth/register`, { username, email, password });
      setSuccess('Registration complete. Redirecting...');
      onRegister();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Create Your Account</h2>
        <p className="text-sm text-slate-500 mb-6">Register now to access employee payroll and report management.</p>
        {error && <div className="mb-4 rounded-md bg-rose-100 text-rose-700 px-4 py-3">{error}</div>}
        {success && <div className="mb-4 rounded-md bg-emerald-100 text-emerald-700 px-4 py-3">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
          <button className="w-full bg-slate-800 text-white rounded-xl px-4 py-3 hover:bg-slate-900">Register</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/" className="font-semibold text-slate-900 hover:text-slate-700">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
