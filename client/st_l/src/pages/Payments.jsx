import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('/api/payments/');
        setPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="p-8">Loading payments...</div>;

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
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Method</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pay) => (
              <tr key={pay.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="p-4 font-medium text-slate-700">#{pay.id}</td>
                <td className="p-4 text-slate-600">Invoice #{pay.invoice_id}</td>
                <td className="p-4 text-slate-600">{pay.client_username}</td>
                <td className="p-4 font-bold text-slate-800">${pay.amount}</td>
                <td className="p-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    {pay.payment_method}
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