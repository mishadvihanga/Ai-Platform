import React, { useState, useEffect } from 'react';

const AccountSettings = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    password: '',
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    companyContact: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // මුලින්ම data ඇදීමට අවශ්‍ය loading state එක
  const [message, setMessage] = useState({ type: '', text: '' });

  // 🔄 1. පිටුව load වන විටම Database (Model) එකෙන් සම්පූර්ණ විස්තර ඇදගැනීම
  useEffect(() => {
    const fetchLatestUserData = async () => {
      if (!storedUser || !storedUser._id) {
        setFetching(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/${storedUser._id}`);
        const data = await res.json();

        if (res.ok && data.success) {
          // Model එකෙන් ආපු විස්තර Form එකේ State එකට දමන්න
          setFormData({
            fullname: data.user.fullname || '',
            phone: data.user.phone || '',
            password: '', 
            companyName: data.user.companyName || '',
            companyEmail: data.user.companyEmail || '',
            companyAddress: data.user.companyAddress || '',
            companyContact: data.user.companyContact || '',
          });
        } else {
          setMessage({ type: 'error', text: 'Failed to fetch profile details from database.' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Error connecting to the server.' });
      } finally {
        setFetching(false);
      }
    };

    fetchLatestUserData();
  }, []);

  if (!storedUser) {
    return <div className="text-center py-10 text-red-500 font-bold">Please log in to access settings.</div>;
  }

  // මෙතනදී storage එකෙන් හෝ fetch වුණු දත්ත වලින් accounttype එක නිවැරදිව හඳුනාගනී
  const isCompany = storedUser.accounttype === 'company';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 💾 2. වෙනස් කළ දත්ත Database එකට යවා Update කිරීම
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`http://localhost:5000/api/settings/${storedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        
        // LocalStorage එකත් අලුත් දත්ත වලින් update කරන්න (ආරක්ෂාවට)
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Password field එක නැවත හිස් කරන්න
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update settings.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Database එකෙන් දත්ත ඇදගන්නා තෙක් 'Loading...' පෙන්වීම
  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-slate-500 font-medium">Fetching your latest account details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white border border-slate-100 shadow-sm rounded-2xl mt-10">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
        <p className="text-sm text-slate-500">Update your personal profile and company preferences securely.</p>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 text-sm font-semibold rounded-xl ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? '✅ ' : '❌ '}{message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ---- SECTION 1: PERSONAL DETAILS ---- */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-700"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Cannot change)</label>
              <input
                type="email"
                value={storedUser.email}
                disabled
                className="w-full border border-slate-100 bg-slate-50 text-slate-400 rounded-xl p-2.5 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* ---- SECTION 2: COMPANY DETAILS (Database එකෙන් පැමිණි දත්ත මෙහි පෙන්වයි) ---- */}
        {isCompany && (
          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Company Profile</h3>
              <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-2 py-0.5 rounded-full uppercase">Employer Mode</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Email</label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Contact No</label>
                <input
                  type="text"
                  name="companyContact"
                  value={formData.companyContact}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Address</label>
                <input
                  type="text"
                  name="companyAddress"
                  value={formData.companyAddress}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* ---- SECTION 3: SECURITY ---- */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Security</h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Leave blank to keep current)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500 text-slate-700"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;