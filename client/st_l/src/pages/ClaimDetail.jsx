import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ClaimDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <button onClick={() => navigate('/claims')} className="text-[#004d40] mb-4">← Back to Claims</button>
      <h1 className="text-2xl font-bold">Claim Details for CLM-{id}</h1>
      <p className="mt-4 text-slate-600">Claim information and status tracking will appear here.</p>
    </div>
  );
};

export default ClaimDetail;