import React, { useEffect, useState } from 'react';
import { User, FileText, Activity, LogOut, Bell, Download, Calendar, Pill, Stethoscope, File, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('medical'); // 'medical', 'reports', 'timeline'

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
                const [recordsRes, reportsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/records/history', { headers: { Authorization: token } }),
                    axios.get('http://localhost:5000/api/reports', { headers: { Authorization: token } })
                ]);
                setRecords(recordsRes.data);
                setReports(reportsRes.data);
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
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/30">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-dark tracking-tight block">NeuroLink</span>
                            <span className="text-xs text-secondary font-medium tracking-widest uppercase">Patient Portal</span>
                        </div>
                    </div>
                    
                    <nav className="space-y-2">
                        <button 
                            onClick={() => setActiveTab('medical')} 
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-200 group ${activeTab === 'medical' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-dark'}`}
                        >
                            <FileText size={20} className={activeTab === 'medical' ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'} /> 
                            <span>Medical History</span>
                            {activeTab === 'medical' && <ChevronRight size={16} className="ml-auto opacity-70" />}
                        </button>
                        
                        <button 
                            onClick={() => setActiveTab('reports')} 
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-medium transition-all duration-200 group ${activeTab === 'reports' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-dark'}`}
                        >
                            <File size={20} className={activeTab === 'reports' ? 'text-white' : 'text-slate-400 group-hover:text-purple-500 transition-colors'} /> 
                            <span>Digital Reports</span>
                            {activeTab === 'reports' && <ChevronRight size={16} className="ml-auto opacity-70" />}
                        </button>

                        <div className="pt-4 mt-4 border-t border-slate-100">
                             <div className="px-5 py-3 rounded-xl bg-slate-50 border border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-2">My Stats</p>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-secondary">Visits</span>
                                    <span className="text-sm font-bold text-dark">{records.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-secondary">Reports</span>
                                    <span className="text-sm font-bold text-dark">{reports.length}</span>
                                </div>
                             </div>
                        </div>
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

                        {/* Quick AI Status (Static for now) */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-full md:w-auto min-w-[200px]">
                            <p className="text-slate-400 text-xs font-bold uppercase mb-2">Neurological Risk (AI)</p>
                            <div className="flex items-center gap-3">
                                <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-2xl font-bold text-white">Low Risk</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Last updated: Just now</p>
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
                                                            <div key={idx} className="bg-slate-50 hover:bg-slate-100 transition p-4 rounded-xl border border-slate-100 flex justify-between items-center group-hover:border-primary/10">
                                                                <div>
                                                                    <div className="font-bold text-dark">{med.name}</div>
                                                                    <div className="text-xs text-secondary mt-1">{med.dosage} • {med.frequency}</div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{med.system}</div>
                                                                    <div className="text-xs text-slate-400 mt-1">{med.duration}</div>
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
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                                <File className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-dark">No Reports</h3>
                                <p className="text-slate-500">Reports uploaded by medical pros will show here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                        )}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default UserDashboard;
