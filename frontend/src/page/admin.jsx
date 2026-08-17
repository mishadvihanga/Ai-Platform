import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../component/admin_dashboard';
import AdminCompanyRequest from '../component/admin_ComapnyRequest';
import AdminMessages from '../component/AdminMessages';

const AdminCenter = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // Admin කෙනෙක් නෙමෙයි නම් කෙලින්ම Home එකට පන්නනවා
  useEffect(() => {
    if (!loggedInUser || loggedInUser.accounttype !== 'admin') {
      alert('Access Denied: Admins Only!');
      navigate('/');
    }
  }, [loggedInUser, navigate]);

  if (!loggedInUser || loggedInUser.accounttype !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Side Menu */}
      <div className="w-64 bg-slate-900 text-white p-5 space-y-6">
        <h2 className="text-xl font-bold border-b border-slate-700 pb-3 text-green-400">🛡️ Admin Panel</h2>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`w-full text-left px-4 py-2.5 rounded transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            📊 Dashboard Overview
          </button>
          <button 
            onClick={() => setActiveTab('requests')} 
            className={`w-full text-left px-4 py-2.5 rounded transition-all ${activeTab === 'requests' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            🏢 Company Requests
          </button>
          <button 
            onClick={() => setActiveTab('messages')} 
            className={`w-full text-left px-4 py-2.5 rounded transition-all ${activeTab === 'messages' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            📩 Messages
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-8">
        {activeTab === 'dashboard' ? <AdminDashboard /> : <AdminCompanyRequest />}
        {activeTab === 'messages' ? <AdminMessages /> : null}
      </div>
    </div>
  );
};

export default AdminCenter;