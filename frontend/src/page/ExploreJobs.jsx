import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 🚀 Navigation සඳහා

const ExploreJobs = () => {
  const navigate = useNavigate(); // 🚀 Navigation instance
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters සඳහා States
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchSalary, setSearchSalary] = useState('');

  // සියලුම රැකියා ලබාගැනීම
  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/vacancies/all');
        const data = await res.json();
        if (res.ok) {
          setJobs(data);
          setFilteredJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllJobs();
  }, []);

  // Filter Logic
  useEffect(() => {
    let tempJobs = jobs;
    if (searchTitle.trim() !== '') {
      tempJobs = tempJobs.filter(job => job.jobTitle.toLowerCase().includes(searchTitle.toLowerCase()));
    }
    if (selectedType !== 'All') {
      tempJobs = tempJobs.filter(job => job.jobType === selectedType);
    }
    if (searchLocation.trim() !== '') {
      tempJobs = tempJobs.filter(job => job.location.toLowerCase().includes(searchLocation.toLowerCase()));
    }
    if (searchSalary.trim() !== '') {
      tempJobs = tempJobs.filter(job => job.salaryRange.toLowerCase().includes(searchSalary.toLowerCase()));
    }
    setFilteredJobs(tempJobs);
  }, [searchTitle, selectedType, searchLocation, searchSalary, jobs]);

  const handleClearFilters = () => {
    setSearchTitle('');
    setSelectedType('All');
    setSearchLocation('');
    setSearchSalary('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-slate-50 min-h-screen font-sans">
      
      {/* --- Header Section --- */}
      <div className="text-center mb-12 space-y-3">
        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Discover Your Future
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Explore Exciting Opportunities</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-base sm:text-lg">Find the perfect job that fits your skills, experience, and lifestyle.</p>
      </div>

      {/* --- Advanced Filter Bar Container --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
            Filter Vacancies
          </h2>
          {(searchTitle || selectedType !== 'All' || searchLocation || searchSalary) && (
            <button onClick={handleClearFilters} className="text-xs text-red-500 hover:text-red-600 font-semibold transition-colors">Clear All Filters</button>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <input type="text" placeholder="Job Title, Keywords..." value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"/>
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>

          <div className="relative">
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none">
              <option value="All">All Types (Any)</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
              <option value="Freelance">Freelance</option>
            </select>
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>

          <div className="relative">
            <input type="text" placeholder="City, Country..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"/>
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>

          <div className="relative">
            <input type="text" placeholder="Expected Salary..." value={searchSalary} onChange={(e) => setSearchSalary(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"/>
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
        </div>
        <div className="text-center mt-6 px-4">
  <Link 
    to="/ai-suggestions" 
    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold shadow-md hover:shadow-purple-200 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 tracking-wide"
  >
    <span className="text-base animate-bounce">✨</span>
    Get Smart AI Job Suggestions
  </Link>
</div>
      </div>

      {/* --- Jobs Display Content Area --- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white p-6 rounded-2xl border border-slate-200/60 space-y-4">
              <div className="flex justify-between items-center"><div className="h-5 w-2/3 bg-slate-200 rounded"></div><div className="h-5 w-16 bg-slate-200 rounded-full"></div></div>
              <div className="h-4 w-1/3 bg-slate-100 rounded"></div>
              <div className="space-y-2 pt-2"><div className="h-3 w-full bg-slate-100 rounded"></div><div className="h-3 w-5/6 bg-slate-100 rounded"></div></div>
              <div className="h-10 bg-slate-100 rounded-xl pt-4"></div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center bg-white p-16 rounded-2xl border border-dashed border-slate-300 max-w-md mx-auto">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-slate-800">No Matching Results</h3>
          <button onClick={handleClearFilters} className="bg-slate-950 text-white font-semibold text-xs px-4 py-2 rounded-xl mt-4">Reset Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/70 flex flex-col justify-between group relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">{job.jobTitle}</h3>
                    <p className="text-sm text-blue-600 font-semibold flex items-center gap-1.5 mt-1"><span>🏢</span>{job.companyId?.companyName || 'Verified Employer'}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 ${job.jobType === 'Remote' ? 'bg-indigo-50 text-indigo-600' : job.jobType === 'Full-time' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{job.jobType}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">{job.jobDescription}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
                  <span>📍 {job.location}</span>
                  {job.salaryRange && <span className="text-emerald-600 font-semibold">💰 {job.salaryRange}</span>}
                </div>
                {/* 🚀 වෙනස් කරන ලද බටන් එක (නව පිටුවට යොමු කරයි) */}
                <button 
                  onClick={() => navigate(`/apply-job/${job._id}`)} 
                  className="w-full sm:w-auto bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreJobs;