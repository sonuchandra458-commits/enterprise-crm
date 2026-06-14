import { useLocation } from 'react-router-dom';
import { LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const titles = {
  '/':           'Dashboard',
  '/leads':      'Leads',
  '/deals':      'Deals',
  '/customers':  'Customers',
  '/activities': 'Activities',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-900">
        {titles[pathname] || 'CRM Pro'}
      </h1>
      <div className="flex items-center gap-2">
        <button className="btn-ghost relative">
          <Bell size={18} />
        </button>
        <button onClick={handleLogout} className="btn-ghost flex items-center gap-2 text-red-600 hover:bg-red-50">
          <LogOut size={16} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </header>
  );
}