import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AiSuggestions = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select your CV PDF first.");

    setLoading(true);
    setHasSearched(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      // 🚀 Node.js Backend එකේ Port එක 5000 ලෙස උපකල්පනය කර ඇත
      const res = await fetch('http://localhost:5000/api/ai/suggest-jobs', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setResults(data.suggestions);
      } else {
        alert(data.error || "AI Analysis failed.");
      }
    } catch (error) {
      console.error("AI Server Error:", error);
      alert("Could not connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-slate-50 min-h-screen font-sans">
      <div className="text-center mb-10 space-y-2">
        <span className="bg-purple-50 text-purple-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          AI Child-Process Matcher
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smart AI Job Suggestions</h1>
        <p className="text-slate-500 max-w-md mx-auto text-sm">Upload your CV to extract keywords and compare directly with active vacancies.</p>
      </div>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-12">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-purple-200 p-6 rounded-xl bg-purple-50/30 text-center hover:bg-purple-50/60 transition-all relative">
            <input type="file" accept=".pdf" required onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="space-y-2">
              <div className="text-3xl">📄</div>
              <div className="text-sm font-semibold text-slate-700">{file ? `Selected: ${file.name}` : "Click to upload CV PDF"}</div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl text-sm disabled:bg-purple-400">
            {loading ? "AI is Scanning with Python..." : "Find Matching Jobs"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center text-slate-500">Comparing CV text weights with jobs...</div>
      ) : hasSearched && results.length === 0 ? (
        <div className="text-center text-slate-500">No matching vacancies found over 10% match.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
              <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 font-bold text-xs px-2.5 py-1 rounded-lg">
                🎯 {job.matchPercentage}% Match
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full uppercase">{job.jobType}</span>
              <h3 className="text-lg font-bold text-slate-800 mt-2">{job.jobTitle}</h3>
              <p className="text-xs text-slate-500 font-semibold">🏢 {job.companyId?.companyName || "Verified Employer"}</p>
              <p className="text-slate-600 text-xs mt-2 line-clamp-3">{job.jobDescription}</p>
              <div className="border-t border-slate-100 pt-3 mt-4 flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-600">{job.salaryRange}</span>
                <button onClick={() => navigate(`/apply-job/${job._id}`)} className="bg-slate-900 text-white text-xs px-4 py-2 rounded-xl">View & Apply</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiSuggestions;