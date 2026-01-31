import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, FileText, AlertTriangle, 
  ShieldAlert, LogOut, CreditCard, Truck 
} from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    navigate('/login');
  };

  const menuGroups = [
    {
      label: 'Core Operations',
      items: [
        // Driver sees Dashboard as their "Mission Control"
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'AGENT', 'DRIVER'] },
        // Driver sees Shipments as "Assigned Cargo"
        { name: 'Shipments', path: '/shipments', icon: Truck, roles: ['ADMIN', 'AGENT', 'DRIVER', 'CLIENT'] },
      ]
    },
    {
      label: 'Financials',
      items: [
        { name: 'Invoices', path: '/invoices', icon: FileText, roles: ['ADMIN', 'AGENT', 'CLIENT'] },
        { name: 'Payments', path: '/payments', icon: CreditCard, roles: ['ADMIN', 'AGENT'] },
      ]
    },
    {
      label: 'Support & Safety',
      items: [
        // Drivers need this to report damage/delays
        { name: 'Incidents', path: '/incidents', icon: AlertTriangle, roles: ['ADMIN', 'AGENT', 'DRIVER'] },
        { name: 'Claims', path: '/claims', icon: ShieldAlert, roles: ['ADMIN', 'AGENT', 'CLIENT'] },
      ]
    }
  ];

  return (
    <div className="w-64 bg-[#004d40] min-h-screen flex flex-col text-white shadow-2xl z-20">
      <div className="p-8 border-b border-[#00695c] flex justify-center">
        <img src={logo} alt="ST&L" className="w-32 h-auto object-contain" />
      </div>

      <nav className="flex-1 mt-4 px-4 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, i) => {
          // Check if this user's role is allowed for any item in the group
          const filteredItems = group.items.filter(item => item.roles.includes(user?.role));
          
          if (filteredItems.length === 0) return null;

          return (
            <div key={i} className="mb-6">
              <p className="px-3 text-[10px] font-bold text-teal-200/50 uppercase tracking-widest mb-2">
                {group.label}
              </p>
              {filteredItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-xl mb-1 transition-all ${
                    location.pathname.startsWith(item.path) 
                      ? 'bg-white text-[#004d40] shadow-lg scale-[1.02]' 
                      : 'hover:bg-white/10 text-teal-50'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-semibold text-sm">
                    {/* Nice touch: customize names for Drivers */}
                    {user?.role === 'DRIVER' && item.name === 'Shipments' ? 'Assigned Cargo' : item.name}
                  </span>
                </Link>
              ))}
            </div>
          );
        })}
      </nav>

      {/* User Footer Profile Section */}
      <div className="p-4 bg-[#003d33] border-t border-[#00695c]">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${
            user?.role === 'DRIVER' ? 'bg-orange-500' : 'bg-teal-500'
          }`}>
            {user?.username?.[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">{user?.username}</p>
            <p className={`text-[10px] font-black uppercase tracking-tighter ${
               user?.role === 'DRIVER' ? 'text-orange-400' : 'text-teal-400'
            }`}>
              {user?.role}
            </p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center space-x-3 w-full p-3 text-red-300 hover:bg-red-500/10 rounded-xl transition font-bold text-sm group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;