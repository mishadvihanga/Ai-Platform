import React from 'react';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium">Total System Users</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">1,240</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium">Active Job Posts</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">432</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium">Pending Verifications</h3>
          <p className="text-3xl font-bold text-amber-500 mt-2">5</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;