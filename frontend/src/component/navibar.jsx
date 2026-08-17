import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navibar = () => {
  // Sidebar එක open/close කරන්න state එකක්
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // LocalStorage එකෙන් user තොරතුරු ලබාගැනීම
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <>
      {/* --- Main Navigation Bar --- */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Job-AI
              </Link>
            </div>
            
            {/* Center Menu Links */}
            <div className="hidden md:flex space-x-8 font-medium">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Home</Link>
              <Link to="/explore-jobs" className="text-gray-700 hover:text-blue-600 transition-colors">Explore Jobs</Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors">Services</Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">Contact Us</Link>

              {user && user.accounttype === 'admin' && (
  <Link 
    to="/admin" 
    onClick={() => setIsSidebarOpen(false)} 
    className="text-gray-700 hover:text-blue-600 transition-colors"
  >
    Admin Center
  </Link>
)}

            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                /* User log වී සිටී නම් පෙන්වන Profile Avatar එක (Click කළ විට Sidebar එක open වේ) */
                <div 
                  onClick={() => setIsSidebarOpen(true)} 
                  className="flex items-center space-x-2 border border-gray-200 p-1 pr-3 rounded-full hover:shadow-sm transition-all cursor-pointer"
                >
                  <img 
                    src={user.profileurl || 'https://via.placeholder.com/150'} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border border-green-500 object-cover"
                  />
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user.fullname.split(' ')[0]}</span>
                </div>
              ) : (
                /* User log වී නොමැති නම් පෙන්වන්නේ Sign In button එක පමණි (Register එක ඉවත් කර ඇත) */
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg font-medium hover:opacity-90 shadow-sm transition-all">
                    Sign In
                  </Link>
                  {/* Sidebar එක open කරගන්න දාපු සරල Menu Icon එකක් (Log නොවී සිටින අයටත් sample links බලන්න) */}
                  <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* --- Backdrop Overlay (Sidebar එක පිටුපස අඳුරු පසුබිම) --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-50 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar Menu (Slide-in Drawer) --- */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col justify-between`}>
        
        {/* Top Section */}
        <div>
          {/* Header & Close Button */}
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <span className="text-lg font-bold text-gray-800">Menu</span>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-800 p-1 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* User Profile Summary (Log වෙලා ඉන්නවා නම් විතරක් පේනවා) */}
          {user && (
            <div className="p-5 bg-gradient-to-r from-blue-50 to-green-50 flex items-center space-x-4">
              <img 
                src={user.profileurl || 'https://via.placeholder.com/150'} 
                alt="Profile Large" 
                className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <div>
                <h4 className="font-bold text-gray-800 leading-tight">{user.fullname}</h4>
                <p className="text-xs text-gray-500 capitalize">{user.accounttype}</p>
              </div>
            </div>
          )}

          {/* Sidebar Links (Sample Links + Mobile Navigation) */}
          <div className="p-4 space-y-2">
            {/* Mobile වෙනුවෙන් Navibar links මීට ඇතුළත් කර ඇත */}
            <div className="md:hidden pb-3 mb-3 border-b border-gray-100 space-y-1">
              <Link to="/" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Home</Link>
              <Link to="/services" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Services</Link>
              <Link to="/contact" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">Contact Us</Link>
            </div>

            {/* ඔයා ඉල්ලපු Sample Links 3 */}
            <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider block pt-2">Dashboard Options</span>
            {/* User ගේ accounttype එක අනුව ලින්ක් එක වෙනස් වීම හෝ සැඟවීම */}
{user && user.accounttype === 'client' && (
  <Link 
    to="/upgrade-company" 
    onClick={() => setIsSidebarOpen(false)} 
    className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-all"
  >
    🏢 Switch to Company
  </Link>
)}

{user && user.accounttype === 'company' && (
  <Link 
    to="/company-dashboard" 
    onClick={() => setIsSidebarOpen(false)} 
    className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-all"
  >
    💻 Company Dashboard
  </Link>
)}


            <Link to="/applied-jobs" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-all">
              💼 My Applied Jobs
            </Link>
            <Link to="/saved-jobs" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-all">
              ⭐ Saved Jobs
            </Link>
            <Link to="/account-settings" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-all">
              ⚙️ Account Settings
            </Link>
            <Link to="/ai-suggestions" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-all">
              🤖 AI Job Suggestions
            </Link>
            <Link to="/job-chatbot" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-all">
              💬 Job Chatbot
            </Link>

            {/* Log වී නැති අයට මෙතනිනුත් Register වෙන්න පුළුවන් */}
            {!user && (
              <div className="pt-4">
                <Link to="/register" onClick={() => setIsSidebarOpen(false)} className="block text-center bg-green-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-600 transition-all">
                  Create New Account
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section (Logout Button එක තියෙන තැන) */}
        {user && (
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold p-3 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span>Logout</span>
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default Navibar;