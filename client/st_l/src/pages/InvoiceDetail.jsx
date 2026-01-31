import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { FileText, CreditCard, Receipt, Download, Plus } from 'lucide-react';

const InvoiceDetail = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({ amount: '', payment_method: 'BANK_TRANSFER' });

  const fetchInvoice = async () => {
    try {
      const response = await api.get(`/api/invoices/${id}/`);
      setInvoice(response.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvoice(); }, [id]);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/payments/', { ...paymentData, invoice_id: id });
      setShowPaymentModal(false);
      fetchInvoice(); // Refresh to show new payment and updated balance
    } catch (error) {
      alert("Error recording payment.");
    }
  };

  if (loading) return <div className="p-8 text-[#004d40]">Loading Invoice...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-[#004d40]" /> Invoice #INV-{invoice.id}
          </h1>
          <p className="text-sm text-slate-500 font-medium">Issued to: {invoice.client?.username}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
            <Download size={18} /> Print PDF
          </button>
          {invoice.status !== 'PAID' && (
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-[#004d40] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#00332b]"
            >
              <Plus size={18} /> Record Payment
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Shipment Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b bg-slate-50 font-bold text-slate-700">Included Shipments</div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-3">Shipment ID</th>
                  <th className="px-6 py-3">Route</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.shipments?.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 font-bold text-[#004d40]">#{s.id}</td>
                    <td className="px-6 py-4 text-slate-600">
                        {s.origin?.city} → {s.destination?.city}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">${s.total_cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment History Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b bg-slate-50 font-bold text-slate-700">Transaction History</div>
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-slate-100">
                {invoice.payments?.map((p) => (
                  <tr key={p.id} className="bg-emerald-50/30">
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <Receipt size={16} className="text-emerald-600" />
                      Payment Received ({p.payment_method.replace('_', ' ')})
                    </td>
                    <td className="px-6 py-4 text-slate-500">{new Date(p.payment_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-700">+ ${p.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Summary Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit space-y-6">
          <h3 className="font-bold text-slate-800">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-slate-500 text-sm">
              <span>Subtotal (HT)</span>
              <span>${invoice.montant_ht}</span>
            </div>
            <div className="flex justify-between text-slate-500 text-sm">
              <span>TVA (Tax)</span>
              <span>${invoice.montant_tva}</span>
            </div>
            <div className="pt-3 border-t flex justify-between font-bold text-lg text-slate-800">
              <span>Total (TTC)</span>
              <span>${invoice.montant_ttc}</span>
            </div>
          </div>
          <div className={`p-4 rounded-lg text-center font-bold ${
            invoice.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-600'
          }`}>
            Status: {invoice.status}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4 text-slate-800">Record a Payment</h2>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Amount Received ($)</label>
                <input 
                  type="number" step="0.01" required
                  className="w-full p-3 bg-slate-50 rounded-lg border focus:border-[#004d40] outline-none"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                  placeholder="e.g. 150.00"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Payment Method</label>
                <select 
                  className="w-full p-3 bg-slate-50 rounded-lg border focus:border-[#004d40] outline-none"
                  value={paymentData.payment_method}
                  onChange={(e) => setPaymentData({...paymentData, payment_method: e.target.value})}
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-3 text-slate-500 font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#004d40] text-white rounded-xl font-bold">Submit Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;