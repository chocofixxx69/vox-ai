import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, Zap, Users, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const PartnersPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-8 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900 dark:text-white">
                            Our Partner
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                            VoxAI is proudly powered by AutomaticXAI
                        </p>
                    </div>

                    {/* AutomaticXAI Section */}
                    <div className="glass-card p-12 mb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center">
                                <Zap className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AutomaticXAI</h2>
                                <a
                                    href="https://automaticxai.online"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-2"
                                >
                                    automaticxai.online
                                    <Globe className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                            <p className="text-lg">
                                <strong className="text-slate-900 dark:text-white">AutomaticXAI</strong> is a cutting-edge AI solutions provider specializing in building intelligent, automated systems for businesses across various industries.
                            </p>

                            <p>
                                With a focus on practical AI applications, AutomaticXAI develops custom AI-powered tools that solve real-world problems. From healthcare to finance, their solutions are designed to automate complex workflows, extract insights from data, and enhance decision-making processes.
                            </p>

                            <p>
                                VoxAI is one of AutomaticXAI's flagship products, demonstrating their expertise in natural language processing, medical AI, and enterprise SaaS development.
                            </p>
                        </div>
                    </div>

                    {/* What They Do */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            {
                                icon: <Zap className="w-6 h-6" />,
                                title: "AI Automation",
                                desc: "Building intelligent systems that automate repetitive tasks and complex workflows"
                            },
                            {
                                icon: <Users className="w-6 h-6" />,
                                title: "Custom Solutions",
                                desc: "Tailored AI products designed specifically for your business needs"
                            },
                            {
                                icon: <Target className="w-6 h-6" />,
                                title: "Industry Expertise",
                                desc: "Deep knowledge in healthcare, finance, and enterprise applications"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-6"
                            >
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="glass-card p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Interested in Working Together?</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            AutomaticXAI is available for custom AI development projects and consulting.
                        </p>
                        <a
                            href="mailto:ainan@automaticxai.online"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            Contact AutomaticXAI
                        </a>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default PartnersPage;
