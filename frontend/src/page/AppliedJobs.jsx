import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
  const navigate = useNavigate();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem('userId') || "user123";

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        // History එක සාමාන්‍යයෙන් Vacancy details එක්ක Populate කරලා ගන්න එක ලේසියි.
        // නැතහොත් අපි History එකෙන් එන IDs වලට අදාළ ජොබ් විස්තර පෙන්වමු.
        const res = await fetch(`http://localhost:5000/api/applications/history/${currentUserId}`);
        const data = await res.json();
        
        if (res.ok && data.appliedVacancies) {
          setAppliedJobs(data.appliedVacancies);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [currentUserId]);

  if (loading) return <div className="text-center py-20 font-medium text-slate-500">Loading your applications...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 bg-slate-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Applied Applications</h1>
          <p className="text-sm text-slate-500 mt-1">Track the status of your submitted job applications.</p>
        </div>
        <button onClick={() => navigate('/explore')} className="text-xs bg-slate-900 text-white font-bold px-4 py-2 rounded-xl hover:bg-blue-600 transition-all">
          Explore More Jobs
        </button>
      </div>

      {appliedJobs.length === 0 ? (
        <div className="text-center bg-white p-16 rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto mt-10">
          <div className="text-4xl mb-3">📄</div>
          <h3 className="text-lg font-bold text-slate-800">No Applications Yet</h3>
          <p className="text-slate-500 text-xs mt-1 mb-4">You haven't applied for any jobs yet. Start matching your skills now!</p>
          <button onClick={() => navigate('/explore')} className="bg-blue-600 text-white font-semibold text-xs px-4 py-2 rounded-xl">Browse Jobs</button>
        </div>
      ) : (
        <div className="space-y-4">
          {appliedJobs.map((item) => (
            <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all">
              <div>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-1 rounded-full uppercase">Submitted</span>
                {/* සටහන: Backend එකෙන් .populate('appliedVacancies.vacancyId') කරලා තිබිය යුතුයි සම්පූර්ණ දත්ත පෙනෙන්න */}
                <h3 className="text-lg font-bold text-slate-800 mt-2">{item.vacancyId?.jobTitle || "Job Title"}</h3>
                <p className="text-sm text-slate-500 font-medium">🏢 {item.vacancyId?.companyId?.companyName || "Verified Company"}</p>
                <p className="text-xs text-slate-400 mt-2">📅 Applied on: {new Date(item.appliedAt).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={() => navigate(`/apply-job/${item.vacancyId?._id || item.vacancyId}`)}
                className="w-full sm:w-auto text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-colors text-center"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;