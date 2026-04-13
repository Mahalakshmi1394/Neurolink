import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, ShieldCheck, HeartPulse, Brain, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const PatientPreventiveAI = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    
    // User Self-Entry Form
    const [formData, setFormData] = useState({
        bp: '',
        sugar: '',
        weight: '',
        symptoms: []
    });

    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem('token');
                if(!token) return;
                const res = await axios.get('http://localhost:5000/api/ai/neuro-risk/history', {
                    headers: { Authorization: token }
                });
                setHistory(res.data);
            } catch (err) {
                console.error("Failed to fetch history");
            }
        };
        fetchHistory();
    }, [result]); // Refresh when result changes

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Assuming we fetch the user's health ID from their profile on the backend based on token
            // For now, sending the manual data. Backend needs to infer user from token.
            const res = await axios.post('http://localhost:5000/api/ai/patient/preventive-check', {
                ...formData
            }, {
                headers: { Authorization: token }
            });
            
            setResult(res.data.data);
            toast.success("Analysis Complete");
        } catch (err) {
            toast.error(err.response?.data?.message || "Analysis Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Toaster position="top-right" />
            
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/user-dashboard')} className="p-2 hover:bg-slate-100 rounded-lg transition text-secondary">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-dark flex items-center gap-2">
                                <ShieldCheck className="text-emerald-600" /> Preventive AI Check
                            </h1>
                            <p className="text-sm text-secondary">Self-Assessment for Neurological Wellness</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                                <Activity size={18} /> Enter Current Vitals
                            </h3>
                            <form onSubmit={handleAnalyze} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-secondary mb-1 block">Blood Pressure (Systolic/Diastolic)</label>
                                    <input 
                                        type="text" 
                                        name="bp"
                                        value={formData.bp}
                                        onChange={handleChange}
                                        placeholder="e.g. 120/80" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-secondary mb-1 block">Sugar Level (mg/dL)</label>
                                    <input 
                                        type="number" 
                                        name="sugar"
                                        value={formData.sugar}
                                        onChange={handleChange}
                                        placeholder="e.g. 90" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-secondary mb-1 block">Weight (kg) (Optional)</label>
                                    <input 
                                        type="number" 
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        placeholder="e.g. 70" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 leading-relaxed">
                                    <p><strong>Privacy Note:</strong> Your data is secure and analyzes locally. This tool checks for early risk signs based on your medical history and these inputs.</p>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'Analyzing...' : 'Check My Risk'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Result Section */}
                    <div>
                        {!result ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-dashed border-slate-200 opacity-50">
                                <Brain size={48} className="text-slate-200 mb-4" />
                                <h3 className="text-lg font-bold text-slate-400">No Analysis Yet</h3>
                                <p className="text-sm text-slate-400">Enter your vitals to see your neurological risk status.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn h-full">
                                <div className={`p-6 text-white text-center ${
                                    result.riskLevel === 'High' ? 'bg-red-500' : 
                                    result.riskLevel === 'Moderate' ? 'bg-orange-500' : 'bg-emerald-500'
                                }`}>
                                    <h2 className="text-2xl font-bold mb-1">{result.riskLevel} Risk</h2>
                                    <p className="opacity-90 text-sm">Neurological Health Assessment</p>
                                </div>
                                
                                <div className="p-6 space-y-6">
                                    <div className="flex items-start gap-4">
                                        {result.riskLevel === 'High' ? <AlertTriangle className="text-red-500 shrink-0" /> : 
                                         result.riskLevel === 'Moderate' ? <Activity className="text-orange-500 shrink-0" /> : <CheckCircle className="text-emerald-500 shrink-0" />}
                                        <div>
                                            <h4 className="font-bold text-dark mb-1">AI Recommendation</h4>
                                            <p className="text-dark leading-relaxed text-sm">
                                                {result.recommendation}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Simplified Factors for Patient */}
                                    {result.factors && result.factors.length > 0 && (
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <h4 className="font-bold text-slate-500 text-xs uppercase tracking-wider mb-2">Key Factors Noted</h4>
                                            <ul className="space-y-2">
                                                {result.factors.map((f, i) => (
                                                    <li key={i} className="text-sm text-dark flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <button onClick={() => navigate('/user-dashboard')} className="text-slate-400 text-sm hover:text-dark">
                                            Back to Dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Timeline */}
                <div className="max-w-4xl mx-auto">
                     <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-secondary" /> Risk History
                    </h3>
                    
                    {history.length === 0 ? (
                        <div className="text-center p-8 bg-slate-100 rounded-xl text-slate-400 text-sm">
                            No past assessments found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((record) => (
                                <div key={record._id} className="bg-white p-5 rounded-xl border border-slate-100 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                         <div className={`w-3 h-3 rounded-full ${
                                            record.riskLevel === 'High' ? 'bg-red-500' : 
                                            record.riskLevel === 'Moderate' ? 'bg-orange-500' : 'bg-emerald-500'
                                        }`}></div>
                                        <div>
                                            <div className="font-bold text-dark">{record.riskLevel} Risk</div>
                                            <div className="text-xs text-secondary">{new Date(record.generatedDate).toLocaleDateString()} • {new Date(record.generatedDate).toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-3 py-1 bg-slate-50 text-slate-500 text-xs font-bold rounded-lg uppercase">
                                            {record.source === 'Patient' ? 'Self-Check' : 'Dr. Reviewed'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PatientPreventiveAI;
