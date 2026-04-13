import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, Search, AlertTriangle, ShieldCheck, FileText, Brain } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const NeurologicalRiskPrediction = () => {
    const navigate = useNavigate();
    const [healthId, setHealthId] = useState('');
    const [bp, setBp] = useState('');
    const [sugar, setSugar] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [riskResult, setRiskResult] = useState(null);
    
    // Fetch History when Health ID changes
    React.useEffect(() => {
        const fetchHistory = async () => {
            if(!healthId) { setHistory([]); return; }
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/ai/neuro-risk/history?healthId=${healthId}`, { 
                    headers: { Authorization: token } 
                });
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch patient history");
            }
        };
        // Debounce slightly or just call
        const timer = setTimeout(fetchHistory, 500);
        return () => clearTimeout(timer);
    }, [healthId, riskResult]); // Refresh on new result too

    const handlePredict = async (e) => {
        e.preventDefault();
        if (!healthId) {
            toast.error("Please enter Patient Health ID");
            return;
        }

        setLoading(true);
        setRiskResult(null);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/ai/neuro-risk/predict', { 
                healthId,
                bp,     // Manual Input
                sugar   // Manual Input
            }, {
                headers: { Authorization: token }
            });
            
            if (res.data.success) {
                setRiskResult(res.data.data);
                toast.success("Risk Analysis Complete");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Prediction Failed");
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
                            <Activity className="h-6 w-6 text-primary" />
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
                                    <Activity className="text-purple-600" /> Neurological Risk Prediction
                                </h1>
                                <p className="text-sm text-secondary">Longitudinal History Analysis (Module 2)</p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT COLUMN: Patient Selection */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                                <Search size={18} /> Select Patient
                            </h3>
                            <form onSubmit={handlePredict} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-secondary mb-1 block">Patient Health ID <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={healthId}
                                            onChange={(e) => setHealthId(e.target.value)}
                                            placeholder="e.g. NL-IND-XYZ" 
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20 pl-10"
                                        />
                                        <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    </div>
                                    <p className="text-xs text-secondary mt-1">
                                        Enter the Health ID to analyze history.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-secondary mb-1 block">Blood Pressure</label>
                                        <input 
                                            type="text" 
                                            value={bp}
                                            onChange={(e) => setBp(e.target.value)}
                                            placeholder="e.g. 120/80" 
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-secondary mb-1 block">Sugar Level</label>
                                        <input 
                                            type="text" 
                                            value={sugar}
                                            onChange={(e) => setSugar(e.target.value)}
                                            placeholder="e.g. 90 mg/dL" 
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/20"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading || !healthId}
                                    className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Analyzing History...' : 'Predict Risk'}
                                </button>
                            </form>
                        </div>

                        {/* Explainability Info */}
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-sm text-blue-800 space-y-3">
                            <h4 className="font-bold flex items-center gap-2">
                                <Brain size={16} /> How it Works
                            </h4>
                            <p>
                                This AI module analyzes longitudinal data including:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-1 opacity-80">
                                <li>Age & Gender demographics</li>
                                <li>Chronic disease history (Diabetes, BP)</li>
                                <li>Long-term medication patterns</li>
                                <li>Past brain tumor scan results</li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Results */}
                    <div className="lg:col-span-8">
                        {!riskResult ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-slate-200 opacity-50">
                                <Activity size={64} className="text-slate-200 mb-4" />
                                <h3 className="text-xl font-bold text-slate-400">Ready to Analyze</h3>
                                <p className="text-slate-400">Select a patient to generate a risk assessment score.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-fadeIn">
                                {/* Risk Score Card */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="text-center md:text-left">
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Neurological Risk Score</p>
                                        <div className="flex items-baseline gap-2 justify-center md:justify-start">
                                            <span className={`text-6xl font-black ${
                                                riskResult.riskLevel === 'High' ? 'text-red-500' : 
                                                riskResult.riskLevel === 'Moderate' ? 'text-orange-500' : 'text-emerald-500'
                                            }`}>
                                                {riskResult.riskScore}
                                            </span>
                                            <span className="text-slate-400 font-medium">/ 1.0</span>
                                        </div>
                                    </div>

                                    <div className={`px-8 py-4 rounded-xl flex items-center gap-4 ${
                                        riskResult.riskLevel === 'High' ? 'bg-red-50 text-red-700' : 
                                        riskResult.riskLevel === 'Moderate' ? 'bg-orange-50 text-orange-700' : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                        {riskResult.riskLevel === 'High' ? <AlertTriangle size={32} /> : 
                                         riskResult.riskLevel === 'Moderate' ? <Activity size={32} /> : <ShieldCheck size={32} />}
                                        <div>
                                            <h3 className="text-xl font-bold">{riskResult.riskLevel} Risk</h3>
                                            <p className="text-xs opacity-80">Pre-symptomatic Prediction</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Factors & Recommendations */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                        <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
                                            <FileText size={18} className="text-purple-600" /> Contributing Factors
                                        </h4>
                                        <div className="space-y-3">
                                            {riskResult.factors && riskResult.factors.length > 0 ? (
                                                riskResult.factors.map((factor, i) => (
                                                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg text-sm">
                                                        <span className="text-red-500 font-bold">•</span>
                                                        <span className="text-dark font-medium">{factor}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-slate-500 text-sm italic">No specific risk factors identified.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                                        <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
                                            <ShieldCheck size={18} className="text-emerald-600" /> AI Recommendation
                                        </h4>
                                        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-sm leading-relaxed border border-emerald-100">
                                            {riskResult.riskLevel === 'High' ? (
                                                "Patient shows significant markers for potential neurological issues. Immediate specialized consultation and regular MRI monitoring (every 3 months) is recommended."
                                            ) : riskResult.riskLevel === 'Moderate' ? (
                                                "Elevated risk detected based on history. Preventive lifestyle changes and a follow-up neurological exam in 6 months are suggested."
                                            ) : (
                                                "Risk levels are within normal range. Routine annual checkups are sufficient. Encourage maintaining a healthy lifestyle."
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-4 text-center">
                                            * This is a predictive tool, not a diagnosis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* History Timeline */}
                        {healthId && (
                            <div className="mt-8 pt-8 border-t border-slate-200">
                                <h3 className="font-bold text-dark mb-6 flex items-center gap-2">
                                     <Activity size={20} className="text-secondary" /> Assessment History
                                </h3>
                                
                                {history.length === 0 ? (
                                    <p className="text-slate-400 text-sm italic">No history found for this patient.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {history.map((record) => (
                                            <div key={record._id} className={`p-5 rounded-xl border flex items-center justify-between shadow-sm transition ${record.source === 'Patient' ? 'bg-blue-50/50 border-blue-100 hover:bg-blue-50' : 'bg-white border-slate-200 hover:border-purple-200'}`}>
                                                <div className="flex items-center gap-4">
                                                     <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                                                        record.riskLevel === 'High' ? 'bg-red-100 text-red-600' : 
                                                        record.riskLevel === 'Moderate' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                                                    }`}>
                                                        {record.riskScore?.toFixed(2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-dark flex items-center gap-2">
                                                            {record.riskLevel} Risk
                                                            {record.source === 'Patient' && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded-full uppercase">Patient Self-Check</span>}
                                                        </div>
                                                        <div className="text-xs text-secondary">{new Date(record.generatedDate).toLocaleDateString()} • {new Date(record.generatedDate).toLocaleTimeString()}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs text-slate-400 block mb-1">Driven By</span>
                                                    <span className="text-sm font-semibold text-dark">{record.source || 'Doctor'}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NeurologicalRiskPrediction;
