import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Shield, Eye, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

const SecurityPage = () => {
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
                            <Lock className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Security</h1>
                            <p className="text-slate-600 dark:text-slate-400">Enterprise-grade security for your medical data</p>
                        </div>
                    </div>

                    <div className="glass-card p-8 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Security Overview</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                At VoxAI, security is not an afterthought—it's built into every layer of our infrastructure. We employ bank-level encryption and industry best practices to protect your sensitive medical data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Security Measures</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: <Lock />, title: "AES-256 Encryption", desc: "Military-grade encryption for all data at rest and in transit" },
                                    { icon: <Shield />, title: "Multi-Factor Authentication", desc: "Additional layer of security for user accounts" },
                                    { icon: <Eye />, title: "Audit Logging", desc: "Complete tracking of all data access and modifications" },
                                    { icon: <Server />, title: "Secure Infrastructure", desc: "HIPAA-compliant cloud hosting with redundancy" }
                                ].map((item, i) => (
                                    <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                                            {item.icon}
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Data Protection</h2>
                            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span><strong>Encryption:</strong> All data encrypted with AES-256 both at rest and in transit</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span><strong>Access Control:</strong> Role-based permissions ensure users only see their clinic's data</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span><strong>Data Isolation:</strong> Multi-tenant architecture with complete data separation</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">•</span>
                                    <span><strong>Backup & Recovery:</strong> Automated daily backups with disaster recovery procedures</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Compliance & Certifications</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                VoxAI complies with:
                            </p>
                            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">✓</span>
                                    <span>HIPAA (Health Insurance Portability and Accountability Act)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">✓</span>
                                    <span>GDPR (General Data Protection Regulation)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="text-primary-600 dark:text-primary-400">✓</span>
                                    <span>SOC 2 Type II compliance (in progress)</span>
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Report a Security Issue</h2>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                If you discover a security vulnerability, please report it immediately to{' '}
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

export default SecurityPage;
