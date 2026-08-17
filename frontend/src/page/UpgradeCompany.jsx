import React, { useState } from 'react';

const UpgradeCompany = () => {
  // LocalStorage එකෙන් දැනට ඉන්න user ගේ තොරතුරු ගැනීම
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyEmail: '',
    companyAddress: '',
    companyContact: ''
  });
  const [brFile, setBrFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setBrFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loggedInUser) return alert('Please login first!');
    if (!brFile) return alert('Please upload your BR Document!');

    setLoading(true);
    const data = new FormData();
    data.append('userId', loggedInUser.id || JSON.parse(localStorage.getItem('user'))._id || loggedInUser); 
    // සටහන: ඔබේ localstorage user object එකේ id එක තියෙන විදියට (id හෝ _id) මෙතනට දෙන්න.
    
    data.append('companyName', companyData.companyName);
    data.append('companyEmail', companyData.companyEmail);
    data.append('companyAddress', companyData.companyAddress);
    data.append('companyContact', companyData.companyContact);
    data.append('brFile', brFile);

    try {
      const res = await fetch('http://localhost:5000/api/upgrade-company', {
        method: 'POST',
        body: data
      });
      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        // LocalStorage එකේ තියෙන user තොරතුරු අලුත් දත්ත වලින් update කිරීම (accounttype = pending වේ)
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = '/'; // Home එකට හෝ Profile එකට redirect කිරීම
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // දැනටමත් request එකක් දාලා pending නම් ආයේ form එක පෙන්වන්නේ නැත
  if (loggedInUser?.accounttype === 'pending') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-blue-50 rounded-xl text-center border border-blue-200">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">Verification Pending</h2>
        <p className="text-gray-600">Your company request is currently being reviewed by our administrators. We will notify you once it's approved!</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-bold text-center mb-2 text-blue-600">Register as a Company</h2>
      <p className="text-sm text-gray-500 text-center mb-6">Submit your business registration details to post jobs.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Company Name</label>
          <input type="text" name="companyName" onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" placeholder="e.g. Apex AI Solutions" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company Official Email</label>
          <input type="email" name="companyEmail" onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" placeholder="info@company.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Business Address</label>
          <input type="text" name="companyAddress" onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" placeholder="Street Address, City" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Number</label>
          <input type="text" name="companyContact" onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg" placeholder="+94 7X XXX XXXX" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Business Registration (BR) Copy</label>
          <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} required className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <span className="text-xs text-gray-400 mt-1 block">Upload PDF or Image of your BR certification.</span>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white p-3 rounded-lg font-bold hover:opacity-90 shadow-md transition-all disabled:opacity-50"
        >
          {loading ? 'Submitting Request...' : 'Submit Verification Request'}
        </button>
      </form>
    </div>
  );
};

export default UpgradeCompany;