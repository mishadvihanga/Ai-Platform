import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ApplyJob = () => {
  const { id } = useParams(); // URL එකෙන් Vacancy ID එක ලබා ගැනීම
  const navigate = useNavigate();

  // Local Storage දත්ත
  const currentUserId = localStorage.getItem('userId') || "user123"; // Test ID එකක්

  // States
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields (Auto-filled from LocalStorage)
  const [formData, setFormData] = useState({
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    phoneNumber: localStorage.getItem('phoneNumber') || '',
  });
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    const fetchJobDetailsAndHistory = async () => {
      try {
        // 1. ජොබ් එකේ විස්තර ලබාගැනීම
        const resJob = await fetch(`http://localhost:5000/api/vacancies/${id}`);
        const dataJob = await resJob.json();
        if (resJob.ok) setJob(dataJob);

        // 2. Userගේ ඉතිහාසය (Saved / Applied status) පරීක්ෂා කිරීම
        const resHistory = await fetch(`http://localhost:5000/api/applications/history/${currentUserId}`);
        if (resHistory.ok) {
          const history = await resHistory.json();
          
          // දැනටමත් සේව් කර ඇත්දැයි බැලීම
          const savedCheck = history.savedVacancies?.some(item => item.vacancyId === id);
          setIsSaved(savedCheck);

          // දැනටමත් ඇප්ලයි කර ඇත්දැයි බැලීම
          const appliedCheck = history.appliedVacancies?.some(item => item.vacancyId === id);
          setIsApplied(appliedCheck);
        }
      } catch (error) {
        console.error("Error fetching application details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetailsAndHistory();
  }, [id, currentUserId]);

  // Save / Unsave Toggle කිරීම
  const handleSaveToggle = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/applications/save-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, vacancyId: id })
      });
      if (res.ok) {
        setIsSaved(!isSaved); // Toggle state locally
      }
    } catch (error) {
      console.error("Error toggling save status:", error);
    }
  };

  // Form එක Submit කිරීම (CV එක සමඟ)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) return alert('Please upload your CV.');

    setSubmitting(true);
    const uploadData = new FormData();
    uploadData.append('vacancyId', id);
    uploadData.append('userId', currentUserId);
    uploadData.append('username', formData.username);
    uploadData.append('email', formData.email);
    uploadData.append('phoneNumber', formData.phoneNumber);
    uploadData.append('cv', cvFile); // Backend Multer 'cv' field

    try {
      const res = await fetch('http://localhost:5000/api/applications/apply', {
        method: 'POST',
        body: uploadData
      });
      const data = await res.json();
      if (res.ok) {
        alert('Application submitted successfully!');
        setIsApplied(true); // Applied status එක true කරයි
      } else {
        alert(data.message || 'Submission failed.');
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-medium text-slate-500">Loading vacancy details...</div>;
  if (!job) return <div className="text-center py-20 text-red-500 font-bold">Vacancy not found!</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-slate-50 min-h-screen font-sans">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
        ← Back to Explorations
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* වම්පස: රැකියාවේ විස්තර (Job Summary Card) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 h-fit relative">
          <button 
            onClick={handleSaveToggle}
            className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-all"
            title={isSaved ? "Unsave Job" : "Save Job"}
          >
            <svg className={`w-5 h-5 ${isSaved ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>

          <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{job.jobType}</span>
          <h2 className="text-xl font-bold text-slate-900 mt-3">{job.jobTitle}</h2>
          <p className="text-sm text-blue-600 font-semibold mt-1">🏢 {job.companyId?.companyName || 'Verified Employer'}</p>
          
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3 text-sm text-slate-600">
            <div>📍 <span className="font-medium text-slate-800">{job.location}</span></div>
            {job.salaryRange && <div>💰 <span className="font-semibold text-emerald-600">{job.salaryRange}</span></div>}
          </div>
          <p className="text-xs text-slate-500 mt-6 leading-relaxed bg-slate-50 p-3 rounded-xl">{job.jobDescription}</p>
        </div>

        {/* දකුණුපස: ඇප්ලිකේෂන් ෆෝම් එක (Application Form Card) */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200/80">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Job Application Form</h3>
          <p className="text-sm text-slate-500 mb-6">Please check your detail and upload your latest curriculum vitae (CV).</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Full Name</label>
              <input 
                type="text" required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Email Address</label>
              <input 
                type="email" required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Phone Number</label>
              <input 
                type="text" required
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* CV File Input */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Upload CV (PDF or Doc format)</label>
              <div className="border-2 border-dashed border-slate-200 p-4 rounded-xl bg-slate-50 text-center hover:bg-slate-100/50 transition-all relative">
                <input 
                  type="file" required={!isApplied} accept=".pdf,.doc,.docx"
                  disabled={isApplied}
                  onChange={(e) => setCvFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="text-slate-500 text-sm font-medium">
                  {cvFile ? `📂 Selected: ${cvFile.name}` : "Drag and drop or click to upload your file"}
                </div>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-4 border-t">
              {isApplied ? (
                <button type="button" disabled className="w-full py-3.5 bg-emerald-100 text-emerald-700 font-bold rounded-xl text-sm flex justify-center items-center gap-2">
                  ✓ Successfully Applied
                </button>
              ) : (
                <button 
                  type="submit" disabled={submitting}
                  className="w-full py-3.5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm hover:shadow-md disabled:bg-slate-400"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;