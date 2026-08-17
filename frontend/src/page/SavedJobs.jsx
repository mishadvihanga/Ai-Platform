import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SavedJobs = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem('userId') || "user123";

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/history/${currentUserId}`);
      const data = await res.json();
      if (res.ok && data.savedVacancies) {
        setSavedJobs(data.savedVacancies);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [currentUserId]);

  // මෙතනදීම Unsave කිරීමට ඇති පහසුකම
  const handleRemoveSave = async (vacancyId) => {
    try {
      const res = await fetch('http://localhost:5000/api/applications/save-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, vacancyId })
      });
      if (res.ok) {
        // ලිස්ට් එකෙන් සැනින් ඉවත් කිරීම
        setSavedJobs(savedJobs.filter(item => (item.vacancyId?._id || item.vacancyId) !== vacancyId));
        alert("Job removed from saved list.");
      }
    } catch (error) {
      console.error("Error removing saved job:", error);
    }
  };

  if (loading) return <div className="text-center py-20 font-medium text-slate-500">Loading saved jobs...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 bg-slate-50 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Saved Bookmarks</h1>
        <p className="text-sm text-slate-500 mt-1">Your curated list of jobs you want to review or apply later.</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center bg-white p-16 rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto mt-10">
          <div className="text-4xl mb-3">⭐</div>
          <h3 className="text-lg font-bold text-slate-800">Your List is Empty</h3>
          <p className="text-slate-500 text-xs mt-1 mb-4">Click the bookmark icon on any job card while exploring to save it here.</p>
          <button onClick={() => navigate('/explore')} className="bg-slate-950 text-white font-semibold text-xs px-4 py-2 rounded-xl">Explore Vacancies</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedJobs.map((item) => {
            const job = item.vacancyId; // Populate වී එන දත්ත කොටස
            if (!job) return null;

            return (
              <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col justify-between relative group">
                {/* Remove Bookmark Button */}
                <button 
                  onClick={() => handleRemoveSave(job._id)} 
                  className="absolute top-4 right-4 p-2 rounded-full bg-amber-50 hover:bg-red-50 text-amber-500 hover:text-red-500 transition-colors"
                  title="Remove from saved"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>

                <div>
                  <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-full uppercase">{job.jobType || "Full-time"}</span>
                  <h3 className="text-xl font-bold text-slate-800 mt-3 pr-6">{job.jobTitle}</h3>
                  <p className="text-sm text-slate-500 font-medium">🏢 {job.companyId?.companyName || "Verified Employer"}</p>
                  <p className="text-slate-600 text-sm mt-3 line-clamp-2">{job.jobDescription}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center">
                  <span className="text-xs font-semibold text-emerald-600">💰 {job.salaryRange || "Negotiable"}</span>
                  <button 
                    onClick={() => navigate(`/apply-job/${job._id}`)}
                    className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    Apply Now →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;