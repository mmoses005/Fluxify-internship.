import { useEffect, useState } from 'react';
import axios from 'axios';

function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ departementCode: '', departementName: '', grossSalary: '', totalDeduction: '' });

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      setMessage(`Error fetching departments: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!form.departementCode || !form.departementName || !form.grossSalary || !form.totalDeduction) {
        throw new Error('Please fill in all required fields');
      }
      await axios.post('/departments', form);
      setMessage('Department created successfully!');
      setForm({ departementCode: '', departementName: '', grossSalary: '', totalDeduction: '' });
      await fetchDepartments();
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Create Department</h2>
        {message && (
          <div className={`mb-4 rounded-md px-4 py-3 ${message.startsWith('Error') ? 'bg-rose-100 text-rose-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            { label: 'Department Code', name: 'departementCode' },
            { label: 'Department Name', name: 'departementName' },
            { label: 'Gross Salary', name: 'grossSalary', type: 'number' },
            { label: 'Total Deduction', name: 'totalDeduction', type: 'number' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-slate-700 font-medium mb-1">{field.label}</label>
              <input
                type={field.type || 'text'}
                value={form[field.name]}
                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>
          ))}
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'} text-white rounded-xl px-6 py-3`}
            >
              {loading ? 'Saving...' : 'Save Department'}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Department List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-700">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Gross Salary</th>
                <th className="px-4 py-3">Deduction</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((item) => (
                <tr key={item.departementCode} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">{item.departementCode}</td>
                  <td className="px-4 py-3">{item.departementName}</td>
                  <td className="px-4 py-3">{item.grossSalary}</td>
                  <td className="px-4 py-3">{item.totalDeduction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default DepartmentPage;
