import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navibar from './component/navibar';
import Home from './page/home';
import Services from './page/services';
import ContactUs from './page/contactus';
import Login from './page/login';
import Register from './page/register';
import UpgradeCompany from './page/UpgradeCompany';
import AdminCenter from './page/admin'; 
import CompanyDashboard from './page/CompanyDashboard';
import ExploreJobs from './page/ExploreJobs';
import ApplyJob from './page/ApplyJob';
import SavedJobs from './page/SavedJobs';
import AppliedJobs from './page/AppliedJobs';
import AiSuggestions from './page/AiSuggestions';
import JobChatbot from './page/JobChatbot'; 
import AccountSettings from './page/AccountSettings';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <Router>
      <div className="font-sans antialiased text-gray-900 bg-white min-h-screen flex flex-col justify-between relative">
        <Navibar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/upgrade-company" element={<UpgradeCompany />} />
            <Route path="/admin" element={<AdminCenter />} />
            <Route path="/company-dashboard" element={<CompanyDashboard />} />
            <Route path="/explore-jobs" element={<ExploreJobs />} />
            <Route path="/apply-job/:id" element={<ApplyJob />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/applied-jobs" element={<AppliedJobs />} />
            <Route path="/ai-suggestions" element={<AiSuggestions />} />
            <Route path="/job-chatbot" element={<JobChatbot />} />
            <Route path="/account-settings" element={<AccountSettings />} />

            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-900 text-white py-6 text-center text-sm">
          <p>&copy; 2026 AI Job Platform. All rights reserved.</p>
        </footer>
{isChatOpen && (
  <div className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] h-[580px] shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white animate-in fade-in slide-in-from-bottom-4 duration-200 flex flex-col">
    
    <button 
      onClick={() => setIsChatOpen(false)}
      className="absolute top-4 right-4 z-50 text-white/80 hover:text-white font-bold text-sm bg-white/10 hover:bg-white/25 w-7 h-7 rounded-full flex items-center justify-center transition-all"
    >
      ✕
    </button>

    <JobChatbot />
  </div>
)}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center text-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
            isChatOpen ? 'bg-red-500 rotate-90' : 'bg-purple-600 hover:bg-purple-700'
          }`}
          title="AI Job Assistant"
        >
          {isChatOpen ? "✕" : "💬"}
        </button>


      </div>
    </Router>
  );
}

export default App;