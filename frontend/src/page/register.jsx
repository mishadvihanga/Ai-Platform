import React, { useState } from 'react';
import { useNavigate , Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ fullname: '', email: '', phone: '', accounttype: 'client', password: '' });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('fullname', formData.fullname);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('accounttype', formData.accounttype); 
    data.append('password', formData.password);
    if (image) data.append('profileImage', image);

    try {
      const res = await fetch('http://localhost:5000/api/register', { method: 'POST', body: data });
      const result = await res.json();
      
      if (res.ok) {
        // Register සාර්ථක නම් දත්ත LocalStorage එකේ තැන්පත් කිරීම
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        alert('Registration Successful & Auto Logged In!');
        
        // Navibar එක update වෙන්න සහ Home පිටුවට යන්න window.location එක භාවිතය වඩාත් සුදුසුයි
        window.location.href = '/'; 
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="fullname" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 font-bold">Register</button>
      </form>
      <Link to="/login" className="block text-center mt-4 text-blue-600 hover:underline">Already have an account? Login</Link>
    </div>
  );
};

export default Register;