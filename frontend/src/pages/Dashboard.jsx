import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Search, History, Settings, LogOut, User, Activity, FileText, Phone, ArrowRight, X, Loader2, Building2 } from 'lucide-react';
import logoDark from '../assets/logo-dark.png';
import logoWhite from '../assets/logo-white.png';
import axios from 'axios';
import ConsultationWizard from '../components/ConsultationWizard';
import UploadWizard from '../components/UploadWizard';
import ThemeToggle from '../components/ThemeToggle';
import TeamManagement from '../components/TeamManagement';
import BrandingSettings from '../components/BrandingSettings';
import ProfileSettings from '../components/ProfileSettings';

const Dashboard = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [patientHistory, setPatientHistory] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('new-consultation');
    const [showWizard, setShowWizard] = useState(false);
    const [showUploadWizard, setShowUploadWizard] = useState(false);
    const [selectedConsultation, setSelectedConsultation] = useState(null); // For history detail view

    // Profile & Session State
    const [session, setSession] = useState(null);
    const [clinicName, setClinicName] = useState('Loading Clinic...');
    const [dailyStats, setDailyStats] = useState({ today_count: 0 });
    const [clinicHistory, setClinicHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    React.useEffect(() => {
        const savedSession = localStorage.getItem('voxai-session');
        if (savedSession) {
            const parsed = JSON.parse(savedSession);
            setSession(parsed);
            fetchClinicInfo(parsed.clinicId);
            fetchDailyStats(parsed.clinicId);
            fetchClinicHistory(parsed.clinicId);
        } else {
            // Demo Fallback (Standard Doctor View for Initial Load)
            const demoSession = {
                id: '00000000-0000-0000-0000-000000000000',
                fullName: 'Dr. Arjun K.',
                role: 'doctor',
                clinicId: '00000000-0000-0000-0000-000000000000',
                photoUrl: ''
            };
            setSession(demoSession);
            setClinicName('VoxAI • Demo Foundation');
            fetchDailyStats(demoSession.clinicId);
        }
    }, []);

    const fetchClinicHistory = async (id) => {
        setHistoryLoading(true);
        try {
            const res = await axios.get(`http://localhost:5001/api/clinic/history?clinic_id=${id}`);
            setClinicHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch clinic history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const fetchDailyStats = async (id) => {
        try {
            const res = await axios.get(`http://localhost:5001/api/clinic/daily-stats?clinic_id=${id}`);
            setDailyStats(res.data);
        } catch (err) {
            console.error("Failed to fetch daily stats", err);
        }
    };

    const handleProfileUpdate = (updatedSession) => {
        setSession(updatedSession);
        localStorage.setItem('voxai-session', JSON.stringify(updatedSession));
    };

    const fetchClinicInfo = async (id) => {
        try {
            // We can use the existing clinics list or a specific endpoint
            const res = await axios.get('http://localhost:5001/api/admin/clinics');
            const myClinic = res.data.find(c => c.id === id);
            if (myClinic) {
                setClinicName(myClinic.name + ' • ' + (myClinic.location || 'Main Center'));
            }
        } catch (err) {
            console.error("Failed to fetch clinic info", err);
        }
    };

    const handleSearch = async () => {
        if (!phoneNumber) return;
        setSearchLoading(true); // Set loading state
        try {
            const response = await axios.get(`http://localhost:5001/api/patient-history/${phoneNumber}`); // Axios call
            if (response.data.patient) {
                setPatientHistory({
                    name: response.data.patient.name,
                    age: response.data.patient.age,
                    history: response.data.history.map(item => ({
                        id: item.id,
                        date: new Date(item.date).toLocaleDateString(),
                        time: new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        doctor: item.doctor,
                        diagnosis: item.medical_data?.diagnoses?.join(', ') || 'General Consultation',
                        medical_data: item.medical_data,
                        pdf_url: item.pdf_url,
                        status: item.status
                    }))
                });
            } else {
                setPatientHistory(null);
                alert("No records found for this phone number.");
            }
        } catch (err) {
            console.error("Search failed", err);
            alert("Error searching database.");
        } finally {
            setSearchLoading(false); // Reset loading state
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
            {/* 🏰 Sidebar Navigation */}
            <aside className="w-64 border-r border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-100 dark:bg-slate-900/50 backdrop-blur-md flex flex-col p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-10 overflow-hidden">
                    <img src={logoDark} alt="VoxAI Logo" className="h-10 w-auto object-contain block dark:hidden" />
                    <img src={logoWhite} alt="VoxAI Logo" className="h-10 w-auto object-contain hidden dark:block" />
                </div>

                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => { setActiveTab('new-consultation'); setShowWizard(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'new-consultation' && !showWizard ? 'bg-sky-500/10 text-primary-600 dark:text-primary-400 border border-sky-500/20' : 'text-slate-700 dark:text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-900'}`}
                    >
                        <Mic className="w-5 h-5" />
                        New Consultation
                    </button>
                    <button
                        onClick={() => { setActiveTab('history'); setShowWizard(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-sky-500/10 text-primary-600 dark:text-primary-400 border border-sky-500/20' : 'text-slate-700 dark:text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-900'}`}
                    >
                        <History className="w-5 h-5" />
                        Patient Records
                    </button>
                    {session?.role === 'admin' && (
                        <button
                            onClick={() => { setActiveTab('team'); setShowWizard(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'team' ? 'bg-sky-500/10 text-primary-600 dark:text-primary-400 border border-sky-500/20' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-900'}`}
                        >
                            <User className="w-5 h-5" />
                            Team Management
                        </button>
                    )}
                    {session?.role === 'admin' && (
                        <button
                            onClick={() => { setActiveTab('branding'); setShowWizard(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'branding' ? 'bg-sky-500/10 text-primary-600 dark:text-primary-400 border border-sky-500/20' : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-900'}`}
                        >
                            <Building2 className="w-5 h-5" />
                            Clinic Templates
                        </button>
                    )}
                </nav>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-900 space-y-4">
                    <div className="px-4">
                        <ThemeToggle className="w-full justify-start" />
                    </div>
                    <button
                        onClick={() => { setActiveTab('profile'); setShowWizard(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-sky-500/10 text-primary-600 dark:text-primary-400 border border-sky-500/20' : 'text-slate-700 dark:text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-slate-900'}`}
                    >
                        <Settings className="w-5 h-5" />
                        My Profile
                    </button>
                    <button
                        onClick={() => { localStorage.removeItem('voxai-session'); window.location.href = '/'; }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* 🚀 Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
                            {session?.photoUrl ? (
                                <img src={session.photoUrl} className="w-full h-full object-cover rounded-xl" alt="Profile" />
                            ) : (
                                <div className="w-full h-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center rounded-xl">
                                    <User className="text-slate-300 w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Welcome, <span className="text-sky-600 dark:text-sky-400">{session?.fullName || 'Dr. Sarah Jenkins'}</span></h1>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">{clinicName}</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="px-4 py-2.5 glass-card flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Activity className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today's Load</p>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                    {dailyStats.today_count} {dailyStats.today_count === 1 ? 'Patient' : 'Patients'}
                                </p>
                            </div>
                        </div>
                        <div className="px-4 py-2.5 glass-card flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Live AI Ready</span>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {showWizard ? (
                        <motion.div
                            key="wizard"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Consultation Session</span>
                                <button
                                    onClick={() => setShowWizard(false)}
                                    className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                                >
                                    <X className="w-3.5 h-3.5" /> Cancel Consultation
                                </button>
                            </div>
                            <ConsultationWizard onComplete={() => setShowWizard(false)} />
                        </motion.div>
                    ) : showUploadWizard ? (
                        <motion.div
                            key="upload-wizard"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-center pb-2">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audio & Transcript Pipeline</span>
                                <button
                                    onClick={() => setShowUploadWizard(false)}
                                    className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                                >
                                    <X className="w-3.5 h-3.5" /> Cancel Upload
                                </button>
                            </div>
                            <UploadWizard onComplete={() => setShowUploadWizard(false)} />
                        </motion.div>
                    ) : activeTab === 'new-consultation' ? (
                        <motion.div
                            key="new"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* 🔍 Patient History Recon Panel */}
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Phone className="text-primary-600 dark:text-primary-400 w-6 h-6" />
                                    <h2 className="text-xl font-bold">Patient History Recognition</h2>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 dark:text-slate-600 dark:text-slate-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Enter Patient Phone Number (e.g. +91 9876543210)"
                                            className="input-field pl-12"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        onClick={handleSearch}
                                        disabled={searchLoading}
                                        className="btn-primary min-w-[150px] flex items-center justify-center gap-2"
                                    >
                                        {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search Records"}
                                    </button>
                                </div>

                                {patientHistory && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-8 pt-8 border-t border-slate-300 dark:border-slate-800"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-lg font-bold">{patientHistory.name}</h3>
                                                <p className="text-sm text-slate-700 dark:text-slate-600 dark:text-slate-400">{patientHistory.age} years old • {phoneNumber}</p>
                                            </div>
                                            <button className="text-primary-600 dark:text-primary-400 text-sm font-bold flex items-center gap-1 hover:underline">
                                                View Full Medical File <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {patientHistory.history.map((record, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => setSelectedConsultation(record)}
                                                    className="p-4 bg-white dark:bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-300 dark:border-slate-800 flex items-center justify-between group cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 transition-all"
                                                >
                                                    <div>
                                                        <p className="text-xs text-slate-700 dark:text-slate-600 dark:text-slate-500 font-mono">{record.date} • {record.time}</p>
                                                        <p className="font-bold text-slate-900 dark:text-slate-200">{record.diagnosis}</p>
                                                        <p className="text-[10px] text-slate-500 italic">Dr. {record.doctor}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {record.pdf_url && <FileText className="text-primary-600 w-4 h-4" />}
                                                        <ArrowRight className="text-slate-300 group-hover:text-primary-600 w-5 h-5 transition-colors" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* 🎤 Start Consultation Trigger */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div
                                    onClick={() => setShowWizard(true)}
                                    className="glass-card p-8 bg-white dark:bg-slate-900 hover:scale-[1.02] transition-transform cursor-pointer group shadow-xl"
                                >
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                                        <Mic className="text-slate-900 dark:text-white w-8 h-8 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Start Smart Recording</h3>
                                    <p className="text-slate-900 dark:text-white/80">Record consultation and let AI generate the report in real-time.</p>
                                </div>

                                <div
                                    onClick={() => setShowUploadWizard(true)}
                                    className="glass-card p-8 hover:bg-slate-100 dark:bg-slate-900 hover:scale-[1.02] transition-all cursor-pointer border-slate-300 dark:border-slate-700/50 group shadow-sm">
                                    <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-6 border border-slate-300 dark:border-slate-800 group-hover:border-slate-400 dark:group-hover:border-slate-600 transition-colors">
                                        <FileText className="text-primary-600 dark:text-primary-400 w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Upload Audio/Transcript</h3>
                                    <p className="text-slate-700 dark:text-slate-600 dark:text-slate-400">Import existing medical recordings for rapid processing.</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : activeTab === 'team' ? (
                        <motion.div
                            key="team"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <TeamManagement />
                        </motion.div>
                    ) : activeTab === 'branding' ? (
                        <motion.div
                            key="branding"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <BrandingSettings clinicId={session?.clinicId || '00000000-0000-0000-0000-000000000000'} />
                        </motion.div>
                    ) : activeTab === 'profile' ? (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <ProfileSettings session={session} onUpdate={handleProfileUpdate} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold">Clinic Patient Records</h2>
                                    <p className="text-sm text-slate-500 font-medium">Global history of all consultations for {clinicName.split('•')[0]}</p>
                                </div>
                                <button
                                    onClick={() => fetchClinicHistory(session.clinicId)}
                                    className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-sky-500/10 transition-colors"
                                >
                                    <History className="w-5 h-5 text-sky-500" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {historyLoading ? (
                                    <div className="py-20 flex flex-col items-center gap-4">
                                        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                                        <p className="text-sm text-slate-500">Retrieving medical archives...</p>
                                    </div>
                                ) : clinicHistory.length > 0 ? (
                                    clinicHistory.map((record) => (
                                        <div
                                            key={record.id}
                                            onClick={() => setSelectedConsultation(record)}
                                            className="flex items-center justify-between p-5 hover:bg-white dark:hover:bg-slate-900 rounded-2xl transition-all border border-slate-200 dark:border-slate-800 hover:border-sky-500/30 group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm">
                                                    <Activity className={`w-6 h-6 ${record.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{record.date} • {record.time}</p>
                                                    <p className="font-bold text-lg text-slate-900 dark:text-slate-100">{record.patient_name}</p>
                                                    <p className="text-xs text-slate-500 font-medium">Attended by <strong>Dr. {record.doctor_name}</strong></p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Status</p>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${record.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                        {record.status}
                                                    </span>
                                                </div>
                                                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 group-hover:bg-sky-500 transition-colors group-hover:text-white">
                                                    <ArrowRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                        <History className="w-12 h-12 text-slate-200" />
                                        <p className="text-slate-400 font-bold">No Records Found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 📄 Consultation Detail Modal */}
                <AnimatePresence>
                    {selectedConsultation && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedConsultation(null)}
                                className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                            >
                                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                                    <div>
                                        <h2 className="text-xl font-bold">Consultation Brief</h2>
                                        <p className="text-sm text-slate-500">{selectedConsultation.date} • Dr. {selectedConsultation.doctor}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        {selectedConsultation.pdf_url && (
                                            <a
                                                href={selectedConsultation.pdf_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn-primary py-2 px-4 text-sm flex items-center gap-2"
                                            >
                                                <FileText className="w-4 h-4" /> View PDF
                                            </a>
                                        )}
                                        <button
                                            onClick={() => setSelectedConsultation(null)}
                                            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-8 overflow-y-auto space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <section>
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-primary-600 mb-4">Diagnosis & Symptoms</h3>
                                            <div className="space-y-4">
                                                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Diagnoses</p>
                                                    <p>{selectedConsultation.medical_data?.diagnoses?.join(', ') || 'None recorded'}</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                                                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Symptoms</p>
                                                    <p>{selectedConsultation.medical_data?.symptoms?.join(', ') || 'None recorded'}</p>
                                                </div>
                                            </div>
                                        </section>
                                        <section>
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-4">Medications</h3>
                                            <div className="space-y-3">
                                                {selectedConsultation.medical_data?.medications?.length > 0 ? (
                                                    selectedConsultation.medical_data.medications.map((med, i) => (
                                                        <div key={i} className="p-4 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                                                            <p className="font-bold text-emerald-700 dark:text-emerald-400">{med.name}</p>
                                                            <p className="text-sm text-emerald-600 dark:text-emerald-500/80">{med.dosage} • {med.frequency} • {med.duration}</p>
                                                            {med.instructions && <p className="text-xs mt-2 italic text-emerald-600/70">Note: {med.instructions}</p>}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-slate-400 italic">No medications prescribed.</p>
                                                )}
                                            </div>
                                        </section>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                                        <section>
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-rose-600 mb-4">Prohibitions (Avoid)</h3>
                                            <ul className="space-y-2">
                                                {selectedConsultation.medical_data?.prohibitions?.map((p, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {p}
                                                    </li>
                                                )) || <li className="text-slate-400 italic">None recorded.</li>}
                                            </ul>
                                        </section>
                                        <section>
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-sky-600 mb-4">Recommendations</h3>
                                            <ul className="space-y-2">
                                                {selectedConsultation.medical_data?.recommendations?.map((r, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sky-700 dark:text-sky-400">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-sky-500" /> {r}
                                                    </li>
                                                )) || <li className="text-slate-400 italic">None recorded.</li>}
                                            </ul>
                                        </section>
                                    </div>
                                </div>
                                <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center">
                                    <p className="text-xs text-slate-500">VoxAI Confidential Summary • Verification Required by Doctor</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Dashboard;
