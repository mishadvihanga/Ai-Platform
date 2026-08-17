import React, { useState, useEffect } from 'react';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null); 
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [alert, setAlert] = useState({ type: '', text: '' });

  // 🔄 Database එකෙන් පණිවිඩ සියල්ල ලබා ගැනීම
  const fetchMessages = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/contact/messages');
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      setAlert({ type: 'error', text: 'Failed to load messages from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ✉️ Reply එක Backend එකට යැවීම
  const handleSendReply = async (e) => {
    e.preventDefault();
    setSendingReply(true);
    setAlert({ type: '', text: '' });

    try {
      const res = await fetch(`http://localhost:5000/api/contact/reply/${selectedMessage._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyText }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setAlert({ type: 'success', text: data.message });
        setReplyText('');
        setSelectedMessage(null); // Modal එක වසා දැමීම
        fetchMessages(); // List එක Refresh කිරීම
      } else {
        setAlert({ type: 'error', text: data.message || 'Failed to send reply.' });
      }
    } catch (err) {
      setAlert({ type: 'error', text: 'Server error occurred. Please try again.' });
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-slate-500 font-medium">Loading user messages...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 font-sans">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">User Inquiries (Admin)</h2>
        <p className="text-sm text-slate-500">View user messages and instantly email replies using the system mailer.</p>
      </div>

      {alert.text && (
        <div className={`p-4 mb-6 text-sm font-semibold rounded-xl border ${
          alert.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          {alert.text}
        </div>
      )}

      {/* Messages Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="p-4">Sender Information</th>
              <th className="p-4">Message Content</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {messages.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400 text-sm">No messages received yet.</td>
              </tr>
            ) : (
              messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-slate-50/40 transition-colors">
                  
                  {/* Sender info */}
                  <td className="p-4 w-1/4">
                    <h4 className="font-bold text-slate-800 text-sm">{msg.fullname}</h4>
                    <p className="text-xs text-slate-400">{msg.email}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  {/* Message Body */}
                  <td className="p-4 w-2/4">
                    <p className="text-sm text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100 italic">
                      "{msg.message}"
                    </p>
                  </td>

                  {/* Status */}
                  <td className="p-4 text-center w-1/4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      msg.status === 'replied' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700 animate-pulse'
                    }`}>
                      {msg.status}
                    </span>
                  </td>

                  {/* Action button */}
                  <td className="p-4 text-right shrink-0">
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      disabled={msg.status === 'replied'}
                      className={`px-4 py-2 font-bold text-xs rounded-xl transition-all ${
                        msg.status === 'replied'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {msg.status === 'replied' ? 'Replied' : 'Reply Email'}
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📥 REPLY MODAL POP-UP */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 transform transition-all animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-lg font-bold text-slate-800">Compose Email Reply</h3>
              <button 
                onClick={() => setSelectedMessage(null)} 
                className="text-slate-400 hover:text-slate-600 text-2xl font-light"
              >
                &times;
              </button>
            </div>

            <div className="mb-4 bg-slate-50 p-3 rounded-xl text-xs text-slate-600 border border-slate-100">
              <p className="mb-1"><strong>Recipient:</strong> {selectedMessage.fullname} ({selectedMessage.email})</p>
              <p className="italic mt-1 text-slate-500">" {selectedMessage.message} "</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Response Message</label>
                <textarea
                  rows="5"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your official response to send via mail..."
                  required
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-slate-700"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 text-slate-500 font-bold text-sm bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="px-5 py-2 text-white font-bold text-sm bg-green-600 hover:bg-green-700 rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {sendingReply ? 'Sending Mail...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminMessages;