import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerUser } from '../api/auth';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'user'   
  });

  const handleChange = e => 
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await registerUser(formData);
      toast.success('Account created!');
      navigate('/signin');
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            name="name" 
            type="text" 
            placeholder="Name" 
            onChange={handleChange} 
            value={formData.name} 
            required 
            className="w-full p-2 border rounded" 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            onChange={handleChange} 
            value={formData.email} 
            required 
            className="w-full p-2 border rounded" 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            value={formData.password} 
            required 
            className="w-full p-2 border rounded" 
          />
          
          {/* Role Selection */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded bg-white"
          >
            <option value="user">User</option>
            <option value="base">Base</option>
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
            <option value="planner">Planner</option>
          </select>

          <button 
            type="submit" 
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Create Account
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/signin" className="text-red-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
