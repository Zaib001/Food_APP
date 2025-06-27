import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { loginUser } from '../api/auth';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
  e.preventDefault();
  try {
    const res = await loginUser(formData);
    console.log(res.data);

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    toast.success('Login successful');
    navigate('/dashboard');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email" onChange={handleChange} value={formData.email} required className="w-full p-2 border rounded" />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} required className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">Log In</button>
        </form>
        <p className="text-center text-sm mt-4">Don't have an account? <Link to="/signup" className="text-red-600 hover:underline">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default SignIn;
