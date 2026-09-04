import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
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
                            <FileText className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
                            <p className="text-slate-600 dark:text-slate-400">Last updated: February 2026</p>
                        </div>
                    </div>

                    <div className="glass-card p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Acceptance of Terms</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                By accessing and using VoxAI, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Service Description</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                VoxAI provides AI-powered medical transcription and data extraction services for healthcare professionals. The service includes audio transcription, medical data extraction, and PDF report generation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">User Responsibilities</h2>
                            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Maintain the confidentiality of your account credentials</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Ensure all uploaded content complies with applicable laws and regulations</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Review and verify all AI-generated reports before use</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Obtain proper patient consent for recording consultations</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Limitations of Liability</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                VoxAI is a tool to assist healthcare professionals. Final medical decisions and report accuracy remain the responsibility of the healthcare provider. We are not liable for any medical decisions made based on our service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Termination</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                We reserve the right to terminate or suspend access to our service for violations of these terms or for any other reason at our discretion.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Contact</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                For questions about these Terms of Service, contact us at{' '}
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

export default TermsPage;
