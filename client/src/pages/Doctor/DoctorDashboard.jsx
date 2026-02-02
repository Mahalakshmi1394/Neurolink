import React, { useState } from 'react';
import { LayoutDashboard, Users, Search, Stethoscope, FilePlus, LogOut, ChevronRight, PlusCircle, UserCheck, Trash2, Upload, FileText, Clock, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const DoctorDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const navigate = useNavigate();

    // States
    const [searchId, setSearchId] = useState('');
    const [searchedPatient, setSearchedPatient] = useState(null);
    const [patientHistory, setPatientHistory] = useState([]); // Store history
    const [patientReports, setPatientReports] = useState([]); // Store reports
    const [activeTab, setActiveTab] = useState('record'); // 'record', 'upload', 'view_history', 'view_reports'
    
    // Prescription Form State
    const [diagnosis, setDiagnosis] = useState('');
    const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '', duration: '', system: 'Allopathy' }]);
    const [notes, setNotes] = useState('');

    // Report Upload State
    const [file, setFile] = useState(null);
    const [reportType, setReportType] = useState('Lab Report');
    const [uploading, setUploading] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            // 1. Get Patient Info
            const res = await axios.post('http://localhost:5000/api/records/search', 
                { healthId: searchId },
                { headers: { Authorization: token } }
            );
            setSearchedPatient(res.data);
            
            // 2. Get Patient History & Reports (Continuity of Care)
            try {
                const [historyRes, reportsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/records/history?healthId=${searchId}`, { headers: { Authorization: token } }),
                    axios.get(`http://localhost:5000/api/reports?healthId=${searchId}`, { headers: { Authorization: token } })
                ]);
                
                setPatientHistory(historyRes.data);
                setPatientReports(reportsRes.data);
                toast.success('Patient records loaded!');
            } catch (histErr) {
                console.error("Could not fetch data", histErr);
                setPatientHistory([]);
                setPatientReports([]);
            }

        } catch (err) {
            setSearchedPatient(null);
            setPatientHistory([]);
            setPatientReports([]);
            toast.error(err.response?.data?.message || 'Patient not found');
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = (filePath) => {
        const filename = filePath.split('\\').pop().split('/').pop();
        window.open(`http://localhost:5000/uploads/${filename}`, '_blank');
    };

    // --- Record Logic ---
    const addMedicineField = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', system: 'Allopathy' }]);
    };

    const removeMedicineField = (index) => {
        const newMedicines = [...medicines];
        newMedicines.splice(index, 1);
        setMedicines(newMedicines);
    };

    const handleMedicineChange = (index, field, value) => {
        const newMedicines = [...medicines];
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };

    const handleAddRecord = async (e) => {
        e.preventDefault();
        if (!searchedPatient) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/records/add', 
                { 
                    healthId: searchedPatient.healthId,
                    diagnosis,
                    medicines,
                    notes
                },
                { headers: { Authorization: token } }
            );
            toast.success('Medical record added successfully!');
            // Reset form
            setDiagnosis('');
            setMedicines([{ name: '', dosage: '', frequency: '', duration: '', system: 'Allopathy' }]);
            setNotes('');
            setSearchedPatient(null);
            setSearchId('');
            setPatientHistory([]);
            setPatientReports([]);
        } catch (err) {
            toast.error('Failed to add record');
        }
    };

    // --- Report Logic ---
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadReport = async (e) => {
        e.preventDefault();
        if (!file || !searchedPatient) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('healthId', searchedPatient.healthId);
        formData.append('reportType', reportType);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/reports/upload', formData, {
                headers: { 
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Report uploaded successfully!');
            setFile(null);
            setSearchedPatient(null);
            setSearchId('');
            setPatientHistory([]);
            setPatientReports([]);
        } catch (err) {
            toast.error('Failed to upload report');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Toaster position="top-right" />
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
                    <a href="#" className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl font-medium shadow-lg shadow-primary/20">
                        <LayoutDashboard size={20} /> Dashboard
                    </a>
                </nav>

                <div className="absolute bottom-0 w-full p-6 border-t border-white/5">
                    <button onClick={handleLogout} className="flex items-center gap-3 text-red-400 font-medium hover:text-red-300 transition w-full">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 bg-slate-50">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-20">
                    <div>
                        <h1 className="text-2xl font-bold text-dark">Doctor Dashboard</h1>
                        <p className="text-secondary">Welcome, Dr. {user.name || 'Doc'}</p>
                    </div>
                </header>

                <div className="p-8 max-w-6xl mx-auto">
                    
                    {/* Search Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                        <h2 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                            <Search className="text-primary" /> Search Patient
                        </h2>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <input 
                                type="text" 
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                placeholder="Enter Patient Health ID (e.g., NL-IND-X92F8)" 
                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                            />
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="px-6 py-3 bg-dark text-white rounded-xl font-semibold hover:bg-slate-800 transition disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </form>
                    </div>

                    {/* Patient Found Section */}
                    {searchedPatient && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Patient Info Card */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-gradient-to-br from-primary to-blue-600 p-6 rounded-2xl text-white shadow-xl h-fit">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <UserCheck size={24} />
                                        </div>
                                        <div>
                                            <p className="text-blue-100 text-sm">Patient Found</p>
                                            <h3 className="text-xl font-bold">{searchedPatient.name}</h3>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                                            <p className="text-xs text-blue-200 uppercase">Health ID</p>
                                            <p className="font-mono font-semibold text-lg">{searchedPatient.healthId}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                                                <p className="text-xs text-blue-200 uppercase">Age</p>
                                                <p className="font-semibold">{searchedPatient.age}</p>
                                            </div>
                                            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                                                <p className="text-xs text-blue-200 uppercase">Gender</p>
                                                <p className="font-semibold">{searchedPatient.gender}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Previous History Preview */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                    <h4 className="font-bold text-dark mb-4 flex items-center gap-2">
                                        <FileText size={18} className="text-secondary" /> Medical History
                                    </h4>
                                    {patientHistory.length === 0 ? (
                                        <p className="text-sm text-secondary italic">No previous records found.</p>
                                    ) : (
                                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                            {patientHistory.map((rec) => (
                                                <div key={rec._id} className="text-sm border-l-2 border-slate-200 pl-3">
                                                    <p className="font-semibold text-dark">{rec.diagnosis}</p>
                                                    <p className="text-xs text-secondary mt-0.5">
                                                        {new Date(rec.visitDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-secondary">Dr. {rec.doctorName}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Panel */}
                            <div className="lg:col-span-2 bg-white shadow-sm border border-slate-100 rounded-2xl overflow-hidden h-fit">
                                {/* Tabs */}
                                <div className="flex border-b border-slate-100 overflow-x-auto">
                                    <button 
                                        className={`flex-1 py-4 px-4 font-semibold text-sm whitespace-nowrap transition ${activeTab === 'record' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-secondary hover:bg-slate-50'}`}
                                        onClick={() => setActiveTab('record')}
                                    >
                                        Add Record
                                    </button>
                                    <button 
                                        className={`flex-1 py-4 px-4 font-semibold text-sm whitespace-nowrap transition ${activeTab === 'upload' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-secondary hover:bg-slate-50'}`}
                                        onClick={() => setActiveTab('upload')}
                                    >
                                        Upload Report
                                    </button>
                                    <button 
                                        className={`flex-1 py-4 px-4 font-semibold text-sm whitespace-nowrap transition ${activeTab === 'view_history' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-secondary hover:bg-slate-50'}`}
                                        onClick={() => setActiveTab('view_history')}
                                    >
                                        View History ({patientHistory.length})
                                    </button>
                                    <button 
                                        className={`flex-1 py-4 px-4 font-semibold text-sm whitespace-nowrap transition ${activeTab === 'view_reports' ? 'bg-primary/5 text-primary border-b-2 border-primary' : 'text-secondary hover:bg-slate-50'}`}
                                        onClick={() => setActiveTab('view_reports')}
                                    >
                                        View CS/Reports ({patientReports.length})
                                    </button>
                                </div>

                                {/* Tab Content */}
                                {activeTab === 'record' && (
                                    <div className="p-8">
                                        <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
                                            <FilePlus className="text-green-600" /> New Prescription
                                        </h3>
                                        <form onSubmit={handleAddRecord} className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-secondary mb-2">Diagnosis / Condition</label>
                                                <input 
                                                    type="text" 
                                                    value={diagnosis}
                                                    onChange={(e) => setDiagnosis(e.target.value)}
                                                    placeholder="e.g. Viral Fever, Migraine" 
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-sm font-medium text-secondary">Medicines</label>
                                                    <button type="button" onClick={addMedicineField} className="text-sm text-primary font-semibold hover:underline">+ Add Medicine</button>
                                                </div>
                                                
                                                <div className="space-y-3">
                                                    {medicines.map((med, index) => (
                                                        <div key={index} className="flex flex-wrap gap-2 items-start bg-slate-50 p-3 rounded-xl border border-slate-100 relative group">
                                                            <input 
                                                                type="text" placeholder="Medicine Name" required
                                                                value={med.name} onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                                                className="flex-[2] min-w-[150px] px-3 py-2 border rounded-lg text-sm outline-none"
                                                            />
                                                            <input 
                                                                type="text" placeholder="Dosage" required
                                                                value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                                                className="flex-1 min-w-[80px] px-3 py-2 border rounded-lg text-sm outline-none"
                                                            />
                                                            <input 
                                                                type="text" placeholder="Freq" required
                                                                value={med.frequency} onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                                                className="flex-1 min-w-[80px] px-3 py-2 border rounded-lg text-sm outline-none"
                                                            />
                                                            <input 
                                                                type="text" placeholder="Dur" required
                                                                value={med.duration} onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                                                className="flex-1 min-w-[80px] px-3 py-2 border rounded-lg text-sm outline-none"
                                                            />
                                                            <select 
                                                                value={med.system} onChange={(e) => handleMedicineChange(index, 'system', e.target.value)}
                                                                className="flex-1 min-w-[100px] px-3 py-2 border rounded-lg text-sm outline-none"
                                                            >
                                                                <option>Allopathy</option>
                                                                <option>Ayurveda</option>
                                                                <option>Siddha</option>
                                                            </select>
                                                            
                                                            {medicines.length > 1 && (
                                                                <button type="button" onClick={() => removeMedicineField(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-secondary mb-2">Private Notes</label>
                                                <textarea 
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                    placeholder="Internal observations..." 
                                                    rows="2"
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                ></textarea>
                                            </div>

                                            <div className="flex justify-end">
                                                <button 
                                                    type="submit" 
                                                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg shadow-green-600/20 flex items-center gap-2"
                                                >
                                                    <PlusCircle size={20} /> Save Record
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'upload' && (
                                    <div className="p-8">
                                        <h3 className="text-lg font-bold text-dark mb-6 flex items-center gap-2">
                                            <Upload className="text-blue-600" /> Upload Patient Report
                                        </h3>
                                        <form onSubmit={handleUploadReport} className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-secondary mb-2">Report Type</label>
                                                <select 
                                                    value={reportType}
                                                    onChange={(e) => setReportType(e.target.value)}
                                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                                >
                                                    <option>Lab Report</option>
                                                    <option>X-Ray</option>
                                                    <option>MRI Scan</option>
                                                    <option>CT Scan</option>
                                                    <option>Prescription Scan</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>

                                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer relative">
                                                <input 
                                                    type="file" 
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="flex flex-col items-center gap-2 pointer-events-none">
                                                    <div className="bg-blue-50 p-4 rounded-full text-blue-500">
                                                        <Upload size={24} />
                                                    </div>
                                                    <p className="font-medium text-dark">{file ? file.name : 'Click to Upload or Drag & Drop'}</p>
                                                    <p className="text-sm text-secondary">PDF, PNG, JPG (Max 5MB)</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button 
                                                    type="submit" 
                                                    disabled={!file || uploading}
                                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {uploading ? 'Uploading...' : 'Upload Report'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'view_history' && (
                                    <div className="p-0">
                                        {patientHistory.length === 0 ? (
                                            <div className="p-8 text-center text-secondary">No medical history available.</div>
                                        ) : (
                                            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
                                                {patientHistory.map((rec) => (
                                                    <div key={rec._id} className="p-6 hover:bg-slate-50 transition">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="font-bold text-dark">{rec.diagnosis}</h4>
                                                                <p className="text-sm text-secondary">Dr. {rec.doctorName} • {rec.hospital}</p>
                                                            </div>
                                                            <div className="text-xs bg-slate-100 px-2 py-1 rounded text-secondary">
                                                                {new Date(rec.visitDate).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        {rec.medicines && rec.medicines.length > 0 && (
                                                            <div className="mt-2 space-y-1">
                                                                {rec.medicines.map((med, i) => (
                                                                    <div key={i} className="text-sm text-slate-600 flex gap-2">
                                                                        <span className="font-medium text-dark">• {med.name}</span>
                                                                        <span className="text-slate-400">({med.dosage}, {med.frequency})</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {rec.notes && <p className="text-sm text-slate-500 mt-2 italic">Note: {rec.notes}</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'view_reports' && (
                                    <div className="p-0">
                                        {patientReports.length === 0 ? (
                                            <div className="p-8 text-center text-secondary">No reports uploaded.</div>
                                        ) : (
                                            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
                                                {patientReports.map((rep) => (
                                                    <div key={rep._id} className="p-6 hover:bg-slate-50 transition flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="bg-blue-50 p-2 rounded text-blue-600">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-dark text-sm">{rep.fileName}</h4>
                                                                <p className="text-xs text-secondary mt-0.5">
                                                                    {rep.reportType} • {new Date(rep.uploadDate).toLocaleDateString()}
                                                                </p>
                                                                <p className="text-xs text-slate-400">Dr. {rep.doctorName}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => downloadReport(rep.filePath)}
                                                            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default DoctorDashboard;
