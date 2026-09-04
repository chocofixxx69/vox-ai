import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <Link to="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-8 py-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
                            <Shield className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
                            <p className="text-slate-600 dark:text-slate-400">Last updated: February 2026</p>
                        </div>
                    </div>

                    <div className="glass-card p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Introduction</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                VoxAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our medical transcription service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Information We Collect</h2>
                            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span><strong>Account Information:</strong> Name, email, clinic details, and professional credentials</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span><strong>Medical Data:</strong> Audio recordings, transcriptions, and extracted medical information</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span><strong>Usage Data:</strong> Log data, device information, and interaction patterns</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">How We Use Your Information</h2>
                            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Provide and maintain our transcription services</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Improve AI model accuracy and performance</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Ensure HIPAA compliance and data security</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Communicate service updates and support</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Data Security</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                We implement industry-standard security measures to protect your data:
                            </p>
                            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-3">
                                    <Lock className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                                    <span><strong>AES-256 Encryption:</strong> All data encrypted at rest and in transit</span>
                                </li>
                                <li className="flex gap-3">
                                    <Eye className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                                    <span><strong>Access Controls:</strong> Role-based permissions and multi-factor authentication</span>
                                </li>
                                <li className="flex gap-3">
                                    <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                                    <span><strong>Audit Logs:</strong> Complete tracking of all data access and modifications</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Your Rights</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                You have the right to access, correct, delete, or export your data at any time. Contact us at{' '}
                                <a href="mailto:ainan@automaticxai.online" className="text-primary-600 dark:text-primary-400 hover:underline">
                                    ainan@automaticxai.online
                                </a>{' '}
                                to exercise these rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Contact Us</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                For privacy-related questions or concerns, please contact us at{' '}
                                <a href="mailto:ainan@automaticxai.online" className="text-primary-600 dark:text-primary-400 hover:underline">
                                    ainan@automaticxai.online
                                </a>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default PrivacyPage;
