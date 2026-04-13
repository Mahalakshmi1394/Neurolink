import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Activity, Clock, FileText, ChevronRight, Stethoscope } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const BrainTumorAnalytics = () => {
    const navigate = useNavigate();
    const [patientResult, setPatientResult] = useState(null);
    const [file, setFile] = useState(null);
    const [patientId, setPatientId] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Scan Image Preview State
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!file || !patientId) {
            toast.error("Please enter Patient ID and Upload Scan");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('patientHealthId', patientId);

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/ai/brain-tumor/analyze', formData, {
                headers: { 
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPatientResult(res.data.data);
            toast.success("Analysis Complete");
        } catch (err) {
            toast.error(err.response?.data?.message || "Analysis Failed");
        } finally {
            setLoading(false);
        }
    };

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
                <Toaster position="top-right" />
                
                {/* Header */}
                <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/doctor/ai-hub')} className="p-2 hover:bg-slate-100 rounded-lg transition text-secondary">
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-dark flex items-center gap-2">
                                    <Brain className="text-purple-600" /> Brain Tumor Analytics
                                </h1>
                                <p className="text-sm text-secondary">Deep Learning Segmentation & Classification</p>
                            </div>
                        </div>
                    </div>
                </header>

            <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT COLUMN: Input & Preview */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Input Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-dark mb-4">New Analysis</h3>
                        <form onSubmit={handleAnalyze} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-secondary mb-1 block">Patient Health ID</label>
                                <input 
                                    type="text" 
                                    value={patientId}
                                    onChange={(e) => setPatientId(e.target.value)}
                                    placeholder="e.g. NL-IND-X92F8" 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                                />
                            </div>
                            
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition cursor-pointer relative">
                                <input 
                                    type="file" 
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="space-y-2 pointer-events-none">
                                    <div className="mx-auto w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                                        <FileText size={20} />
                                    </div>
                                    <p className="text-sm font-medium text-dark">{file ? file.name : 'Upload MRI Scan'}</p>
                                    <p className="text-xs text-secondary">DICOM, JPG, PNG supported</p>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading || !file || !patientId}
                                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Run Analysis'}
                            </button>
                        </form>
                    </div>

                    {/* Quick Guide */}
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                            <Activity size={16} /> Clinical Note
                        </h4>
                        <p className="text-sm text-blue-700 leading-relaxed">
                            This tool uses a Convolutional Neural Network (CNN) to detect Glioma, Meningioma, and Pituitary tumors.
                            Results should always be correlated with clinical symptoms and biopsy.
                        </p>
                    </div>
                </div>

                {/* CENTER/RIGHT COLUMN: Results */}
                <div className="lg:col-span-8">
                    {!patientResult ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 opacity-50">
                            <Brain size={64} className="text-slate-200 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">Waiting for Scan</h3>
                            <p className="text-slate-400">Upload an MRI image to generate segmentation and report.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fadeIn">
                            
                            {/* 1. Top Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className={`p-6 rounded-2xl text-white ${patientResult.severity === 'Critical' ? 'bg-red-500' : patientResult.severity === 'Moderate' ? 'bg-orange-500' : 'bg-emerald-500'} shadow-lg`}>
                                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Diagnosis</p>
                                    <h2 className="text-2xl font-bold">{patientResult.tumorType}</h2>
                                    <p className="text-white/90 text-sm mt-1">{patientResult.confidence * 100}% Confidence</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Tumor Grade</p>
                                    <h2 className="text-2xl font-bold text-dark">{patientResult.grade || 'N/A'}</h2>
                                    <p className="text-slate-500 text-sm mt-1">WHO Classification</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Severity Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`h-3 w-3 rounded-full ${patientResult.severity === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                        <h2 className="text-2xl font-bold text-dark">{patientResult.severity || 'Stable'}</h2>
                                    </div>
                                    <p className="text-slate-500 text-sm mt-1">Based on imaging</p>
                                </div>
                            </div>

                            {/* 2. Visualization & Segmentation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Original Scan */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                    <h4 className="font-bold text-dark mb-4">Original Scan</h4>
                                    <div className="aspect-square bg-black rounded-xl overflow-hidden relative group">
                                        <img src={preview} alt="Scan" className="w-full h-full object-contain" />
                                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-mono">
                                            T2-WEIGHTED MRI
                                        </div>
                                    </div>
                                </div>

                                {/* Segmentation Map (Mock Overlay for now) */}
                                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                                    <h4 className="font-bold text-dark mb-4 flex items-center justify-between">
                                        <span>AI Segmentation</span>
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-bold">Generated</span>
                                    </h4>
                                    <div className="aspect-square bg-black rounded-xl overflow-hidden relative group">
                                        {/* In a real app, we would overlay a mask image here. For now, using CSS filters/opacity to simulate analysis view */}
                                        <img src={preview} alt="Scan" className="w-full h-full object-contain filter contrast-125 brightness-75 sepia-50 hue-rotate-180" />
                                        
                                        <div className="absolute inset-0 bg-transparent border-2 border-red-500/50 rounded-xl m-10 animate-pulse">
                                            {/* Fake Bounding Box/Highlight */}
                                        </div>
                                        <div className="absolute top-4 left-4 bg-purple-900/80 backdrop-blur text-white px-3 py-1 rounded-lg text-xs font-mono border border-purple-500/30">
                                            TUMOR REGION
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Clinical Interpretation & Next Steps */}
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                    <h3 className="font-bold text-lg text-dark">Clinical Interpretation</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Analysis Report</h4>
                                        <p className="text-dark leading-relaxed">
                                            {patientResult.interpretation || "No interpretation available."}
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Recommended Next Steps</h4>
                                        <div className="space-y-3">
                                            {patientResult.nextSteps && patientResult.nextSteps.map((step, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="h-6 w-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs ring-4 ring-white">
                                                        {i + 1}
                                                    </div>
                                                    <span className="font-medium text-dark">{step}</span>
                                                </div>
                                            ))}
                                            {(!patientResult.nextSteps || patientResult.nextSteps.length === 0) && (
                                                <p className="text-secondary italic">None suggested.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center text-xs text-secondary">
                                    <span>AI Analysis ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                                    <span>{new Date().toLocaleString()}</span>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
                </div>
            </main>
        </div>
    );
};

export default BrainTumorAnalytics;
