import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const HIPAAPage = () => {
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
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">HIPAA Compliance</h1>
                            <p className="text-slate-600 dark:text-slate-400">Health Insurance Portability and Accountability Act</p>
                        </div>
                    </div>

                    <div className="glass-card p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Our Commitment</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                VoxAI is fully HIPAA compliant. We understand the critical importance of protecting patient health information (PHI) and have implemented comprehensive safeguards to ensure compliance with all HIPAA regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">HIPAA Safeguards</h2>
                            <div className="space-y-4">
                                {[
                                    { title: "Administrative Safeguards", desc: "Policies, procedures, and training to manage PHI security" },
                                    { title: "Physical Safeguards", desc: "Secure data centers with restricted access and environmental controls" },
                                    { title: "Technical Safeguards", desc: "Encryption, access controls, and audit logging for all PHI" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <CheckCircle className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Business Associate Agreement (BAA)</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                We sign Business Associate Agreements with all our healthcare clients, ensuring legal compliance and defining our responsibilities in protecting PHI.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Data Handling</h2>
                            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Audio files are processed and deleted within 24 hours</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>All PHI is encrypted with AES-256 encryption</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Access to PHI is logged and monitored</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span>Data is stored in HIPAA-compliant cloud infrastructure</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Questions?</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                For HIPAA compliance questions or to request a BAA, contact us at{' '}
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

export default HIPAAPage;
