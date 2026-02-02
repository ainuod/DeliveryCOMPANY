import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AlertTriangle, Camera, Upload, Send, X } from 'lucide-react';

const IncidentCreate = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference for the hidden input
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null); // State for image preview

  const [formData, setFormData] = useState({
    shipment_id: '',
    incident_type: 'PARCEL_DAMAGED',
    description: '',
    location: '',
    photo: null
  });

  useEffect(() => {
    // Fetch real shipments from the API
    api.get('/api/shipments/').then(res => {
      console.log('Shipments API response:', res.data);
      // Handle both paginated and non-paginated responses
      const shipmentData = res.data.results || res.data;
      setShipments(Array.isArray(shipmentData) ? shipmentData : []);
    }).catch(err => {
      console.error('Error fetching shipments:', err);
      // Fallback to empty array if API fails
      setShipments([]);
    });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPreview(URL.createObjectURL(file)); // Create a local URL for the preview
    }
  };

  const removePhoto = (e) => {
    e.stopPropagation(); // Prevent triggering the file input again
    setFormData({ ...formData, photo: null });
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('shipment_id', formData.shipment_id);
    data.append('incident_type', formData.incident_type);
    data.append('description', formData.description);
    data.append('location', formData.location);
    if (formData.photo) data.append('photo', formData.photo);

    try {
      await api.post('/api/incidents/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/shipments'); // Redirect to shipments after success
    } catch (error) {
      console.error('Incident creation error:', error);
      console.error('Error response:', error.response?.data);
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : 'Unknown error';
      alert(`Error reporting incident: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="text-red-500" /> Report Operational Incident
        </h1>
        <p className="text-slate-500">Document issues, delays, or damages for ST&L records.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 space-y-6">

        {/* Shipment Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Related Shipment</label>
          <select
            required
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-[#004d40] focus:ring-2 focus:ring-[#004d40]/10 transition"
            onChange={(e) => setFormData({ ...formData, shipment_id: e.target.value })}
          >
            <option value="">Select Shipment ID...</option>
            {shipments.map(s => (
              <option key={s.id} value={s.id}>Shipment #{s.id} - {s.client?.username}</option>
            ))}
          </select>
        </div>

        {/* Incident Type */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Type of Incident</label>
          <select
            className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-[#004d40] focus:ring-2 focus:ring-[#004d40]/10"
            value={formData.incident_type}
            onChange={(e) => setFormData({ ...formData, incident_type: e.target.value })}
          >
            <option value="PARCEL_DAMAGED">Parcel Damaged</option>
            <option value="DELIVERY_DELAYED">Delivery Delayed</option>
            <option value="LOST_ITEM">Lost Item</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        {/* Location & Description */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Current Location</label>
            <input
              type="text"
              required
              placeholder="e.g. Warehouse A, Paris Terminal"
              className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-[#004d40] transition"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description of Events</label>
            <textarea
              rows="4"
              required
              className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-[#004d40] transition"
              placeholder="Provide specific details about the incident..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>
        </div>

        {/* IMPROVED Photo Upload Area */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Visual Evidence</label>

          <div
            onClick={() => fileInputRef.current.click()} // Click the hidden input
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition cursor-pointer relative ${preview ? 'border-[#004d40] bg-[#004d40]/5' : 'border-slate-200 hover:border-[#004d40] bg-slate-50'
              }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />

            <div className="space-y-1 text-center">
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Incident" className="mx-auto h-32 w-32 object-cover rounded-lg shadow-md" />
                  <button
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                  >
                    <X size={14} />
                  </button>
                  <p className="mt-2 text-xs font-bold text-[#004d40]">{formData.photo.name}</p>
                </div>
              ) : (
                <>
                  <Camera className="mx-auto h-12 w-12 text-slate-400" />
                  <div className="text-sm text-slate-600">
                    <span className="font-bold text-[#004d40]">Click to upload</span> a photo
                  </div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">PNG, JPG up to 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition shadow-lg disabled:opacity-50"
        >
          {loading ? "Processing..." : <><Send size={18} /> Submit Official Incident Report</>}
        </button>
      </form>
    </div>
  );
};

export default IncidentCreate;