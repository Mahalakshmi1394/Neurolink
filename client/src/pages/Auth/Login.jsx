import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Stethoscope, Lock, Mail, ChevronRight, Activity } from 'lucide-react';

const Login = () => {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success(`Welcome back, ${res.data.user.name}!`);
      
      if (role === 'patient') navigate('/user-dashboard');
      else navigate('/doctor-dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light p-4">
      <Toaster position="top-center" />
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex overflow-hidden min-h-[600px]">
        
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-dark mb-2">Welcome Back</h2>
            <p className="text-secondary">Enter your details to access your {role === 'patient' ? 'health records' : 'dashboard'}.</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                role === 'patient' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-dark'
              }`}
            >
              Patient
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                role === 'doctor' ? 'bg-white text-primary shadow-sm' : 'text-secondary hover:text-dark'
              }`}
            >
              Doctor
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition flex items-center justify-center gap-2"
            >
              Log In <ChevronRight className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary to-blue-600 p-10 flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-8 w-8" />
                    <span className="text-xl font-bold">NeuroLink</span>
                </div>
                <h3 className="text-4xl font-bold leading-tight mb-4">
                    {role === 'patient' 
                        ? "Your Complete Medical History, One Secure ID." 
                        : "Advanced Clinical Insights at Your Fingertips."}
                </h3>
                <p className="text-blue-100 text-lg">
                    {role === 'patient'
                        ? "Access your diagnoses, prescriptions, and AI-driven health risks in one place."
                        : "Seamlessly manage patient records and leverage AI for early neurological risk assessments."}
                </p>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                    <h4 className="font-bold text-2xl mb-1">10k+</h4>
                    <p className="text-blue-100 text-sm">Patients Secured</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                    <h4 className="font-bold text-2xl mb-1">98%</h4>
                    <p className="text-blue-100 text-sm">Prediction Accuracy</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
