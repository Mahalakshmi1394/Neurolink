import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Activity, HeartPulse, ChevronRight, Stethoscope, ArrowLeft } from 'lucide-react';

const AIHub = () => {
    const navigate = useNavigate();

    const modules = [
        {
            title: "Brain Tumor Analytics",
            description: "Deep learning based segmentation, classification, and grade estimation of neurological tumors from MRI scans.",
            icon: <Brain size={32} className="text-purple-600" />,
            status: "Active",
            path: "/doctor/brain-tumor-analytics",
            color: "purple"
        },
        {
            title: "Neurological Risk Prediction",
            description: "Main Project Module. Longitudinal analysis of medical history to predict neurological risks before symptoms appear.",
            icon: <HeartPulse size={32} className="text-red-500" />,
            status: "Active",
            path: "/doctor/neuro-risk-prediction",
            color: "red"
        },
        {
            title: "Coming Soon",
            description: "Dermatological screening using computer vision.",
            icon: <Activity size={32} className="text-slate-400" />,
            status: "In Development",
            path: "#",
            color: "slate"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
             {/* Sidebar */}
             <aside className="w-64 bg-dark text-white fixed h-full z-10 hidden md:block">
                <div className="p-6 border-b border-dark/50">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/20 p-2 rounded-lg">
                            <Stethoscope className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold">NeuroLink</span>
                    </div>
                </div>
                
                <nav className="p-4 space-y-2">
                    <button onClick={() => navigate('/doctor-dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl font-medium transition">
                        <Activity size={20} /> Dashboard
                    </button>
                    <button onClick={() => navigate('/doctor/ai-hub')} className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/20 transition hover:bg-primary/90">
                        <Brain size={20} /> AI Diagnostics
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 bg-slate-50">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 p-6 sticky top-0 z-20">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
                                AI Diagnostic Hub
                            </h1>
                            <p className="text-secondary">Advanced Clinical Intelligence Tools</p>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((mod, index) => (
                        <div 
                            key={index}
                            onClick={() => mod.status === 'Active' && navigate(mod.path)}
                            className={`bg-white rounded-2xl border border-slate-200 p-8 shadow-sm transition-all duration-300 group relative overflow-hidden ${mod.status === 'Active' ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-purple-200' : 'opacity-70 grayscale'}`}
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-${mod.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {mod.icon}
                            </div>
                            
                            <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-purple-600 transition-colors">
                                {mod.title}
                            </h3>
                            <p className="text-secondary leading-relaxed mb-6">
                                {mod.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${mod.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {mod.status}
                                </span>
                                {mod.status === 'Active' && (
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                        <ChevronRight size={20} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                </div>
            </main>
        </div>
    );
};

export default AIHub;
