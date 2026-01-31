import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';

// A wrapper to protect routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading ST&L...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/shipments" />; // Redirect clients away from Admin pages
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Staff Only */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Shared or Client Specific */}
          <Route path="/shipments" element={
            <ProtectedRoute>
              {/* This page logic will handle filtering by user.role internally */}
              <div>Shipments List Page (Coming Soon)</div>
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
           <ProtectedRoute allowedRoles={['ADMIN', 'AGENT']}>
             <MainLayout>
               <Dashboard />
             </MainLayout>
           </ProtectedRoute>
           } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;