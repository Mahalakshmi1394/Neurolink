import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Activity, HeartPulse, ChevronRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const PatientAIInsights = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [brainTumorStatus, setBrainTumorStatus] = useState("Checking...");
    const [tumorResult, setTumorResult] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
             try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/ai/brain-tumor/history?healthId=${user.healthId}`, { 
                    headers: { Authorization: token } 
                });
                
                if (res.data && res.data.length > 0) {
                    setBrainTumorStatus("Analysis Available");
                    setTumorResult(res.data[0]); // Get the latest result
                } else {
                    setBrainTumorStatus("No Records Found");
                }
            } catch (err) {
                setBrainTumorStatus("Status Unknown");
            }
        };
        if(user.healthId) checkStatus();
    }, [user.healthId]);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
             {/* Simple Sidebar (Same as dashboard for consistency) */}
             <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10 hidden md:block">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <Activity className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold">NeuroLink</span>
                    </div>
                     <button onClick={() => navigate('/user-dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition mb-2">
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <div className="px-4 py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-bold">
                        AI Insights Portal
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 bg-slate-50 p-8">
                <Toaster position="top-right" />
                
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
                        <Brain className="text-purple-600" /> AI Health Insights
                    </h1>
                    <p className="text-secondary">Preventive analysis and personalized health tracking.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                    
                    {/* Card 1: Neuro Risk (Primary) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-lg transition">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                        
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
                                <ShieldCheck size={24} />
                            </div>
                            
                            <h3 className="text-lg font-bold text-dark mb-1">Neurological Risk</h3>
                            <p className="text-sm text-secondary mb-6">Check your risk level based on vitals & history.</p>

                            <button 
                                onClick={() => navigate('/user/preventive-ai')}
                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20"
                            >
                                Check Risk
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Brain Tumor Analysis (Read Only) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-lg transition">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform"></div>
                        
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                                <Brain size={24} />
                            </div>
                            
                            <h3 className="text-lg font-bold text-dark mb-1">Brain Tumor Analysis</h3>
                            
                            <div className="mb-6 mt-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Status</p>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${brainTumorStatus === 'Analysis Available' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {brainTumorStatus}
                                </span>
                            </div>

                            <button 
                                disabled={brainTumorStatus !== 'Analysis Available'}
                                onClick={() => setShowModal(true)}
                                className="w-full py-3 bg-white border-2 border-slate-100 text-slate-700 rounded-xl font-bold hover:border-purple-200 hover:text-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                View Result (Read Only)
                            </button>
                            <p className="text-[10px] text-center text-slate-400 mt-2">
                                * MRI uploads must be done by Doctor
                            </p>
                        </div>
                    </div>

                     {/* Card 3: Coming Soon */}
                     <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 dashed opacity-70">
                        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 mb-4">
                            <HeartPulse size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-400 mb-1">Stroke Prediction</h3>
                        <p className="text-sm text-slate-400 mb-6">Advanced stroke risk models coming soon.</p>
                        <button disabled className="w-full py-3 bg-slate-200 text-slate-400 rounded-xl font-bold cursor-not-allowed">
                            In Development
                        </button>
                    </div>

                </div>

                {/* RESULT MODAL */}
                {showModal && tumorResult && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative animate-fadeIn">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-dark transition"
                            >
                                <ChevronRight size={24} className="rotate-90" />
                            </button>

                            <div className="text-center mb-6">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${tumorResult.tumorType === 'No Tumor' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    <Brain size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-dark">Latest Analysis Result</h2>
                                <p className="text-secondary text-sm">{new Date(tumorResult.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                    <span className="text-slate-500 font-medium">Type</span>
                                    <span className={`font-bold text-lg ${tumorResult.tumorType === 'No Tumor' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tumorResult.tumorType}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                    <span className="text-slate-500 font-medium">Confidence</span>
                                    <span className="font-bold text-dark">
                                        {(tumorResult.confidence * 100).toFixed(1)}%
                                    </span>
                                </div>
                                
                                {tumorResult.tumorType !== 'No Tumor' && (
                                    <>
                                        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                                            <span className="text-slate-500 font-medium">Severity</span>
                                            <span className="font-bold text-orange-600">{tumorResult.severity || 'N/A'}</span>
                                        </div>
                                         <div className="pt-2">
                                            <p className="text-slate-500 text-xs uppercase font-bold mb-2">Interpretation</p>
                                            <p className="text-sm text-dark leading-relaxed">{tumorResult.interpretation}</p>
                                        </div>
                                    </>
                                )}
                                
                                {tumorResult.tumorType === 'No Tumor' && (
                                    <div className="pt-2 text-center text-green-700 text-sm">
                                        No abnormalities detected in the analysis.
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-slate-400 mb-4">
                                    This report was generated by AI on {new Date(tumorResult.createdAt).toLocaleDateString()}. <br/>
                                    Please consult your doctor for detailed medical advice.
                                </p>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-3 bg-dark text-white rounded-xl font-bold hover:bg-slate-800 transition"
                                >
                                    Close Report
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default PatientAIInsights;
