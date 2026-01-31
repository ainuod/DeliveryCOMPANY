import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MessageSquare, AlertCircle, Save } from 'lucide-react';

const ClaimCreate = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [formData, setFormData] = useState({
    incident_id: '',
    reason: '',
    description: ''
  });

  useEffect(() => {
    // Fetch user's incidents to link to the claim
    api.get('/api/incidents/').then(res => setIncidents(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/claims/', formData);
      navigate('/claims');
    } catch (error) {
      alert("Error filing claim.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">File a Claim</h1>
        <p className="text-slate-500">Provide details for your request to be processed by ST&L.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Linked Incident (Optional)</label>
          <select 
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-[#004d40]"
            onChange={(e) => setFormData({...formData, incident_id: e.target.value})}
          >
            <option value="">Select an incident if applicable...</option>
            {incidents.map(i => (
              <option key={i.id} value={i.id}>Incident #{i.id} - {i.incident_type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Claim</label>
          <input 
            type="text" required
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-[#004d40]"
            placeholder="e.g. Compensation for damaged goods"
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 text-slate-600 uppercase text-[10px]">Detailed Explanation</label>
          <textarea 
            rows="5" required
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-[#004d40]"
            placeholder="Describe what happened and what resolution you are seeking..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-[#004d40] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#00332b] shadow-lg transition"
        >
          <Save size={18}/> Submit Formal Claim
        </button>
      </form>
    </div>
  );
};

export default ClaimCreate;