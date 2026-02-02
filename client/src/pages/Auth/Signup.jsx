import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronRight, Activity, Lock } from 'lucide-react';

const Signup = () => {
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
      name: '', email: '', password: '', 
      age: '', gender: 'Male', phone: '', 
      specialization: 'Neurologist', hospital: '', registrationId: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    const endpoint = role === 'patient' 
        ? 'http://localhost:5000/api/auth/register/user' 
        : 'http://localhost:5000/api/auth/register/doctor';
    
    try {
        const res = await axios.post(endpoint, formData);
        toast.success('Account created successfully! Please login.');
        setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-4">
        <Toaster position="top-right" />
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex overflow-hidden min-h-[700px]">
        
            {/* Left Side - Visual */}
            <div className="hidden md:flex w-5/12 bg-dark p-10 flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark/50 to-dark"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <Activity className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold">NeuroLink</span>
                    </div>
                    <h3 className="text-3xl font-bold leading-tight mb-4">
                        Join the Future of Neuro-Healthcare.
                    </h3>
                    <p className="text-slate-300">
                        Create your Unified Digital Health ID or register as a specialist to start predicting and preventing neurological risks today.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 text-slate-300 text-sm">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <Lock size={16} />
                        </div>
                        <span>Bank-grade security for medical data</span>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-7/12 p-10 flex flex-col justify-center overflow-y-auto">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-dark mb-2">Create Account</h2>
                    <p className="text-secondary">Start your journey with NeuroLink.</p>
                </div>

                {/* Role Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-xl mb-6 w-full max-w-md">
                    <button
                        type="button"
                        onClick={() => setRole('patient')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                            role === 'patient' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-dark'
                        }`}
                    >
                        Patient Registration
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('doctor')}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                            role === 'doctor' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-dark'
                        }`}
                    >
                        Doctor Registration
                    </button>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    {/* Common Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">Full Name</label>
                            <input name="name" onChange={handleChange} required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary mb-1">Email</label>
                            <input name="email" onChange={handleChange} required type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="john@example.com" />
                        </div>
                    </div>

                    {role === 'patient' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Age</label>
                                    <input name="age" onChange={handleChange} required type="number" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary" placeholder="25" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Gender</label>
                                    <select name="gender" onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary">
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Phone Number</label>
                                <input name="phone" onChange={handleChange} required type="tel" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary" placeholder="+91 98765 43210" />
                            </div>
                        </>
                    )}

                    {role === 'doctor' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">Specialization</label>
                                <select name="specialization" onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary">
                                    <option>Neurologist</option>
                                    <option>General Physician</option>
                                    <option>Neurosurgeon</option>
                                    <option>Psychiatrist</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Hospital Name</label>
                                    <input name="hospital" onChange={handleChange} required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary" placeholder="City General" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-1">Registration ID</label>
                                    <input name="registrationId" onChange={handleChange} required type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary" placeholder="REG-12345" />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Password</label>
                        <input name="password" onChange={handleChange} required type="password" className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-primary" placeholder="••••••••" />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition flex items-center justify-center gap-2 mt-4"
                    >
                        Create Account <ChevronRight className="h-5 w-5" />
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Signup;
