import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const DemoRequestModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        professional_email: '',
        clinic_name: '',
        phone_number: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const response = await axios.post('http://localhost:5001/api/demo-request', formData);

            if (response.data.success) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setFormData({
                        full_name: '',
                        professional_email: '',
                        clinic_name: '',
                        phone_number: '',
                        message: ''
                    });
                }, 2000);
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.response?.data?.error || 'Failed to submit request. Please try again.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="glass-card p-8 max-w-lg w-full relative shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Request Submitted!</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                We'll contact you within 24 hours to schedule your demo.
                            </p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Request a Free Demo</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                See VoxAI in action. We'll schedule a personalized demo for your clinic.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="Dr. John Smith"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Professional Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="professional_email"
                                        value={formData.professional_email}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="doctor@clinic.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Clinic Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="clinic_name"
                                        value={formData.clinic_name}
                                        onChange={handleChange}
                                        required
                                        className="input-field"
                                        placeholder="Apollo Hospital"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Phone Number (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Message (Optional)
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="input-field h-24 resize-none"
                                        placeholder="Tell us about your clinic's needs..."
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        {errorMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="btn-primary w-full flex items-center justify-center gap-2"
                                >
                                    {status === 'loading' ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Request Demo
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DemoRequestModal;
