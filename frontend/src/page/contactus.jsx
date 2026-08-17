import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Input fields වල දත්ත වෙනස් වන විට state එක update කිරීම
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form එක Submit කරන විට ක්‍රියාත්මක වන ශ්‍රිතය
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatusMsg({ type: 'success', text: data.message });
        // Form එක හිස් කිරීම
        setFormData({ fullname: '', email: '', message: '' });
      } else {
        setStatusMsg({ type: 'error', text: data.message || 'Something went wrong.' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Server error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-16 px-4 overflow-hidden sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Get In Touch</h2>
          <p className="mt-4 text-sm text-gray-500">
            Have questions about our AI platform? Drop us a message and we'll get back shortly.
          </p>
        </div>

        {/* සේවාලාභියාට පෙනෙන Alerts */}
        {statusMsg.text && (
          <div className={`p-4 mb-6 text-sm font-semibold rounded-xl border ${
            statusMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            {statusMsg.type === 'success' ? '✅ ' : '❌ '}{statusMsg.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea 
              rows="4" 
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
            ></textarea>
          </div>
          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold p-3 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;