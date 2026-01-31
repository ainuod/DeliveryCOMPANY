import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { Truck, Package, Clock, CheckCircle, AlertTriangle, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth(); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          if (user?.role === 'ADMIN' || user?.role === 'AGENT') {
            setData({
              kpis: { tours_in_progress: 42 },
              shipment_summary: { total: 1250, in_transit: 85, delivered: 1100, pending: 65 }
            });
          } else if (user?.role === 'DRIVER') {
            // Driver specific mock data
            setData({
              active_route: "DZ-ALGIERS-ANNABA-01",
              current_shipment: { id: 1024, destination: "Annaba Terminal", status: "In Transit" }
            });
          } else {
            setData({
              kpis: { tours_in_progress: 2 },
              shipment_summary: { total: 15, in_transit: 3, delivered: 10, pending: 2 }
            });
          }
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-[#004d40] font-bold animate-pulse text-xl tracking-widest">
        ST&L LOADING...
      </div>
    </div>
  );

  // --- 1. DRIVER SPECIFIC VIEW ---
  if (user?.role === 'DRIVER') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="bg-[#004d40] p-8 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold italic">Hello, {user.username}</h1>
            <p className="opacity-80 mt-2 font-medium flex items-center gap-2">
              <Truck size={18} /> Route: {data?.active_route}
            </p>
          </div>
          <Truck className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10 rotate-12" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Mission Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Active Shipment</span>
                <Package className="text-slate-300" size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-800">#{data?.current_shipment?.id}</h3>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><MapPin size={18} /></div>
                  <p className="text-sm font-bold text-slate-600">{data?.current_shipment?.destination}</p>
                </div>
              </div>
            </div>
            
            <Link to={`/shipments/${data?.current_shipment?.id}`} className="mt-8 w-full bg-[#004d40] text-white py-4 rounded-xl font-bold text-center hover:bg-black transition-all flex items-center justify-center gap-2">
              View Cargo Details <ChevronRight size={18} />
            </Link>
          </div>

          {/* Incident Quick Action */}
          <Link to="/incidents" className="bg-red-50 p-8 rounded-3xl border border-red-100 flex flex-col items-center justify-center group hover:bg-red-500 transition-all duration-300">
             <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
               <AlertTriangle className="text-red-500" size={32} />
             </div>
             <h3 className="text-red-700 font-black text-xl group-hover:text-white">Report Incident</h3>
             <p className="text-red-500/70 text-sm text-center mt-2 group-hover:text-white/80 font-medium">Damage or Delays</p>
          </Link>
        </div>
      </div>
    );
  }

  // --- 2. ADMIN / AGENT / CLIENT VIEW (Analytics) ---
  const summary = data?.shipment_summary || {};
  const statCards = [
    { title: 'Total Shipments', value: summary.total || 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'In Progress', value: summary.in_transit || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Active Tours', value: data?.kpis?.tours_in_progress || 0, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Delivered', value: summary.delivered || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {user?.role === 'ADMIN' ? 'Operational Dashboard' : user?.role === 'AGENT' ? 'Agent Console' : 'Client Overview'}
          </h1>
          <p className="text-slate-500 text-sm">
            Welcome back, <span className="font-semibold text-[#004d40]">{user?.username}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition-shadow cursor-default">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.title}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-75">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Shipment Volume</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-100 rounded-2xl">
             <p className="text-slate-400 font-medium">Recharts Visualization Active for {user?.role}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Status Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(summary).map(([key, val]) => (
              <div key={key} className="flex justify-between items-center border-b pb-3 last:border-0 border-slate-50">
                <span className="capitalize text-sm font-semibold text-slate-500">{key.replace('_', ' ')}</span>
                <span className="font-black text-[#004d40]">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;