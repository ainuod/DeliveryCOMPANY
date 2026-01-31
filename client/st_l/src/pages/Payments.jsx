import React from 'react';

const Payments = () => {
  const dummyPayments = [
    { id: 'PAY-001', invoice: 'INV-102', client: 'Global Logistics', date: '2023-10-25', amount: '$1,200', status: 'Completed' },
    { id: 'PAY-002', invoice: 'INV-105', client: 'FastWay Co', date: '2023-10-26', amount: '$450', status: 'Pending' },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payments</h1>
          <p className="text-slate-500">Track and manage client transactions</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Payment ID</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Invoice</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Client</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Amount</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyPayments.map((pay) => (
              <tr key={pay.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-medium text-slate-700">{pay.id}</td>
                <td className="p-4 text-slate-600">{pay.invoice}</td>
                <td className="p-4 text-slate-600">{pay.client}</td>
                <td className="p-4 font-bold text-slate-800">{pay.amount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    pay.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {pay.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;