import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, User, 
  Package, CheckCircle, AlertCircle, Clock 
} from 'lucide-react';

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    // Mock Data for the specific incident
    const mockDetail = {
      id: id,
      shipment_id: 1024,
      type: 'PARCEL_DAMAGED',
      location: 'Paris Terminal - Gate 4',
      reported_by: 'Driver_Sam',
      date: '2023-10-27 14:30',
      description: 'During offloading, the wooden crate was found with a significant puncture on the left side. It appears a forklift blade made contact. The internal electronics might be exposed to moisture.',
      status: 'PENDING',
      photo_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000' // Mock damage photo
    };

    setIncident(mockDetail);
    setLoading(false);
  }, [id]);

  const handleResolve = () => {
    alert(`Incident #${id} has been marked as RESOLVED. An update has been sent to the client.`);
    navigate('/incidents');
  };

  if (loading) return <div className="p-10 text-center font-bold text-[#004d40]">Loading Incident Data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Navigation */}
      <button 
        onClick={() => navigate('/incidents')}
        className="flex items-center gap-2 text-slate-500 hover:text-[#004d40] font-bold transition"
      >
        <ArrowLeft size={20} /> Back to Incidents
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Evidence Photo */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-2 rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <img 
              src={incident.photo_url} 
              alt="Damage Evidence" 
              className="w-full h-[400px] object-cover rounded-2xl"
            />
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Detailed Description</h2>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl italic">
              "{incident.description}"
            </p>
          </div>
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div className="flex justify-between items-start">
              <span className={`px-4 py-1 rounded-full text-xs font-black border ${
                incident.status === 'PENDING' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {incident.status}
              </span>
              <p className="text-slate-400 text-xs font-bold uppercase">Incident #{incident.id}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Package size={18} /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Shipment</p>
                  <p className="text-sm font-bold text-slate-700">#{incident.shipment_id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><MapPin size={18} /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Location</p>
                  <p className="text-sm font-bold text-slate-700">{incident.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><User size={18} /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Reported By</p>
                  <p className="text-sm font-bold text-slate-700">{incident.reported_by}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Clock size={18} /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Timestamp</p>
                  <p className="text-sm font-bold text-slate-700">{incident.date}</p>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* ACTION BUTTONS */}
            <div className="space-y-3">
              <button 
                onClick={handleResolve}
                className="w-full bg-[#004d40] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#00332b] transition shadow-lg"
              >
                <CheckCircle size={18} /> Resolve Incident
              </button>
              <button className="w-full bg-white text-slate-600 py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition">
                Contact Reporter
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
            <div className="flex gap-3 text-amber-700">
              <AlertCircle size={24} />
              <div>
                <p className="font-bold text-sm">System Note</p>
                <p className="text-xs opacity-80 mt-1">Resolving this incident will notify the client and unlock the shipment for further billing.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default IncidentDetail;