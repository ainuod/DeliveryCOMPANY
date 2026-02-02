import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Save, ArrowLeft, CheckSquare, Square } from 'lucide-react';

const InvoiceGenerate = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [shipments, setShipments] = useState([]);
  const [selectedShipmentIds, setSelectedShipmentIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await api.get('/api/users/?role=CLIENT');
        // Ensure we filter or backend filters
        setClients(res.data.filter(u => u.role === 'CLIENT'));
      } catch (err) {
        console.error("Failed to fetch clients", err);
      }
    };
    fetchClients();
  }, []);

  // 2. Fetch Uninvoiced Shipments when Client Selected
  useEffect(() => {
    if (!selectedClient) {
      setShipments([]);
      return;
    }
    const fetchShipments = async () => {
      try {
        // In a real app, you'd filter via query param, e.g. ?client_id=X&invoiced=false
        // Here we fetch all and filter in frontend for simplicity matching current backend
        const res = await api.get('/api/shipments/');
        const unInvoiced = res.data.filter(s =>
          s.client.id === parseInt(selectedClient) &&
          s.invoice === null &&
          s.status === 'DELIVERED' // Only invoice delivered items
        );
        setShipments(unInvoiced);
      } catch (err) {
        console.error("Failed to fetch shipments", err);
      }
    };
    fetchShipments();
  }, [selectedClient]);

  const toggleShipment = (id) => {
    if (selectedShipmentIds.includes(id)) {
      setSelectedShipmentIds(selectedShipmentIds.filter(sid => sid !== id));
    } else {
      setSelectedShipmentIds([...selectedShipmentIds, id]);
    }
  };

  const calculateTotal = () => {
    return shipments
      .filter(s => selectedShipmentIds.includes(s.id))
      .reduce((acc, s) => acc + parseFloat(s.total_cost || 0), 0);
  };

  const handleSubmit = async () => {
    if (selectedShipmentIds.length === 0) {
      alert("Please select at least one shipment.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        client_id: selectedClient,
        shipment_ids: selectedShipmentIds,
        status: 'UNPAID',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +30 days
      };
      await api.post('/api/invoices/', payload);
      alert("Invoice Generated Successfully!");
      navigate('/invoices');
    } catch (err) {
      console.error("Invoice Error:", err.response?.data);
      alert(`Error: ${JSON.stringify(err.response?.data || "Failed")}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button onClick={() => navigate('/dashboard')} className="flex items-center text-slate-500 mb-6 hover:text-[#004d40]">
        <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-[#004d40] p-8 text-white">
          <h1 className="text-2xl font-bold">Generate New Invoice</h1>
          <p className="text-teal-200 text-sm mt-1">Select a client and their delivered shipments to bill.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Select Client to Bill</label>
            <select
              className="w-full p-4 rounded-xl border border-slate-200 outline-none focus:border-[#004d40] bg-slate-50"
              onChange={(e) => { setSelectedClient(e.target.value); setSelectedShipmentIds([]); }}
              value={selectedClient}
            >
              <option value="">-- Choose Client --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.username} - {c.client_profile?.company_name}</option>
              ))}
            </select>
          </div>

          {/* Shipments List */}
          {selectedClient && (
            <div>
              <h3 className="font-bold text-slate-700 mb-4 flex justify-between items-center">
                <span>Billable Shipments (Delivered & Uninvoiced)</span>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{shipments.length} found</span>
              </h3>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {shipments.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                    No billable shipments found for this client.
                  </div>
                ) : (
                  shipments.map(s => (
                    <div
                      key={s.id}
                      onClick={() => toggleShipment(s.id)}
                      className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${selectedShipmentIds.includes(s.id)
                          ? 'border-[#004d40] bg-teal-50'
                          : 'border-slate-100 hover:border-[#004d40]/30'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        {selectedShipmentIds.includes(s.id) ? (
                          <CheckSquare className="text-[#004d40]" />
                        ) : (
                          <Square className="text-slate-300" />
                        )}
                        <div>
                          <p className="font-bold text-slate-700">Shipment #{s.id}</p>
                          <p className="text-xs text-slate-500">{s.origin.city} → {s.destination.city}</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-800">${s.total_cost}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Total & Submit */}
          {selectedShipmentIds.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center animate-in fade-in slide-in-from-bottom-4">
              <div>
                <p className="text-sm text-slate-500">Total Invoice Amount</p>
                <p className="text-3xl font-black text-[#004d40]">${calculateTotal().toFixed(2)}</p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-[#004d40] text-white px-8 py-4 rounded-xl font-bold flex items-center shadow-lg hover:bg-[#00332b] transition-all disabled:opacity-50"
              >
                <Save size={18} className="mr-2" />
                {loading ? 'Generating...' : 'Finalize Invoice'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerate;