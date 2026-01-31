import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Plus, Trash2, Save, Package, MapPin } from 'lucide-react';

const ShipmentCreate = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [clients, setClients] = useState([]); // Only needed for Admin/Agent
  
  const [formData, setFormData] = useState({
    client_id: '',
    origin_id: '',
    destination_id: '',
    service_type: 'STANDARD',
    parcels: [{ weight_kg: '', length_cm: '', width_cm: '', height_cm: '' }]
  });

  useEffect(() => {
    // Fetch destinations and clients for the dropdowns
    const fetchData = async () => {
      const [destRes, clientRes] = await Promise.all([
        api.get('/api/destinations/'),
        api.get('/api/users/') // Adjust if you have a specific client endpoint
      ]);
      setDestinations(destRes.data);
      setClients(clientRes.data.filter(u => u.role === 'CLIENT'));
    };
    fetchData();
  }, []);

  const addParcel = () => {
    setFormData({
      ...formData,
      parcels: [...formData.parcels, { weight_kg: '', length_cm: '', width_cm: '', height_cm: '' }]
    });
  };

  const removeParcel = (index) => {
    const newParcels = formData.parcels.filter((_, i) => i !== index);
    setFormData({ ...formData, parcels: newParcels });
  };

  const handleParcelChange = (index, field, value) => {
    const newParcels = [...formData.parcels];
    newParcels[index][field] = value;
    setFormData({ ...formData, parcels: newParcels });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/shipments/', formData);
      navigate('/shipments');
    } catch (error) {
      alert("Error creating shipment. Please check the data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Create New Shipment</h1>
        <p className="text-slate-500">Fill in the details to generate a tracking number.</p>
      </div>

      {/* Route & Client Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Select Client</label>
          <select 
            className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:border-[#004d40]"
            onChange={(e) => setFormData({...formData, client_id: e.target.value})}
            required
          >
            <option value="">Choose a client...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.username} - {c.client_profile?.company_name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <MapPin size={16} className="text-red-500"/> Origin
          </label>
          <select 
            className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:border-[#004d40]"
            onChange={(e) => setFormData({...formData, origin_id: e.target.value})}
            required
          >
            <option value="">Select Origin...</option>
            {destinations.map(d => <option key={d.id} value={d.id}>{d.city}, {d.country}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
            <MapPin size={16} className="text-[#004d40]"/> Destination
          </label>
          <select 
            className="w-full p-3 rounded-lg border border-slate-200 outline-none focus:border-[#004d40]"
            onChange={(e) => setFormData({...formData, destination_id: e.target.value})}
            required
          >
            <option value="">Select Destination...</option>
            {destinations.map(d => <option key={d.id} value={d.id}>{d.city}, {d.country}</option>)}
          </select>
        </div>
      </div>

      {/* Dynamic Parcels Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package size={20} className="text-[#004d40]"/> Parcels
          </h3>
          <button 
            type="button" 
            onClick={addParcel}
            className="text-sm font-bold text-[#004d40] hover:underline flex items-center gap-1"
          >
            <Plus size={16}/> Add Another Parcel
          </button>
        </div>

        {formData.parcels.map((parcel, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative animate-in fade-in slide-in-from-top-2">
            {index > 0 && (
              <button 
                type="button" 
                onClick={() => removeParcel(index)}
                className="absolute top-4 right-4 text-red-400 hover:text-red-600"
              >
                <Trash2 size={18}/>
              </button>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Weight (kg)</label>
                <input 
                  type="number" step="0.1"
                  className="w-full p-2 border-b-2 border-slate-100 focus:border-[#004d40] outline-none"
                  value={parcel.weight_kg}
                  onChange={(e) => handleParcelChange(index, 'weight_kg', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Length (cm)</label>
                <input 
                  type="number"
                  className="w-full p-2 border-b-2 border-slate-100 focus:border-[#004d40] outline-none"
                  value={parcel.length_cm}
                  onChange={(e) => handleParcelChange(index, 'length_cm', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Width (cm)</label>
                <input 
                  type="number"
                  className="w-full p-2 border-b-2 border-slate-100 focus:border-[#004d40] outline-none"
                  value={parcel.width_cm}
                  onChange={(e) => handleParcelChange(index, 'width_cm', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Height (cm)</label>
                <input 
                  type="number"
                  className="w-full p-2 border-b-2 border-slate-100 focus:border-[#004d40] outline-none"
                  value={parcel.height_cm}
                  onChange={(e) => handleParcelChange(index, 'height_cm', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        type="submit" 
        className="w-full bg-[#004d40] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#00332b] transition flex items-center justify-center gap-2"
      >
        <Save size={20}/> Create Shipment & Generate Tracking
      </button>
    </form>
  );
};

export default ShipmentCreate;