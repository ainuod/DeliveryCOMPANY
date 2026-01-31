import React, { useState, useEffect } from 'react';
import { AlertCircle, Eye, CheckCircle, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const IncidentsList = () => {
  const [incidents, setIncidents] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Mock Data for the Admin to see
    const mockIncidents = [
      {
        id: 1,
        shipment_id: 1024,
        incident_type: 'PARCEL_DAMAGED',
        location: 'Paris Warehouse',
        description: 'Forklift punctured the side of the wooden crate during loading.',
        status: 'PENDING',
        reported_by: 'Driver_Alpha',
        date: '2023-10-27'
      },
      {
        id: 2,
        shipment_id: 1025,
        incident_type: 'DELIVERY_DELAYED',
        location: 'Lyon Transit',
        description: 'Heavy snow blocked the mountain pass; 24h delay expected.',
        status: 'RESOLVED',
        reported_by: 'Agent_Smith',
        date: '2023-10-26'
      }
    ];
    setIncidents(mockIncidents);
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Incidents</h1>
          <p className="text-slate-500 text-sm">Review damage reports and transit delays</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Shipment</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Location</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Reporter</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-slate-50/50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className={incident.incident_type === 'PARCEL_DAMAGED' ? 'text-red-500' : 'text-amber-500'} />
                    <span className="font-bold text-slate-700 text-sm">{incident.incident_type.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-medium">#{incident.shipment_id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <MapPin size={14} />
                    {incident.location}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">{incident.reported_by}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusBadge(incident.status)}`}>
                    {incident.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#004d40] hover:text-[#00332b] font-bold text-sm flex items-center gap-1 ml-auto">
                    <Eye size={16} /> Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentsList;