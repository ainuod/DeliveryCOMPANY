import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ShieldAlert, Clock, CheckCircle, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Added import

const ClaimsList = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // 2. Destructure user

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        // --- DEBUG MOCK DATA ---
        const mockClaims = [
          { 
            id: 1, 
            reason: 'Damaged Goods', 
            description: 'The pallet arrived with water damage on the outer casing.', 
            client: { username: 'Dounia_Logistics' }, 
            status: 'UNDER_REVIEW' 
          },
          { 
            id: 2, 
            reason: 'Delayed Delivery', 
            description: 'Shipment #1024 is 3 days behind schedule.', 
            client: { username: 'Dounia_Logistics' }, 
            status: 'RESOLVED' 
          },
          { 
            id: 3, 
            reason: 'Missing Items', 
            description: 'One box is missing from the total count of 50.', 
            client: { username: 'Other_Client' }, 
            status: 'RECEIVED' 
          }
        ];

        // 3. ROLE FILTERING
        if (user?.role === 'CLIENT') {
          // Clients only see claims they created
          setClaims(mockClaims.filter(c => c.client.username === user.username));
        } else {
          // Admins see everything
          setClaims(mockClaims);
        }

        // const response = await api.get('/api/claims/');
        // setClaims(response.data);
      } catch (error) {
        console.error("Error fetching claims:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'RECEIVED': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {user?.role === 'ADMIN' ? 'Customer Claims' : 'Your Claims'}
          </h1>
          <p className="text-slate-500 text-sm">
            {user?.role === 'ADMIN' ? 'Monitor and resolve service disputes' : 'Track the status of your reported issues'}
          </p>
        </div>
        
        {/* 4. ONLY CLIENTS CAN CREATE NEW CLAIMS */}
        {user?.role === 'CLIENT' && (
          <Link 
            to="/claims/create"
            className="bg-[#004d40] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#00332b] transition shadow-md font-bold"
          >
            <Plus size={18} />
            <span>New Claim</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {claims.length > 0 ? (
          claims.map((claim) => (
            <div key={claim.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-[#004d40] transition group">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-[#004d40]/5 transition">
                    <ShieldAlert className="text-[#004d40]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{claim.reason}</h3>
                    <p className="text-sm text-slate-500 max-w-xl">{claim.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {/* Only show client name to Admin */}
                      {user?.role === 'ADMIN' && <span>Client: {claim.client?.username}</span>}
                      {user?.role === 'ADMIN' && <span>•</span>}
                      <span>Ref: CLM-{claim.id}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getStatusStyle(claim.status)}`}>
                    {claim.status.replace('_', ' ')}
                  </span>
                  <Link 
                    to={`/claims/${claim.id}`} 
                    className="text-sm font-black text-[#004d40] hover:text-[#00332b] flex items-center gap-1 mt-2"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50 rounded-2xl p-16 text-center text-slate-400 border-2 border-dashed border-slate-200">
            No claims recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsList;