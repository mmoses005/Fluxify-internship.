import { useEffect, useState } from 'react';
import axios from 'axios';

function SalaryPage() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    employeeNumber: '',
    month: '',
    paymentType: 'Salary',
    payGrade: 'Mid-level Developer',
    grossSalary: '',
    totalDeduction: '',
    bonus: '',
    netSalary: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get('/salaries');
      setSalaries(response.data);
    } catch (error) {
      setMessage(`Error fetching salaries: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      setMessage(`Error fetching employees: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchSalaries();
    fetchEmployees();
  }, []);

  const calculateNetSalary = ({ grossSalary, totalDeduction, bonus }) => {
    const gross = Number(grossSalary || 0);
    const deduction = Number(totalDeduction || 0);
    const bonusValue = Number(bonus || 0);
    return (gross - deduction + bonusValue).toFixed(2);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!form.employeeNumber || !form.month || !form.grossSalary || !form.totalDeduction) {
        throw new Error('Please fill in all required salary fields');
      }

      const payload = {
        ...form,
        netSalary: calculateNetSalary(form),
      };

      if (editingId) {
        await axios.put(`/salaries/${editingId}`, payload);
        setMessage('Salary updated successfully!');
        setEditingId(null);
      } else {
        await axios.post('/salaries', payload);
        setMessage('Salary created successfully!');
      }
      setForm({ employeeNumber: '', month: '', paymentType: 'Salary', payGrade: 'Mid-level Developer', grossSalary: '', totalDeduction: '', bonus: '', netSalary: '' });
      await fetchSalaries();
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (salary) => {
    setEditingId(salary.salaryId);
    setForm({
      employeeNumber: salary.employeeNumber,
      month: salary.month,
      paymentType: salary.paymentType || 'Salary',
      payGrade: salary.payGrade || 'Mid-level Developer',
      grossSalary: salary.grossSalary,
      totalDeduction: salary.totalDeduction,
      bonus: salary.bonus || '',
      netSalary: salary.netSalary,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        await axios.delete(`/salaries/${id}`);
        setMessage('Salary deleted successfully!');
        await fetchSalaries();
      } catch (error) {
        setMessage(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const formatCurrency = (value) => {
    if (value === '' || value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value));
  };

  const totalNet = salaries.reduce((sum, item) => sum + Number(item.netSalary || 0), 0);
  const totalGross = salaries.reduce((sum, item) => sum + Number(item.grossSalary || 0), 0);
  const totalEmployeesPaid = new Set(salaries.map((item) => item.employeeNumber)).size;

  return (
    <div className="space-y-6">
      <section className="bg-slate-950 text-slate-100 p-6 rounded-3xl shadow-xl shadow-slate-200/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Developer Payroll</p>
            <h2 className="mt-2 text-3xl font-semibold">Professional Salary Management</h2>
            <p className="mt-3 max-w-2xl text-slate-300">Track earnings, deductions, and net pay for technical staff with a clean developer-focused payroll experience.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-800 p-4 ring-1 ring-white/10">
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Employees paid</div>
              <div className="mt-3 text-3xl font-semibold text-white">{totalEmployeesPaid}</div>
            </div>
            <div className="rounded-3xl bg-slate-800 p-4 ring-1 ring-white/10">
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Total gross</div>
              <div className="mt-3 text-3xl font-semibold text-emerald-300">{formatCurrency(totalGross)}</div>
            </div>
            <div className="rounded-3xl bg-slate-800 p-4 ring-1 ring-white/10">
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400">Total net</div>
              <div className="mt-3 text-3xl font-semibold text-cyan-300">{formatCurrency(totalNet)}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Salary Entry</h2>
            <p className="text-sm text-slate-500">Create or update a payroll record for your developer team.</p>
          </div>
          {message && (
            <div className={`rounded-full px-4 py-2 text-sm font-medium ${message.startsWith('Error') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {message}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr] mt-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Developer</label>
              <select
                value={form.employeeNumber}
                onChange={(e) => setForm({ ...form, employeeNumber: e.target.value })}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                required
              >
                <option value="">Select developer</option>
                {employees.map((employee) => (
                  <option key={employee.employeeNumber} value={employee.employeeNumber}>
                    {employee.firstName} {employee.lastName} ({employee.employeeNumber})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Payroll month</label>
              <input
                type="month"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Payment type</label>
            <select
              value={form.paymentType}
              onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
            >
              <option value="Salary">Salary</option>
              <option value="Bonus">Bonus</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Developer level</label>
            <select
              value={form.payGrade}
              onChange={(e) => setForm({ ...form, payGrade: e.target.value })}
              className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
            >
              <option value="Junior Developer">Junior Developer</option>
              <option value="Mid-level Developer">Mid-level Developer</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Lead Developer">Lead Developer</option>
              <option value="Engineering Manager">Engineering Manager</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { name: 'grossSalary', label: 'Gross Salary' },
              { name: 'totalDeduction', label: 'Total Deduction' },
              { name: 'bonus', label: 'Bonus' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-slate-700 font-medium mb-1">{field.label}</label>
                <input
                  type="number"
                  value={form[field.name]}
                  onChange={(e) => {
                    const value = e.target.value;
                    const nextForm = { ...form, [field.name]: value };
                    nextForm.netSalary = calculateNetSalary(nextForm);
                    setForm(nextForm);
                  }}
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                  min="0"
                  step="0.01"
                  required={field.name !== 'bonus'}
                />
              </div>
            ))}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Net Salary</label>
              <input
                type="text"
                value={calculateNetSalary(form)}
                readOnly
                className="w-full rounded-3xl border border-slate-300 bg-slate-100 px-4 py-3 text-slate-900"
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ employeeNumber: '', month: '', paymentType: 'Salary', payGrade: 'Mid-level Developer', grossSalary: '', totalDeduction: '', bonus: '', netSalary: '' });
                  setMessage('');
                }}
                className="rounded-full border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'} rounded-full px-7 py-3 text-white transition-all duration-150`}
            >
              {loading ? 'Saving...' : editingId ? 'Update Salary' : 'Save Salary'}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Salary Records</h2>
            <p className="text-sm text-slate-500">Review payroll history and manage developer compensation.</p>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-700">
                <th className="px-4 py-3">Developer</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Gross</th>
                <th className="px-4 py-3">Deduction</th>
                <th className="px-4 py-3">Net</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-6 text-center text-slate-500">No salary records available.</td>
                </tr>
              ) : (
                salaries.map((item) => (
                  <tr key={item.salaryId} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{item.firstName} {item.lastName}</td>
                    <td className="px-4 py-3 text-slate-600">{item.departementName}</td>
                    <td className="px-4 py-3 text-slate-600">{item.month}</td>
                    <td className="px-4 py-3 text-slate-600">{item.paymentType || 'Salary'}</td>
                    <td className="px-4 py-3 text-slate-600">{item.payGrade || 'Mid-level Developer'}</td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">{formatCurrency(item.grossSalary)}</td>
                    <td className="px-4 py-3 text-rose-600">{formatCurrency(item.totalDeduction)}</td>
                    <td className="px-4 py-3 text-cyan-600 font-semibold">{formatCurrency(item.netSalary)}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-full border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.salaryId)}
                        className="rounded-full border border-rose-300 px-4 py-2 text-rose-700 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default SalaryPage;
