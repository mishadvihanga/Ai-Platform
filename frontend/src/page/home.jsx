import React, { useState } from 'react';

const Home = () => {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTitle, "in", searchLocation);
    // මෙතැනට ඔයාගේ සෙවුම් පද්ධතියේ (Search route) logic එක සම්බන්ධ කරන්න පුළුවන්
  };

  return (
    <div className="bg-white min-h-screen font-sans antialiased text-slate-800">
      
      {/* 1. HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
          ✨ Next-Gen AI Job Marketplace
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          Find Your Dream <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Career</span> <br />
          Powered by <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Intelligence</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-500 mb-10 leading-relaxed">
          Discover thousands of AI, Machine Learning, and Data Science job opportunities worldwide or find the perfect AI talent to upscale your company's potential.
        </p>

        
      </div>

      {/* 2. QUICK STATS SECTION */}
      <div className="bg-gradient-to-r from-blue-50/50 via-white to-green-50/50 border-y border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <h3 className="text-4xl font-extrabold text-blue-600 mb-1">10,000+</h3>
            <p className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Active AI Vacancies</p>
          </div>
          <div className="p-4 border-t md:border-t-0 md:border-x border-slate-100">
            <h3 className="text-4xl font-extrabold text-green-600 mb-1">5,000+</h3>
            <p className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Verified Companies</p>
          </div>
          <div className="p-4 border-t md:border-t-0">
            <h3 className="text-4xl font-extrabold text-blue-600 mb-1">20,000+</h3>
            <p className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Talented Candidates</p>
          </div>
        </div>
      </div>

      {/* 3. OUR SERVICES SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Our Core Services</h2>
          <p className="text-slate-500 text-sm sm:text-base">We bridge the gap between world-class AI professionals and fast-growing tech organizations by offering tailored recruitment solutions.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all group hover:-translate-y-1 duration-200">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-blue-600 group-hover:transform group-hover:scale-110 transition-all duration-200">
              💼
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Smart Job Posting</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Employers can post advanced AI/ML positions and reach out to thousands of targeted tech enthusiasts instantly.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all group hover:-translate-y-1 duration-200">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-green-600 group-hover:transform group-hover:scale-110 transition-all duration-200">
              📄
            </div>
            <h3 className="/text-lg font-bold text-slate-800 mb-2">Instant Application Tracking</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Candidates can easily view vacancies, upload CVs, and track their application review status live on their personal dashboards.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all group hover:-translate-y-1 duration-200">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:bg-purple-600 group-hover:transform group-hover:scale-110 transition-all duration-200">
              ✉️
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Automated Email Alerts</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Receive direct notification emails with tailored notes the moment a company accepts or reviews your professional profile.
            </p>
          </div>
        </div>
      </div>

      {/* 4. OUR MISSION & VISION SECTION */}
      <div className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-block bg-green-100 text-green-800 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              Target & Goal
            </div>
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">
              Empowering the Future Economy by Connecting Top AI Minds
            </h2>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
              Artificial Intelligence is reshaping every aspect of our lives. Our portal exists specifically to ensure that the creators, developers, and engineers behind this transformation have effortless access to the best tech hubs globally.
            </p>
            
            <div className="border-l-4 border-blue-500 pl-4 py-1 italic text-slate-600 text-sm">
              "Our ultimate goal is to remove friction from tech recruitment and create an eco-friendly AI talent community."
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Box 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <h4 className="font-bold text-base text-slate-800 mb-2">🎯 Our Mission</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                To build a seamless, secure, and modern digital platform that helps candidates elevate their AI careers while enabling employers to scale efficiently.
              </p>
            </div>
            {/* Box 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
              <h4 className="font-bold text-base text-slate-800 mb-2">👁️ Our Vision</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                To become the premier global ecosystem for AI recruitment, trusted by millions of tech developers and Fortune 500 enterprises.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 5. WHY CHOOSE US (EXTRA ADVANTAGES) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-12">Why Choose Our Platform?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-white border border-slate-100 rounded-xl">
            <div className="text-xl mb-2">🛡️</div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Verified Employers</h4>
            <p className="text-slate-400 text-xs">All companies undergo legal business registration checkups.</p>
          </div>
          <div className="p-5 bg-white border border-slate-100 rounded-xl">
            <div className="text-xl mb-2">⚡</div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Real-time Responses</h4>
            <p className="text-slate-400 text-xs">No more waiting. Get quick decisions on your submissions.</p>
          </div>
          <div className="p-5 bg-white border border-slate-100 rounded-xl">
            <div className="text-xl mb-2">🔒</div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Data Privacy</h4>
            <p className="text-slate-400 text-xs">Your personal resumes and contact details are fully protected.</p>
          </div>
          <div className="p-5 bg-white border border-slate-100 rounded-xl">
            <div className="text-xl mb-2">🌐</div>
            <h4 className="font-bold text-slate-800 text-sm mb-1">Remote-first Focus</h4>
            <p className="text-slate-400 text-xs">Access international high-paying AI roles from anywhere.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;