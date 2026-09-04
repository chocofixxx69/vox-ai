import React, { useState, useRef, useEffect } from 'react';
import { Camera, User, Mail, Shield, Save, Loader2, CheckCircle, Clock, FileText, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileSettings = ({ session, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [fullName, setFullName] = useState(session?.fullName || '');
    const [photoUrl, setPhotoUrl] = useState(session?.photoUrl || '');
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (session) {
            setFullName(session.fullName || session.full_name || '');
            setPhotoUrl(session.photoUrl || session.photo_url || '');
            if (session.id) {
                fetchPersonalHistory();
            }
        }
    }, [session]);

    const fetchPersonalHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:5001/api/doctor/history/${session.id}`);
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!session?.id) {
            alert("Session error: User ID not found. Please log out and log in again.");
            setUploading(false);
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('staff_id', session.id);

        try {
            const response = await axios.post('http://localhost:5001/api/profile/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setPhotoUrl(response.data.photo_url);
            onUpdate({ ...session, photoUrl: response.data.photo_url });
        } catch (err) {
            console.error("Upload failed", err);
            const errorMsg = err.response?.data?.details || err.response?.data?.error || "Failed to upload photo.";
            alert(`Upload failed: ${errorMsg}\n\nHint: Verify storage policies.`);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        if (!session?.id) {
            alert("Session error: User ID not found.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/profile/update', {
                id: session.id,
                full_name: fullName
            });
            setSuccess(true);
            onUpdate({ ...session, fullName: response.data.full_name });
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Update failed", err);
            const errorMsg = err.response?.data?.details || err.response?.data?.error || "Failed to update profile.";
            alert(`Update failed: ${errorMsg}\n\nHint: Check database policies.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="h-40 bg-gradient-to-r from-sky-500 to-indigo-600 relative">
                    <div className="absolute -bottom-12 left-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-xl overflow-hidden flex items-center justify-center">
                                {photoUrl ? (
                                    <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-slate-300" />
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 hover:scale-110 transition-all z-10"
                            >
                                <Camera className="w-5 h-5 text-sky-600" />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-20 p-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight">{fullName}</h2>
                        <p className="text-slate-500 capitalize flex items-center gap-2 mt-1 font-medium">
                            <Shield className="w-4 h-4 text-sky-500" /> {session?.role} • Medical Professional Cluster
                        </p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name & Salutation</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-sky-500" />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="input-field pl-12 h-14 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20"
                                        placeholder="e.g. Dr. Jane Smith"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Login Identity (Locked)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={session?.email || ''}
                                        disabled
                                        className="input-field pl-12 h-14 bg-slate-50 dark:bg-slate-950/50 cursor-not-allowed text-slate-400 border-dashed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center gap-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary min-w-[200px] h-14 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-sky-500/20 active:scale-95 transition-all text-sm font-bold"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {success ? "Changes Saved!" : "Save Profile Updates"}
                            </button>
                            <AnimatePresence>
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-emerald-500 flex items-center gap-2 text-sm font-bold bg-emerald-500/10 px-4 py-2 rounded-xl"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Cloud Synchronized
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </form>
                </div>
            </div>

            {/* 🕰️ Personal History Section */}
            <div className="max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold">Personal Workspace History</h3>
                        <p className="text-sm text-slate-500">Your recent consultations and medical transcripts</p>
                    </div>
                    <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-500">
                        {history.length} Total Records
                    </div>
                </div>

                <div className="space-y-4">
                    {historyLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                            <p className="text-sm text-slate-500 font-medium">Decrypting records...</p>
                        </div>
                    ) : history.length > 0 ? (
                        history.map((record) => (
                            <div key={record.id} className="p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 transition-all group flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                                        <Clock className="w-6 h-6 text-sky-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">{record.date} • {record.time}</p>
                                        <h4 className="font-bold text-slate-900 dark:text-slate-100">{record.patient_name}</h4>
                                        <p className="text-xs text-slate-500 italic mt-0.5">{record.diagnosis}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {record.pdf_url && (
                                        <a
                                            href={record.pdf_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sky-600 hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <FileText className="w-5 h-5" />
                                        </a>
                                    )}
                                    <button className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-sky-500 group-hover:border-sky-500/50 transition-all shadow-sm">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-950/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                                <User className="w-8 h-8 text-slate-300" />
                            </div>
                            <h4 className="font-bold text-slate-400">No Patient Records Yet</h4>
                            <p className="text-xs text-slate-500 mt-1">Your personal history will appear as you complete consultations.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-4xl p-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-3xl">
                <div className="flex gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0">
                        <Shield className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-amber-800 dark:text-amber-400 mb-2">Workspace Governance & Security</h4>
                        <p className="text-sm text-amber-700 dark:text-amber-500/70 leading-relaxed font-medium">
                            Profile updates are monitored for regulatory compliance. To reset your security credentials or update your professional cluster assignment, please contact your Clinic Administrator. Your session is protected by end-to-end medical encryption.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
