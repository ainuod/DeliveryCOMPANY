import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText, Search, Filter, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Added useAuth import

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUnpaid, setFilterUnpaid] = useState(false);
  const { user } = useAuth(); // 2. Destructure user

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        // --- DEBUG MOCK DATA ---
        const mockInvoices = [
          { id: 501, client: { username: 'Dounia_Logistics' }, due_date: '2023-11-15', montant_ttc: "1450.00", status: 'UNPAID' },
          { id: 502, client: { username: 'Dounia_Logistics' }, due_date: '2023-10-10', montant_ttc: "800.00", status: 'PAID' },
          { id: 503, client: { username: 'ST&L_Admin' }, due_date: '2023-11-20', montant_ttc: "2500.00", status: 'PARTIAL' }
        ];

        // 3. ROLE FILTERING: Clients only see their own bills
        if (user?.role === 'CLIENT') {
          const clientInvoices = mockInvoices.filter(inv => inv.client.username === user.username);
          setInvoices(clientInvoices);
        } else {
          setInvoices(mockInvoices);
        }

        // Keep this for when Django is ready:
        // const response = await api.get('/api/invoices/');
        // setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-100 text-emerald-700';
      case 'UNPAID': return 'bg-red-100 text-red-700';
      case 'PARTIAL': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const displayedInvoices = filterUnpaid
    ? invoices.filter(inv => inv.status === 'UNPAID')
    : invoices;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Invoices</h1>
          <p className="text-slate-500 text-sm">
            {user?.role === 'ADMIN' ? 'Billing and payment records for all clients' : 'Your billing and payment history'}
          </p>
        </div>

        {/* 4. RESTRICT GENERATION TO ADMIN ONLY */}
        {['ADMIN', 'AGENT'].includes(user?.role) && (
          <Link
            to="/invoices/generate"
            className="bg-[#004d40] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#00332b] transition shadow-md"
          >
            <FileText size={18} />
            <span className="font-bold">Generate Invoice</span>
          </Link>
        )}
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Outstanding</p>
          <p className="text-xl font-bold text-red-600">
            {invoices.reduce((acc, inv) => inv.status !== 'PAID' ? acc + parseFloat(inv.montant_ttc) : acc, 0).toFixed(2)} DZD
          </p>
        </div>

        <button
          onClick={() => setFilterUnpaid(!filterUnpaid)}
          className={`p-4 rounded-xl border transition-all text-left ${filterUnpaid ? 'border-[#004d40] bg-[#004d40]/5' : 'border-slate-100 bg-white shadow-sm'}`}
        >
          <p className="text-xs font-bold text-slate-400 uppercase">Quick Filter</p>
          <p className={`text-lg font-bold ${filterUnpaid ? 'text-[#004d40]' : 'text-slate-600'}`}>
            {filterUnpaid ? 'Unpaid Only' : 'Show All'}
          </p>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Invoice #</th>
              {/* 5. HIDE CLIENT NAME COLUMN FOR CLIENTS */}
              {user?.role === 'ADMIN' && (
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Client</th>
              )}
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount (TTC)</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-50 transition cursor-pointer">
                <td className="px-6 py-4 font-bold text-slate-700">INV-{invoice.id}</td>
                {user?.role === 'ADMIN' && (
                  <td className="px-6 py-4 text-slate-600 font-medium">{invoice.client?.username}</td>
                )}
                <td className="px-6 py-4 text-slate-600 font-medium text-sm">{invoice.due_date}</td>
                <td className="px-6 py-4 font-bold text-slate-800">{invoice.montant_ttc} DZD</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-black border ${getStatusStyle(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link to={`/invoices/${invoice.id}`} className="text-[#004d40] hover:text-[#00332b]">
                    <ChevronRight size={20} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayedInvoices.length === 0 && !loading && (
          <div className="p-10 text-center text-slate-400">No records found.</div>
        )}
      </div>
    </div>
  );
};

export default InvoicesList;