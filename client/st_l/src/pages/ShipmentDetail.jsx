import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Package, MapPin, Calendar, ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

const ShipmentDetail = () => {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/api/shipments/${id}/`);
        setShipment(response.data);
      } catch (error) {
        console.error("Error fetching shipment detail:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div className="p-8 text-[#004d40]">Loading Shipment Details...</div>;
  if (!shipment) return <div className="p-8">Shipment not found.</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/shipments" className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-50 transition">
          <ArrowLeft size={20} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shipment #{shipment.id}</h1>
          <p className="text-slate-500 text-sm">Created on {new Date(shipment.created_at || Date.now()).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Route Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div className="flex items-start space-x-3">
              <MapPin className="text-red-500 mt-1" size={20} />
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Origin</p>
                <p className="font-semibold text-slate-800">{shipment.origin?.city}, {shipment.origin?.country}</p>
              </div>
            </div>
            <div className="flex-1 border-t-2 border-dashed border-slate-200 mx-8"></div>
            <div className="flex items-start space-x-3 text-right">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Destination</p>
                <p className="font-semibold text-slate-800">{shipment.destination?.city}, {shipment.destination?.country}</p>
              </div>
              <MapPin className="text-[#004d40] mt-1" size={20} />
            </div>
          </div>

          {/* Parcels List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center space-x-2">
                <Package size={18} />
                <span>Parcels in this Shipment</span>
              </h3>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Tracking Number</th>
                  <th className="px-6 py-3">Weight</th>
                  <th className="px-6 py-3">Dimensions (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {shipment.parcels?.map((parcel) => (
                  <tr key={parcel.id}>
                    <td className="px-6 py-4 font-mono font-medium text-[#004d40]">{parcel.tracking_number}</td>
                    <td className="px-6 py-4">{parcel.weight_kg} kg</td>
                    <td className="px-6 py-4">{parcel.length_cm}x{parcel.width_cm}x{parcel.height_cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Info Column */}
        <div className="space-y-6">
          {/* Status & Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest">Tracking Status</h3>
            <div className="space-y-6 relative">
              {/* Simple Vertical Stepper */}
              <div className="flex items-start space-x-4">
                <CheckCircle2 className="text-[#004d40] bg-white z-10" size={20} />
                <div>
                  <p className="text-sm font-bold text-slate-800">Shipment {shipment.status}</p>
                  <p className="text-xs text-slate-500">Current active status</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Circle className="text-slate-300 bg-white z-10" size={20} />
                <div>
                  <p className="text-sm font-bold text-slate-400">Arrived at Destination</p>
                  <p className="text-xs text-slate-400">Pending arrival</p>
                </div>
              </div>
              {/* Vertical Line Connector */}
              <div className="absolute left-[9px] top-5 w-[2px] h-12 bg-slate-100 -z-0"></div>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-[#004d40] text-white p-6 rounded-xl shadow-lg">
            <h3 className="text-sm font-bold opacity-70 uppercase mb-4 tracking-widest">Financial Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="opacity-80 text-sm">Service Type:</span>
                <span className="font-medium uppercase">{shipment.service_type}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/20 mt-4">
                <span>Total Cost</span>
                <span>${shipment.total_cost}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;