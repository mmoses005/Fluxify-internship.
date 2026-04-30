import { useEffect, useState } from 'react';
import axios from 'axios';

function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    employeeNumber: '',
    firstName: '',
    lastName: '',
    position: '',
    address: '',
    telephone: '',
    gender: 'Male',
    hiredDate: '',
    departementCode: '',
  });

  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      setMessage(`Error fetching employees: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/departments');
      setDepartments(response.data);
    } catch (error) {
      setMessage(`Error fetching departments: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (!form.employeeNumber || !form.firstName || !form.lastName || !form.position) {
        throw new Error('Please fill in all required fields (Employee Number, First Name, Last Name, Position)');
      }

      if (editingEmployee) {
        await axios.put(`/employees/${editingEmployee.employeeNumber}`, {
          firstName: form.firstName,
          lastName: form.lastName,
          position: form.position,
          address: form.address,
          telephone: form.telephone,
          gender: form.gender,
          hiredDate: form.hiredDate,
          departementCode: form.departementCode,
        });
        setMessage('Employee updated successfully!');
      } else {
        await axios.post('/employees', form);
        setMessage('Employee created successfully!');
      }

      setEditingEmployee(null);
      setForm({
        employeeNumber: '',
        firstName: '',
        lastName: '',
        position: '',
        address: '',
        telephone: '',
        gender: 'Male',
        hiredDate: '',
        departementCode: '',
      });
      await fetchEmployees();
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setForm({
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      address: employee.address || '',
      telephone: employee.telephone || '',
      gender: employee.gender || 'Male',
      hiredDate: employee.hiredDate ? employee.hiredDate.slice(0, 10) : '',
      departementCode: employee.departementCode || '',
    });
    setMessage('Editing employee. Make changes and click save.');
  };

  const handleDelete = async (employeeNumber) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setLoading(true);
    setMessage('');
    try {
      await axios.delete(`/employees/${employeeNumber}`);
      setMessage('Employee deleted successfully.');
      await fetchEmployees();
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployee(null);
    setForm({
      employeeNumber: '',
      firstName: '',
      lastName: '',
      position: '',
      address: '',
      telephone: '',
      gender: 'Male',
      hiredDate: '',
      departementCode: '',
    });
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold">{editingEmployee ? 'Edit Employee' : 'Create Employee'}</h2>
            <p className="text-sm text-slate-500">{editingEmployee ? 'Update the selected employee record.' : 'Add a new employee to the system.'}</p>
          </div>
          {editingEmployee && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl px-4 py-2"
            >
              Cancel Edit
            </button>
          )}
        </div>
        {message && (
          <div className={`mb-4 rounded-md px-4 py-3 ${message.startsWith('Error') ? 'bg-rose-100 text-rose-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {[
            { label: 'Employee Number', name: 'employeeNumber', required: true },
            { label: 'First Name', name: 'firstName', required: true },
            { label: 'Last Name', name: 'lastName', required: true },
            { label: 'Position', name: 'position', required: true },
            { label: 'Address', name: 'address' },
            { label: 'Telephone', name: 'telephone' },
            { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'] },
            { label: 'Hired Date', name: 'hiredDate', type: 'date' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-slate-700 font-medium mb-1">
                {field.label}
                {field.required && <span className="text-rose-600">*</span>}
              </label>
              {field.type === 'select' ? (
                <select
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                >
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  required={field.required}
                  disabled={editingEmployee && field.name === 'employeeNumber'}
                />
              )}
            </div>
          ))}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Department Code</label>
            <select
              value={form.departementCode}
              onChange={(e) => setForm({ ...form, departementCode: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">Select department</option>
              {departments.map((department) => (
                <option key={department.departementCode} value={department.departementCode}>
                  {department.departementCode} - {department.departementName}
                </option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-slate-800'} text-white rounded-xl px-6 py-3`}
            >
              {loading ? 'Saving...' : 'Save Employee'}
            </button>
          </div>
        </form>
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Employee List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-700">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Telephone</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((item) => (
                <tr key={item.employeeNumber} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">{item.employeeNumber}</td>
                  <td className="px-4 py-3">{item.firstName} {item.lastName}</td>
                  <td className="px-4 py-3">{item.position}</td>
                  <td className="px-4 py-3">{item.departementName || item.departementCode}</td>
                  <td className="px-4 py-3">{item.telephone}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.employeeNumber)}
                      className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 hover:bg-rose-100"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default EmployeePage;
