import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User, Lock, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';

const RegisterPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // URL Params
    const email = searchParams.get('email') || '';
    const clinicId = searchParams.get('clinic') || '';
    const inviteToken = searchParams.get('invite') || '';
    const role = searchParams.get('role') || 'doctor';

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!email || !inviteToken) {
            // If direct access without invite, redirect to home
            // navigate('/');
        }
    }, [email, inviteToken, navigate]);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5001/api/auth/complete-registration', {
                email,
                clinic_id: clinicId,
                full_name: formData.fullName,
                password: formData.password,
                role: role
            });

            // Save Session locally
            const user = response.data.user;
            localStorage.setItem('voxai-session', JSON.stringify({
                id: user.id,
                email: email,
                clinicId: clinicId,
                fullName: formData.fullName,
                photoUrl: '', // New account, no photo yet
                role: role
            }));

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card p-12 max-w-md"
                >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-400 w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Account Verified!</h2>
                    <p className="text-slate-400 mb-8">Welcome to VoxAI. Redirecting you to your medical dashboard...</p>
                    <Loader2 className="animate-spin text-emerald-400 mx-auto" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_50%)]" />

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-xl w-full relative z-10"
            >
                {/* Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Shield className="text-sky-400 w-8 h-8" />
                        <span className="text-2xl font-bold tracking-tight">VoxAI</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Complete Your Onboarding</h1>
                    <p className="text-slate-500 italic">Secure medical access setup for {email}</p>
                </div>

                <div className="glass-card p-10">
                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Full Professional Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    required
                                    type="text"
                                    placeholder="Dr. John Doe"
                                    className="input-field pl-11"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Clinic ID (Read Only) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Identity</label>
                                <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-600 font-mono">
                                    {email.split('@')[0]}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Clinic Reference</label>
                                <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-[10px] text-slate-600 font-mono truncate">
                                    {clinicId}
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Set Access Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field pl-11"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    required
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field pl-11"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 group"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    Claim Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-[11px] text-slate-600 text-center leading-relaxed">
                        By completing this registration, you agree to VoxAI's medical security protocols and
                        HIPAA compliance standards for data handling and patient privacy.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
