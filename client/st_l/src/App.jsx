import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/MainLayout';

// Pages
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import ShipmentsList from './pages/ShipmentsList';
import ShipmentDetail from './pages/ShipmentDetail';
import ShipmentCreate from './pages/ShipmentCreate';
import InvoicesList from './pages/InvoicesList';
import InvoiceDetail from './pages/InvoiceDetail';
import IncidentCreate from './pages/IncidentCreate';
import IncidentsList from './pages/IncidentsList';
import IncidentDetail from './pages/IncidentDetail'; // Added this import
import ClaimsList from './pages/ClaimsList';
import ClaimCreate from './pages/ClaimCreate';
import ClaimDetail from './pages/ClaimDetail';

import Register from './pages/Register';
import Payments from './pages/Payments';
import InvoiceGenerate from './pages/InvoiceGenerate';

// 1. Dispatcher for Incidents (Wait for auth to be ready)
const IncidentDispatcher = () => {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === 'DRIVER' ? <IncidentCreate /> : <IncidentsList />;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#004d40] text-white font-bold tracking-widest">ST&L LOGISTICS...</div>;
  if (!user) return <Navigate to="/login" />;

  // If role is missing or not allowed, redirect to login or show error
  if (!user.role || (allowedRoles && !allowedRoles.includes(user.role))) {
    console.warn("Access Denied: Invalid Role", user.role);
    return <Navigate to="/login" />;
  }

  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'AGENT', 'DRIVER', 'CLIENT']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/payments" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']}>
              <Payments />
            </ProtectedRoute>
          } />

          <Route path="/shipments" element={<ProtectedRoute><ShipmentsList /></ProtectedRoute>} />
          <Route path="/shipments/create" element={<ProtectedRoute allowedRoles={['ADMIN', 'AGENT', 'CLIENT']}><ShipmentCreate /></ProtectedRoute>} />
          <Route path="/shipments/:id" element={<ProtectedRoute><ShipmentDetail /></ProtectedRoute>} />

          <Route path="/invoices" element={<ProtectedRoute><InvoicesList /></ProtectedRoute>} />
          <Route path="/invoices/generate" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']}><InvoiceGenerate /></ProtectedRoute>
          } />

          <Route path="/incidents" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'AGENT', 'DRIVER']}>
              <IncidentDispatcher />
            </ProtectedRoute>
          } />

          <Route path="/incidents/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']}>
              <IncidentDetail />
            </ProtectedRoute>
          } />

          <Route path="/claims" element={<ProtectedRoute><ClaimsList /></ProtectedRoute>} />

          <Route path="/claims/create" element={<ProtectedRoute allowedRoles={['CLIENT']}><ClaimCreate /></ProtectedRoute>} />
          {/* Note: If you don't have ClaimDetail.jsx yet, comment this next line out to prevent the error */}
          <Route path="/claims/:id" element={<ProtectedRoute><ClaimDetail /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;