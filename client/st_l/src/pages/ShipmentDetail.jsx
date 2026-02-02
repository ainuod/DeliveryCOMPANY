import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Package, MapPin, ArrowLeft, CheckCircle2, Circle, Truck, CheckCircle } from 'lucide-react';

const ShipmentDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/api/shipments/${id}/`);
        setShipment(response.data);
      } catch (error) {
        console.error(`Error fetching shipment detail for ID: ${id}`, error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const response = await api.patch(`/api/shipments/${id}/`, { status: newStatus });
      setShipment(response.data);
      alert(`Shipment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update shipment status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-[#004d40]">Loading Shipment Details...</div>;
  if (!shipment) return <div className="p-8">Shipment not found.</div>;

  const isDriver = user?.role === 'DRIVER';
  const canUpdateStatus = isDriver && shipment.status !== 'DELIVERED' && shipment.status !== 'CANCELLED';

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
                <p className="text-lg font-bold text-slate-800">{shipment.origin_detail?.city}, {shipment.origin_detail?.country}</p>
              </div>
            </div>
            <div className="text-slate-300 text-2xl">→</div>
            <div className="flex items-start space-x-3">
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Destination</p>
                <p className="text-lg font-bold text-slate-800">{shipment.destination_detail?.city}, {shipment.destination_detail?.country}</p>
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

            {/* Driver Status Update Buttons */}
            {canUpdateStatus && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Update Status</p>

                {shipment.status === 'PENDING' && (
                  <button
                    onClick={() => updateStatus('IN_TRANSIT')}
                    disabled={updating}
                    className="w-full bg-amber-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-amber-600 transition disabled:opacity-50"
                  >
                    <Truck size={18} />
                    Mark as In Transit
                  </button>
                )}

                {shipment.status === 'IN_TRANSIT' && (
                  <button
                    onClick={() => updateStatus('DELIVERED')}
                    disabled={updating}
                    className="w-full bg-emerald-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Mark as Delivered
                  </button>
                )}
              </div>
            )}
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