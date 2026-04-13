import React, { useEffect, useState } from 'react';
import { User, FileText, Activity, LogOut, Bell, Download, Calendar, Pill, Stethoscope, File, Clock, ShieldCheck, ChevronRight, LayoutDashboard, Brain, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [reports, setReports] = useState([]);
    const [aiResults, setAiResults] = useState([]); // Brain Tumor
    const [neuroResults, setNeuroResults] = useState([]); // Neuro Risk
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('medical'); // 'medical', 'reports', 'timeline'
    const [reportSubTab, setReportSubTab] = useState('files'); // 'files', 'ai'

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const [recordsRes, reportsRes, aiRes, neuroRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/records/history', { headers: { Authorization: token } }),
                    axios.get('http://localhost:5000/api/reports', { headers: { Authorization: token } }),
                    axios.get(`http://localhost:5000/api/ai/brain-tumor/history?healthId=${user.healthId}`, { headers: { Authorization: token } }),
                    axios.get('http://localhost:5000/api/ai/neuro-risk/history', { headers: { Authorization: token } })
                ]);
                setRecords(recordsRes.data);
                setReports(reportsRes.data);
                setAiResults(aiRes.data);
                setNeuroResults(neuroRes.data);
            } catch (err) {
                console.error("Failed to fetch data");
                // toast.error("Session expired or network error");
            } finally {
                setLoading(false);
            }
        };
        
        if (user) fetchData();
    }, []);

    const downloadReport = (filePath) => {
        const filename = filePath.split('\\').pop().split('/').pop();
        window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", { 
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 fixed h-full z-20 hidden lg:flex flex-col">
                <div className="p-6 border-b border-dark/50">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/30">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-dark tracking-tight block">NeuroLink</span>
                            <span className="text-xs text-secondary font-medium tracking-widest uppercase">Patient Portal</span>
                        </div>
                    </div>
                    
                    <nav className="space-y-1">
                        <button 
                            onClick={() => { setActiveTab('dashboard'); navigate('/user-dashboard'); }} 
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <LayoutDashboard size={18} /> 
                            <span>Dashboard</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('medical')} 
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'medical' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <FileText size={18} /> 
                            <span>My Health Records</span>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/user/upload-reports')} 
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-slate-500 hover:bg-slate-50`}
                        >
                            <Upload size={18} /> 
                            <span>Upload Reports</span>
                        </button>

                        <button 
                            onClick={() => navigate('/user/ai-insights')} 
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-purple-600 bg-purple-50 hover:bg-purple-100`}
                        >
                            <Brain size={18} /> 
                            <span>AI Health Insights</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('prescriptions')} 
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === 'prescriptions' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <Pill size={18} /> 
                            <span>Prescriptions</span>
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-100">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition">
                        <LogOut size={20} /> <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 p-6 lg:p-10 transition-all">
                {/* Top Bar */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-dark tracking-tight">
                            {activeTab === 'medical' ? 'Medical Timeline' : 'Digital Reports'}
                        </h1>
                        <p className="text-slate-500 mt-1">Manage your health records and predictions securely.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="font-bold text-dark text-sm">{user.name}</span>
                            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">● Active Patient</span>
                        </div>
                        <div className="h-12 w-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 ring-4 ring-white">
                            {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                    </div>
                </header>

                {/* ID Card Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-dark rounded-[2rem] p-8 md:p-10 mb-12 shadow-2xl"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-primary/80">
                                <ShieldCheck size={18} />
                                <span className="text-xs font-bold tracking-widest uppercase">Unified Health Identity</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-mono font-bold text-white tracking-wider mb-6">
                                {user.healthId || 'NL-IND-PENDING'}
                            </h2>
                            <div className="flex flex-wrap gap-8 text-slate-300">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Age</span>
                                    <span className="text-lg font-semibold text-white">{user.age || '--'} yrs</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Gender</span>
                                    <span className="text-lg font-semibold text-white">{user.gender || '--'}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Status</span>
                                    <span className="text-lg font-semibold text-emerald-400">Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick AI Status */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-full md:w-auto min-w-[200px]">
                            <p className="text-slate-400 text-xs font-bold uppercase mb-2">Brain Tumor Analysis</p>
                            {aiResults.length > 0 ? (
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className={`h-3 w-3 rounded-full animate-pulse ${aiResults[0].tumorType === 'No Tumor' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                        <span className="text-xl font-bold text-white">{aiResults[0].tumorType}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Confidence: {(aiResults[0].confidence * 100).toFixed(1)}% <br/>
                                        Date: {new Date(aiResults[0].createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-3 w-3 bg-slate-500 rounded-full"></div>
                                        <span className="text-xl font-bold text-slate-400">No Data</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">No analysis records found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* CONTENT AREA */}
                {activeTab === 'medical' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-8"
                    >
                        {loading ? (
                             <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                             </div>
                        ) : records.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                                <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="h-10 w-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-dark">No Records Yet</h3>
                                <p className="text-slate-500">Your medical history will appear here once your doctor adds it.</p>
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 space-y-10 pl-8 md:pl-10 py-2">
                                {records.map((record, index) => (
                                    <div key={record._id} className="relative">
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[41px] md:-left-[49px] top-0 h-5 w-5 rounded-full border-4 border-white bg-primary shadow-sm ring-1 ring-slate-100"></div>

                                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                                            {/* Header */}
                                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6 border-b border-slate-50 pb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-dark flex items-center gap-2">
                                                        {record.diagnosis}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1 text-secondary text-sm">
                                                        <Stethoscope size={14} className="text-primary" />
                                                        <span className="font-medium text-dark">{record.doctorName}</span>
                                                        <span className="text-slate-300">•</span>
                                                        <span>{record.hospital}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg text-xs font-semibold text-secondary uppercase tracking-wide">
                                                    <Clock size={14} />
                                                    {formatDate(record.visitDate)}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-6">
                                                {/* Medicines */}
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                        <Pill size={14} /> Prescribed Medication
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {record.medicines && record.medicines.map((med, idx) => (
                                                            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3 group-hover:border-primary/20">
                                                                <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                                                                    <div>
                                                                        <div className="font-bold text-dark text-base flex items-center gap-2 mb-1">
                                                                            {idx + 1}️⃣ {med.name}
                                                                        </div>
                                                                        <div className="text-secondary text-sm">Dosage: {med.dosage} – {med.frequency}</div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-xs text-slate-400 mt-1">{med.duration}</div>
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 mt-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-slate-400 font-medium w-32 shrink-0">Medical System:</span>
                                                                        <span className="font-medium text-dark">{med.system}</span>
                                                                    </div>
                                                                    {med.therapeuticClass && (
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-slate-400 font-medium w-32 shrink-0">Therapeutic Class:</span>
                                                                            <span className="font-medium text-dark">{med.therapeuticClass}</span>
                                                                        </div>
                                                                    )}
                                                                    {med.arushCode && (
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-slate-400 font-medium w-32 shrink-0">ARUSH Code:</span>
                                                                            <span className="font-bold text-emerald-600">{med.arushCode}</span>
                                                                        </div>
                                                                    )}
                                                                    {med.ayurvedaEquivalent && (
                                                                        <div className="mt-2 bg-amber-50/70 p-3 rounded-lg border border-amber-100/50 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                                                                            <span className="text-slate-500 font-bold shrink-0">Ayurveda Equivalent:</span>
                                                                            <span className="text-amber-700 italic font-medium">{med.ayurvedaEquivalent}</span>
                                                                            <span className="text-[10px] text-amber-600/60 uppercase tracking-wider font-bold md:ml-auto">(Equivalent Reference)</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Notes */}
                                                {record.notes && (
                                                    <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                                                        <span className="font-bold mr-2">Note:</span> {record.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'reports' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                         <div className="flex items-center gap-4 mb-8">
                            <button 
                                onClick={() => setReportSubTab('files')}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition ${reportSubTab === 'files' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                                Uploaded Documents
                            </button>
                            <button 
                                onClick={() => setReportSubTab('ai')}
                                className={`px-5 py-2 rounded-full text-sm font-bold transition ${reportSubTab === 'ai' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
                            >
                                AI Generated Reports
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : reportSubTab === 'files' ? (
                            reports.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <File className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-dark">No Uploaded Reports</h3>
                                    <p className="text-slate-500">Reports uploaded by medical pros will show here.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                     {/* Upload Report - Patient Action */}
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center hover:border-primary/50 transition cursor-pointer group">
                                        <div className="bg-slate-50 p-4 rounded-full mb-4 group-hover:bg-primary/10 transition">
                                            <FileText className="h-8 w-8 text-slate-400 group-hover:text-primary transition" />
                                        </div>
                                        <h3 className="font-bold text-dark">Upload New Report</h3>
                                        <p className="text-xs text-secondary mt-1 mb-4">Add your lab results or past prescriptions</p>
                                        <button 
                                            onClick={() => navigate('/user/upload-reports')} 
                                            className="text-primary text-sm font-bold bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition"
                                        >
                                            Select File
                                        </button>
                                    </div>

                                    {reports.map((report) => (
                                        <div key={report._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="bg-blue-50 p-3.5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                                    <File size={24} />
                                                </div>
                                                <span className="px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-tight">
                                                    {report.reportType}
                                                </span>
                                            </div>
                                            
                                            <div className="mb-4 flex-1">
                                                <h4 className="font-bold text-dark mb-1 line-clamp-1" title={report.fileName}>{report.fileName}</h4>
                                                <p className="text-xs text-secondary mt-2">
                                                    <span className="block font-semibold text-slate-700">Dr. {report.doctorName}</span>
                                                    <span className="block mt-0.5">{formatDate(report.uploadDate)}</span>
                                                </p>
                                            </div>
    
                                            <button 
                                                onClick={() => downloadReport(report.filePath)}
                                                className="w-full py-3 rounded-xl border border-slate-200 font-bold text-sm text-secondary hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Download size={16} /> Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            // AI Reports
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-dark">Neurological Risk Assessments</h3>
                                {neuroResults.length === 0 ? (
                                    <div className="p-8 bg-white border border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
                                        No AI risk reports generated yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {neuroResults.map((res) => (
                                            <div key={res._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="bg-purple-50 p-3 rounded-xl text-purple-600">
                                                        <ShieldCheck size={24} />
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${res.source === 'Patient' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                        {res.source === 'Patient' ? 'Self-Check' : 'Doctor Check'}
                                                    </span>
                                                </div>
                                                <h4 className="font-bold text-dark mb-1">{res.riskLevel} Risk</h4>
                                                <p className="text-xs text-slate-400 mb-4">{new Date(res.generatedDate).toLocaleDateString()}</p>
                                                
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {res.factors.slice(0, 2).map((f, i) => (
                                                        <span key={i} className="text-[10px] bg-slate-50 px-2 py-1 rounded text-secondary">{f}</span>
                                                    ))}
                                                    {res.factors.length > 2 && <span className="text-[10px] bg-slate-50 px-2 py-1 rounded text-secondary">+{res.factors.length - 2} more</span>}
                                                </div>

                                                <div className={`text-xs p-2 rounded-lg ${
                                                    res.riskLevel === 'High' ? 'bg-red-50 text-red-700' : 
                                                    res.riskLevel === 'Moderate' ? 'bg-orange-50 text-orange-700' : 'bg-green-50 text-green-700'
                                                }`}>
                                                    Status: <strong>{res.riskLevel}</strong>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;
