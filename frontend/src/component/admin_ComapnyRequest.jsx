import React, { useState, useEffect } from 'react';

const AdminCompanyRequest = () => {
  const [requests, setRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null); // Email එක යනකන් loading පෙන්වන්න state එකක්
  const token = localStorage.getItem('token');

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/pending-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (userId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this request?`)) return;

    setProcessingId(userId); // Loading start
    try {
      const res = await fetch('http://localhost:5000/api/admin/handle-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, action })
      });
      const data = await res.json();
      alert(data.message);
      fetchRequests(); 
    } catch (error) {
      alert('Error handling request');
    } finally {
      setProcessingId(null); // Loading stop
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Company Verification Requests</h1>
      
      {requests.length === 0 ? (
        <div className="bg-white p-6 rounded-xl text-center text-gray-500 border">No pending company verification requests found.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800 text-white text-sm">
                <th className="p-4">Applicant</th>
                <th className="p-4">Company Details</th>
                <th className="p-4">BR Document</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-slate-50 text-sm">
                  <td className="p-4">
                    <p className="font-bold text-gray-800">{req.fullname}</p>
                    <p className="text-gray-500 text-xs">{req.email}</p>
                    <p className="text-gray-500 text-xs">{req.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-blue-600">{req.companyName}</p>
                    <p className="text-gray-600 text-xs">{req.companyEmail}</p>
                    <p className="text-gray-500 text-xs">{req.companyAddress}</p>
                  </td>
                  <td className="p-4">
                    <a href={req.brDocumentUrl} target="_blank" rel="noreferrer" className="text-blue-500 underline font-medium hover:text-blue-700">
                      📄 View BR File
                    </a>
                  </td>
                  <td className="p-4 text-center">
                    {processingId === req._id ? (
                      <span className="text-amber-600 font-medium text-xs animate-pulse">Processing & Mailing...</span>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button onClick={() => handleAction(req._id, 'approve')} className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors">
                          Approve
                        </button>
                        <button onClick={() => handleAction(req._id, 'reject')} className="bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors">
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCompanyRequest;