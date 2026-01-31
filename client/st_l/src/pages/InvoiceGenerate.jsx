import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';

const InvoiceGenerate = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([{ description: '', quantity: 1, price: 0 }]);

  const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }]);
  
  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={() => navigate('/invoices')} className="flex items-center text-slate-500 mb-6 hover:text-[#004d40]">
        <ArrowLeft size={18} className="mr-2" /> Back to List
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-[#004d40] p-8 text-white flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Generate New Invoice</h1>
          <div className="text-right">
            <p className="text-teal-200 text-sm uppercase font-bold tracking-widest">ST&L Logistics</p>
            <p className="text-xs opacity-70">Internal Billing System</p>
          </div>
        </div>

        <form className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Client Name</label>
              <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#004d40]" placeholder="Enter client name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Shipment Reference</label>
              <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#004d40]" placeholder="e.g. SHP-1092" />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 uppercase">Billing Items</label>
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Service description" />
                <input type="number" className="w-20 p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Qty" />
                <input type="number" className="w-32 p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Price" />
                <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addItem} className="flex items-center text-sm font-bold text-[#004d40] hover:underline">
              <Plus size={16} className="mr-1" /> Add Another Item
            </button>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <div className="text-2xl font-black text-slate-800">
              Total: ${calculateTotal().toLocaleString()}
            </div>
            <button type="button" className="bg-[#004d40] text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg hover:bg-[#00332b] transition-all">
              <Save size={18} className="mr-2" /> Finalize & Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceGenerate;