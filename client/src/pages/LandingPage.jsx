import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Brain, ChevronRight, Activity as Pulse, Users, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-2xl font-bold text-dark">NeuroLink</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-secondary hover:text-primary transition font-medium">Features</a>
                        <a href="#about" className="text-secondary hover:text-primary transition font-medium">About</a>
                        <Link to="/login" className="text-secondary hover:text-primary transition font-medium">Login</Link>
                        <Link to="/signup" className="px-5 py-2.5 bg-primary text-white rounded-full font-semibold hover:bg-sky-600 transition shadow-lg shadow-primary/25">
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-primary font-semibold text-sm mb-6">
                            <Pulse size={16} />
                            <span>AI-Powered Early Risk Prediction</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-dark leading-tight mb-6">
                            Unified <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700">Health Records</span> for a Safer Future.
                        </h1>
                        <p className="text-lg text-secondary mb-8 leading-relaxed max-w-lg">
                            Securely store your entire medical history with a unique Health ID and leverage AI to predict neurological risks before symptoms appear.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/signup" className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-sky-600 transition shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                                Create Health ID <ChevronRight />
                            </Link>
                            <Link to="/login" className="px-8 py-4 bg-white text-dark border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition flex items-center justify-center">
                                Doctor Login
                            </Link>
                        </div>
                    </motion.div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-transparent rounded-full filter blur-3xl opacity-50"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80" 
                            alt="Doctor using tablet" 
                            className="relative z-10 rounded-3xl shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500"
                        />
                        {/* Floating Cards */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute -bottom-8 -left-8 z-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4"
                        >
                            <div className="bg-green-100 p-3 rounded-full text-green-600">
                                <Shield size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-secondary font-semibold">Security Status</p>
                                <p className="text-dark font-bold">Encrypted & Safe</p>
                            </div>
                        </motion.div>

                        <motion.div 
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute top-12 -right-8 z-20 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4"
                        >
                            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                                <Brain size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-secondary font-semibold">AI Analysis</p>
                                <p className="text-dark font-bold">Risk Assessment</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-slate-50" id="features">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-dark mb-4">Why Choose NeuroLink?</h2>
                        <p className="text-secondary">Bridging the gap between fragmented medical records and advanced preventive care.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Database className="h-8 w-8 text-blue-500" />,
                                title: "Unified Health ID",
                                desc: "One unique ID for all your medical history across different doctors and hospitals."
                            },
                            {
                                icon: <Brain className="h-8 w-8 text-purple-500" />,
                                title: "AI Risk Prediction",
                                desc: "Advanced algorithms analyze your data to predict neurological risks like stroke or seizures."
                            },
                            {
                                icon: <Users className="h-8 w-8 text-green-500" />,
                                title: "Doctor Continuity",
                                desc: "Empower doctors with your complete history for accurate and faster diagnosis."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition group">
                                <div className="bg-slate-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-dark mb-3">{feature.title}</h3>
                                <p className="text-secondary leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
