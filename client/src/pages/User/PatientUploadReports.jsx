import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, X, Check, ArrowLeft, Activity } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PatientUploadReports = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (fileList) => {
        const newFiles = Array.from(fileList).filter(file => file.type.startsWith('image/') || file.type === 'application/pdf');
        setFiles(prev => [...prev, ...newFiles]);
        if (newFiles.length === 0) toast.error("Only PDF and Images allowed");
    };

    const removeFile = (idx) => {
        setFiles(files.filter((_, i) => i !== idx));
    };

    const handleUpload = () => {
        // Needs backend endpoint for generic file upload linked to patient record
        toast.success("Reports Uploaded! Pending Doctor Review.");
        setFiles([]);
        setTimeout(() => navigate('/user-dashboard'), 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
             {/* Sidebar */}
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
                    <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold">
                        Report Upload
                    </div>
                </div>
            </aside>

            <main className="flex-1 md:ml-64 bg-slate-50 p-8">
                <Toaster position="top-right" />
                
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-dark flex items-center gap-2">
                        <Upload className="text-blue-600" /> Upload Reports
                    </h1>
                    <p className="text-secondary">Attach lab results, past prescriptions, or discharge summaries.</p>
                </header>

                <div className="max-w-3xl bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                    <div 
                        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-primary/50'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                         <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-dark">Drag & Drop your files here</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
                        
                        <input 
                            id="file-upload" 
                            type="file" 
                            multiple 
                            className="hidden" 
                            onChange={handleChange}
                            accept="image/*,.pdf" 
                        />
                        <label 
                            htmlFor="file-upload"
                            className="inline-block px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-dark cursor-pointer hover:bg-slate-50 shadow-sm transition"
                        >
                            Browse Files
                        </label>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-8 space-y-3">
                            <h4 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-2">Selected Files</h4>
                            {files.map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <FileText size={20} className="text-blue-500" />
                                        <div>
                                            <p className="text-sm font-bold text-dark truncate max-w-xs">{file.name}</p>
                                            <p className="text-xs text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500">
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}

                            <div className="pt-4 flex justify-end">
                                <button 
                                    onClick={handleUpload}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
                                >
                                    <Check size={18} /> Confirm Upload
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PatientUploadReports;
