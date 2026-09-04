import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Mail, Shield, User, Trash2, CheckCircle, Clock, Loader2, History as HistoryIcon, X, Calendar, FileText } from 'lucide-react';
import axios from 'axios';

const TeamManagement = ({ clinicId = '00000000-0000-0000-0000-000000000000' }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);

    // History Modal State
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctorHistory, setDoctorHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        fetchStaff();
    }, [clinicId]);

    const fetchStaff = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/clinic/staff?clinic_id=${clinicId}`);
            setDoctors(response.data);
        } catch (err) {
            console.error("Failed to fetch staff", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDoctorHistory = async (doctor) => {
        setSelectedDoctor(doctor);
        setHistoryLoading(true);
        setDoctorHistory([]);
        try {
            const response = await axios.get(`http://localhost:5001/api/doctor/history/${doctor.id}`);
            setDoctorHistory(response.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setInviting(true);
        setGeneratedLink('');
        try {
            const response = await axios.post('http://localhost:5001/api/clinic/invite-doctor', {
                clinic_id: clinicId,
                email: inviteEmail
            });
            setGeneratedLink(response.data.invite_link);
            setInviteEmail('');
            fetchStaff(); // Refresh list
        } catch (err) {
            console.error("Invitation failed", err);
            alert("Failed to send invitation.");
        } finally {
            setInviting(false);
        }
    };

    const handleRemoveStaff = async (staffId) => {
        if (!window.confirm("Are you sure you want to remove this staff member? This will delete their profile permanently.")) return;

        try {
            await axios.delete(`http://localhost:5001/api/clinic/staff/${staffId}`);
            fetchStaff(); // Refresh list
        } catch (err) {
            console.error("Failed to remove staff", err);
            alert("Failed to remove staff member.");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 relative">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Team Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your clinic's doctors and staff permissions</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-xl text-primary-600 dark:text-primary-400 text-sm font-bold">
                        {doctors.filter(d => d.role === 'doctor').length} Active Doctors
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 📨 Invite Form */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        <div className="flex items-center gap-3 mb-6 font-bold text-lg">
                            <UserPlus className="text-primary-600 dark:text-primary-400 w-5 h-5" />
                            Invite New Doctor
                        </div>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Doctor's Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                    <input
                                        type="email"
                                        placeholder="doctor@clinic.com"
                                        className="input-field pl-10"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={inviting}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                {inviting ? <Loader2 className="animate-spin w-4 h-4" /> : "Generate Invite Link"}
                            </button>
                        </form>

                        {generatedLink && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mt-6 p-4 bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 rounded-xl"
                            >
                                <label className="block text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase mb-2 tracking-widest">Registration Link Created</label>
                                <div className="flex gap-2">
                                    <input
                                        readOnly
                                        value={generatedLink}
                                        className="w-full text-[10px] bg-white dark:bg-slate-950 border border-sky-200 dark:border-sky-900 px-3 py-2 rounded-lg text-slate-500 truncate"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="px-3 py-2 bg-sky-500 text-white rounded-lg text-xs font-bold hover:bg-sky-600 transition-colors flex-shrink-0"
                                    >
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* 📋 Staff List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600 w-10 h-10" /></div>
                    ) : doctors.length === 0 ? (
                        <div className="glass-card p-12 text-center text-slate-500">No staff members found.</div>
                    ) : (
                        doctors.map((doc) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`glass-card p-5 flex items-center justify-between group transition-all ${selectedDoctor?.id === doc.id ? 'ring-2 ring-primary-500' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                                        {doc.photo_url ? (
                                            <img src={doc.photo_url} className="w-full h-full object-cover" alt="Profile" />
                                        ) : (
                                            <User className="text-slate-500 w-6 h-6" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white capitalize">{doc.full_name || doc.email?.split('@')[0] || 'New Doctor'}</h3>
                                        <p className="text-xs text-slate-500">{doc.email || 'No email provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${doc.role === 'admin'
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                            }`}>
                                            {doc.role === 'admin' ? <Shield className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                            {doc.role}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => fetchDoctorHistory(doc)}
                                            className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-500/10 transition-all border border-transparent hover:border-primary-500/30"
                                            title="View History"
                                        >
                                            <HistoryIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleRemoveStaff(doc.id)}
                                            className="p-3 bg-red-500/5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* 🕰️ Doctor History Sidebar/Overlay */}
            <AnimatePresence>
                {selectedDoctor && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoctor(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white dark:bg-slate-900 z-[101] shadow-2xl border-l border-slate-200 dark:border-slate-800 p-8 overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl text-primary-600">
                                        <HistoryIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Consultation History</h3>
                                        <p className="text-sm text-slate-500">Dr. {selectedDoctor.full_name || selectedDoctor.email?.split('@')[0]}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedDoctor(null)}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {historyLoading ? (
                                    <div className="py-20 flex flex-col items-center gap-4">
                                        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                                        <p className="text-sm text-slate-500">Decrypting medical history...</p>
                                    </div>
                                ) : doctorHistory.length > 0 ? (
                                    doctorHistory.map((record) => (
                                        <div key={record.id} className="p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                                                    <Calendar className="w-3 h-3 text-sky-500" />
                                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{record.date}</span>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${record.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {record.status}
                                                </span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{record.patient_name}</h4>
                                            <p className="text-xs text-slate-500 mt-1 italic leading-relaxed">{record.diagnosis}</p>

                                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                                <span className="text-[10px] text-slate-400 font-medium">Ref: {record.id.slice(0, 8)}</span>
                                                {record.pdf_url && (
                                                    <a
                                                        href={record.pdf_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-2 text-sky-600 hover:text-sky-500 text-xs font-bold transition-colors"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                        View Report
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 flex flex-col items-center gap-4 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                                        <Clock className="w-12 h-12 text-slate-200" />
                                        <p className="text-slate-400 font-bold">No Records Found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeamManagement;
