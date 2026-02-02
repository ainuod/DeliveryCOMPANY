import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Search, Plus, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ShipmentsList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await api.get('/api/shipments/');
        setShipments(response.data);
      } catch (error) {
        console.error("Error fetching shipments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchShipments();
    }
  }, [user]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'IN_TRANSIT': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredShipments = shipments.filter(s =>
    s.id.toString().includes(searchTerm) ||
    s.client?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {user?.role === 'DRIVER' ? "My Assigned Cargo" : "Shipments"}
          </h1>
          <p className="text-slate-500 text-sm">
            {user?.role === 'ADMIN'
              ? "Manage and track all ST&L cargo"
              : user?.role === 'DRIVER'
                ? "Review your current delivery route"
                : "Track your active deliveries and history"}
          </p>
        </div>

        {/* Only Admin/Agent can create new shipments */}
        {['ADMIN', 'AGENT'].includes(user?.role) && (
          <Link
            to="/shipments/create"
            className="bg-[#004d40] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#00332b] transition shadow-md"
          >
            <Plus size={20} />
            <span>New Shipment</span>
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by ID..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-[#004d40]/20 focus:border-[#004d40] transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID / Tracking</th>
              {/* Only show client name to Admin/Agent/Driver (Driver might need contact info) */}
              {user?.role !== 'CLIENT' && (
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
              )}
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Destination</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cost</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredShipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-700">#{shipment.id}</td>
                {user?.role !== 'CLIENT' && (
                  <td className="px-6 py-4 text-slate-600 font-medium">{shipment.client?.username || 'N/A'}</td>
                )}
                <td className="px-6 py-4 text-slate-600">
                  {shipment.destination?.city}, {shipment.destination?.country}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black border ${getStatusStyle(shipment.status)}`}>
                    {shipment.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">{shipment.total_cost} DZD</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    to={`/shipments/${shipment.id}`}
                    className="inline-flex items-center space-x-1 text-[#004d40] hover:text-[#00332b] font-bold text-sm"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredShipments.length === 0 && !loading && (
          <div className="p-10 text-center text-slate-400">No shipments found for your profile.</div>
        )}
      </div>
    </div>
  );
};

export default ShipmentsList;