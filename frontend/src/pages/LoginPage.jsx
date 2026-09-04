import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User, Lock, ArrowRight, Loader2, Mail } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', {
                email: formData.email,
                password: formData.password
            });

            if (response.data.success) {
                const user = response.data.user;
                // Save Session
                localStorage.setItem('voxai-session', JSON.stringify({
                    id: user.id,
                    email: user.email,
                    clinicId: user.clinic_id,
                    fullName: user.full_name,
                    photoUrl: user.photo_url || '',
                    role: user.role || 'doctor'
                }));

                // Redirect based on role
                if (response.data.user.role === 'admin') {
                    // navigate('/admin'); 
                    navigate('/dashboard'); // Common dashboard for now
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.05),transparent_50%)]" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Shield className="text-sky-500 dark:text-sky-400 w-10 h-10" />
                        <span className="text-3xl font-bold tracking-tight">Vox<span className="text-sky-500 dark:text-sky-400">AI</span></span>
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Medical Portal Access</h1>
                    <p className="text-slate-500 text-sm">Sign in to your professional medical workspace</p>
                </div>

                <div className="glass-card p-8 shadow-2xl border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Professional Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    required
                                    type="email"
                                    placeholder="doctor@hospital.com"
                                    className="input-field pl-10 h-12 text-sm bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase block tracking-widest">Security Password</label>
                                <a href="#" className="text-[10px] text-sky-500 hover:text-sky-400 font-bold uppercase tracking-wider">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field pl-10 h-12 text-sm bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="btn-primary w-full h-12 text-sm font-bold flex items-center justify-center gap-2 group shadow-lg shadow-sky-500/20"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    Enter Workspace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-xs text-slate-500 font-medium">
                            New to VoxAI? <span className="text-slate-400 italic">Contact your Clinic Admin</span>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium opacity-50">
                    Trusted by 500+ Medical Institutions • HIPAA Compliant
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
