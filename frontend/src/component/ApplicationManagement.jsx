import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VacancyManagement from '../component/VacancyManagement';

const ApplicationManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // Applications සඳහා අවශ්‍ය States
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal එක පාලනය කිරීමට States
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionType, setActionType] = useState(""); // "Accepted" හෝ "Rejected"
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ආරක්ෂාව සඳහා company කෙනෙක් නෙමෙයි නම් පිටුපසට හරවා යැවීම
  useEffect(() => {
    if (!user || user.accounttype !== 'company') {
      alert('Access Denied: Company Accounts Only!');
      navigate('/');
    }
  }, [user, navigate]);

  // සමාගමට ලැබී ඇති Applications, DB එකෙන් Fetch කරගැනීම
  useEffect(() => {
    if (user && user._id && activeTab === 'applications') {
      const fetchApplications = async () => {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:5000/api/company/${user._id}/applications`);
          const data = await res.json();
          if (res.ok) {
            setApplications(data.applications);
          } else {
            setError(data.message);
          }
        } catch (err) {
          setError("Failed to load applications.");
        } finally {
          setLoading(false);
        }
      };
      fetchApplications();
    }
  }, [activeTab]);

  if (!user || user.accounttype !== 'company') return null;

  // Status එක සර්වර් එකට යැවීම (Accept/Reject සහ Mail එක Trigger කිරීම)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!actionType || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/company/applications/${selectedApp._id}/review`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: actionType, reviewNote: note }),
      });

      const data = await res.json();
      if (res.ok) {
        // UI එකේ පෙනෙන Table list එක ක්ෂණිකව Update කිරීම
        setApplications(prev => 
          prev.map(app => app._id === selectedApp._id ? { ...app, status: actionType, reviewNote: note } : app)
        );
        setSelectedApp(null);
        setNote("");
        setActionType("");
        alert(data.message);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      alert("Server error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const openReviewModal = (app, type) => {
    setSelectedApp(app);
    setActionType(type);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r p-5 space-y-6">
        <div className="text-center pb-4 border-b">
          <h2 className="text-lg font-bold text-gray-800 truncate">{user.companyName || 'My Company'}</h2>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium uppercase mt-1 inline-block">Employer Profile</span>
        </div>
        <nav className="space-y-1">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            📊 Dashboard Overview
          </button>
          <button onClick={() => setActiveTab('vacancies')} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'vacancies' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            📢 Vacancy Management
          </button>
          <button onClick={() => setActiveTab('applications')} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'applications' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
            📥 Application Management
          </button>
        </nav>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-grow p-8">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.fullname}!</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-sm font-medium text-gray-400 uppercase">Total Job Posts</h3>
                <p className="text-3xl font-bold text-blue-600 mt-1">📊 Manage via tab</p>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-sm font-medium text-gray-400 uppercase">Received Applications</h3>
                <p className="text-3xl font-bold text-orange-500 mt-1">{applications.length || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="text-sm font-medium text-gray-400 uppercase">Profile Status</h3>
                <p className="text-3xl font-bold text-green-500 mt-1">Verified ✅</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. VACANCIES TAB */}
        {activeTab === 'vacancies' && <VacancyManagement />}

        {/* 3. APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Application Management</h1>
              <p className="text-sm text-slate-500">Review, accept or reject candidates who applied for your jobs.</p>
            </div>

            {loading && <div className="text-slate-500 text-sm">Loading applications...</div>}
            {error && <div className="text-red-500 text-sm">{error}</div>}

            {!loading && !error && applications.length === 0 ? (
              <div className="p-8 border border-dashed rounded-xl text-center text-slate-400 bg-white shadow-xs">
                No applications received yet for your job postings.
              </div>
            ) : (!loading && !error && (
              <div className="overflow-x-auto border border-slate-100 rounded-xl shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                      <th className="p-4">Applicant</th>
                      <th className="p-4">Position</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Resume</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {applications.map((app) => {
                      // 💡 DB එකේ status එකක් නැති පරණ records තිබුණොත් auto 'Pending' ලෙස සලකා බටන්ස් පෙන්වයි
                      const currentStatus = app.status || 'Pending';

                      return (
                        <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-800">{app.username}</div>
                            <div className="text-xs text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-blue-600">{app.vacancyId?.jobTitle || "Deleted Position"}</span>
                            <div className="text-xs text-slate-400">{app.vacancyId?.jobType} • {app.vacancyId?.location}</div>
                          </td>
                          <td className="p-4">
                            <div>{app.email}</div>
                            <div className="text-xs text-slate-500">{app.phoneNumber}</div>
                          </td>
                          <td className="p-4">
                            {/* 🛠️ FIX: CV එක Download නොවී බ්‍රවුසර් එකේම View වීමට target="_blank" සහ rel="noopener noreferrer" යොදන ලදි */}
                            <a 
                              href={app.cvUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 font-semibold hover:underline bg-blue-50 px-2.5 py-1 rounded-md text-xs inline-block"
                            >
                              📄 View CV
                            </a>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              currentStatus === 'Accepted' ? 'bg-green-100 text-green-700' :
                              currentStatus === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {currentStatus}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {currentStatus === 'Pending' ? (
                              <div className="flex justify-center gap-2">
                                <button 
                                  onClick={() => openReviewModal(app, "Accepted")}
                                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-2.5 py-1.5 rounded-md font-bold transition-all shadow-xs"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => openReviewModal(app, "Rejected")}
                                  className="bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1.5 rounded-md font-bold transition-all shadow-xs"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Reviewed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ================= ✉️ NOTE & CONFIRMATION MODAL ================= */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {actionType === "Accepted" ? "🎉 Accept Application" : "🚫 Reject Application"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a custom message. This note will be emailed directly to <strong>{selectedApp.username}</strong>.
            </p>

            <form onSubmit={handleReviewSubmit}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={actionType === "Accepted" ? "e.g., Congratulations! We would like to invite you for an interview..." : "e.g., Thank you for your interest. Unfortunately, we decided to proceed with another candidate..."}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm h-32 focus:outline-none focus:border-blue-500 text-slate-700 mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2 text-white font-bold rounded-xl text-sm shadow-sm transition-all ${
                    actionType === "Accepted" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {submitting ? "Processing..." : `Confirm & Send`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicationManagement;