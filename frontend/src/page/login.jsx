import React, { useState } from 'react';
import { useNavigate ,Link} from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();


  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    
    if (res.ok) {
      // User තොරතුරු LocalStorage එකේ save කිරීම
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login Successful!');
      window.location.href = '/'; // Navibar එක update වීමට refresh කර මුල් පිටුවට යැවීම
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-20 p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold">Login</button>
      </form>
      <Link to="/register" className="block text-center mt-2 text-blue-600 hover:underline">Don't have an account? Register</Link>
    </div>
  );
}

export default Login;