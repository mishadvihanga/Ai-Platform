import React, { useState, useEffect } from 'react';

const VacancyManagement = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Edit mode එක පාලනය කිරීමට state
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    jobType: 'Full-time',
    salaryRange: '',
    location: '',
    status: 'Active' // Edit කරද්දී status එකත් වෙනස් කරන්න පුළුවන්
  });

  const fetchVacancies = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/vacancies/company/${user._id}`);
      const data = await res.json();
      if (res.ok) setVacancies(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { if (user?._id) fetchVacancies(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- SUBMIT (Create or Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isEditing 
      ? `http://localhost:5000/api/vacancies/update/${editId}` 
      : 'http://localhost:5000/api/vacancies/create';
      
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEditing ? formData : { companyId: user._id, ...formData })
      });
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        clearForm();
        fetchVacancies();
      }
    } catch (error) {
      alert('Failed to save vacancy');
    } finally {
      setLoading(false);
    }
  };

  // --- EDIT BUTTON CLICK ---
  const handleEditClick = (job) => {
    setIsEditing(true);
    setEditId(job._id);
    setFormData({
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      jobType: job.jobType,
      salaryRange: job.salaryRange,
      location: job.location,
      status: job.status
    });
  };

  // --- DELETE ACTION ---
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job post?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/vacancies/delete/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchVacancies();
        if(isEditing && editId === id) clearForm();
      }
    } catch (error) {
      alert('Failed to delete vacancy');
    }
  };

  const clearForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ jobTitle: '', jobDescription: '', jobType: 'Full-time', salaryRange: '', location: '', status: 'Active' });
  };

  return (
    <div className="space-y-8">
      {/* Post / Edit Vacancy Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {isEditing ? '📝 Edit Job Vacancy' : '📢 Post a New Vacancy'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Job Title</label>
            <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg text-sm" placeholder="e.g. MERN Stack Developer" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Job Type</label>
            <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg text-sm">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Remote</option>
              <option>Freelance</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg text-sm" placeholder="e.g. Colombo or Remote" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Salary Range (Optional)</label>
            <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg text-sm" placeholder="e.g. LKR 150,000 - 200,000" />
          </div>
          
          {/* Edit කරද්දී පමණක් Status වෙනස් කිරීමේ හැකියාව ලබාදීම */}
          {isEditing && (
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Vacancy Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg text-sm">
                <option>Active</option>
                <option>Closed</option>
              </select>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Job Description</label>
            <textarea name="jobDescription" rows="4" value={formData.jobDescription} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-lg text-sm" placeholder="Describe responsibilities, requirements..."></textarea>
          </div>
          
          <div className="md:col-span-2 flex space-x-2">
            <button type="submit" disabled={loading} className={`px-6 py-2.5 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? 'Saving...' : isEditing ? 'Update Job Post' : 'Publish Job Post'}
            </button>
            {isEditing && (
              <button type="button" onClick={clearForm} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-semibold transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Posted Vacancies List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">💼 Your Job Posts ({vacancies.length})</h2>
        {vacancies.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't posted any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {vacancies.map((job) => (
              <div key={job._id} className="p-5 border rounded-xl hover:shadow-sm transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-gray-800 text-lg leading-tight">{job.jobTitle}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
                  <div className="flex flex-wrap gap-2 text-xs pt-1">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">{job.jobType}</span>
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{job.location}</span>
                    {job.salaryRange && <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-medium">{job.salaryRange}</span>}
                  </div>
                </div>
                
                {/* Manage Controls (Edit & Delete Buttons) */}
                <div className="flex space-x-2 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => handleEditClick(job)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors text-xs font-semibold flex items-center space-x-1"
                  >
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(job._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors text-xs font-semibold flex items-center space-x-1"
                  >
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VacancyManagement;