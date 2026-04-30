import { useEffect, useState } from 'react';
import axios from 'axios';

function ReportsPage() {
  const [payrolls, setPayrolls] = useState([]);

  useEffect(() => {
    axios.get('/reports/payroll').then((response) => {
      setPayrolls(response.data);
    });
  }, []);

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-3xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Monthly Payroll Report</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-700">
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((item, index) => (
                <tr key={`${item.firstName}-${item.lastName}-${index}`} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">{item.firstName} {item.lastName}</td>
                  <td className="px-4 py-3">{item.position}</td>
                  <td className="px-4 py-3">{item.department}</td>
                  <td className="px-4 py-3">{item.month}</td>
                  <td className="px-4 py-3">{item.netSalary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ReportsPage;
