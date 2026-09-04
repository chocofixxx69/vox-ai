import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Heart, ClipboardList, Shield, ChevronRight, CheckCircle, TrendingUp, Users, Globe, AlertCircle, Mic, Activity } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import logoDark from '../assets/logo-dark.png';
import logoWhite from '../assets/logo-white.png';
import DemoRequestModal from '../components/DemoRequestModal';
import ThemeToggle from '../components/ThemeToggle';
import { DottedSurface } from '../components/ui/dotted-surface';
import axios from 'axios';
import { Link } from 'react-router-dom';

// 3D Tilt Card wrapper
function TiltCard({ children, className = '' }) {
    const ref = useRef(null);
    const handleMouseMove = useCallback((e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -8;
        const rotateY = ((x - cx) / cx) * 8;
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
        el.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 30px rgba(0,0,0,0.08)`;
    }, []);
    const handleMouseLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        el.style.boxShadow = '';
    }, []);
    return (
        <div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease', willChange: 'transform' }}
        >
            {children}
        </div>
    );
}

const LandingPage = () => {
    const { theme } = useTheme();
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [interestForm, setInterestForm] = useState({ clinic_name: '', professional_email: '', description: '' });
    const [interestStatus, setInterestStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    const handleInterestSubmit = async (e) => {
        e.preventDefault();
        setInterestStatus('loading');

        try {
            const response = await axios.post('http://localhost:5001/api/submit-interest', interestForm);
            if (response.data.success) {
                setInterestStatus('success');
                setInterestForm({ clinic_name: '', professional_email: '', description: '' });
                setTimeout(() => setInterestStatus('idle'), 3000);
            }
        } catch (error) {
            setInterestStatus('error');
            setTimeout(() => setInterestStatus('idle'), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors selection:bg-primary-100 selection:text-primary-700">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4 px-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={logoDark} alt="VoxAI Logo" className="h-10 w-auto object-contain block dark:hidden" />
                        <img src={logoWhite} alt="VoxAI Logo" className="h-10 w-auto object-contain hidden dark:block" />
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
                        <a href="#onboarding" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Onboarding</a>
                        <a href="#stats" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Impact</a>
                        <Link
                            to="/login"
                            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold border border-slate-200 dark:border-slate-800"
                        >
                            Portal Login
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20 px-8 max-w-7xl mx-auto relative overflow-hidden">
                <DottedSurface className="absolute inset-0 -z-1 opacity-40 dark:opacity-60" />
                <motion.div
                    className="text-center relative"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400 text-sm font-semibold mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                        </span>
                        SaaS for Modern Clinics
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
                        The Future of <br />
                        <span className="text-primary-600 dark:text-primary-500">Medical Transcription</span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-6 leading-relaxed">
                        Transform doctor-patient consultations into precise medical reports instantly.
                        Powered by advanced AI for speed and expert-level medical data extraction.
                    </motion.p>
                    <motion.p variants={fadeInUp} className="text-lg text-slate-500 dark:text-slate-500 max-w-2xl mx-auto mb-10">
                        Save 2+ hours daily on documentation. Focus on patient care, not paperwork.
                        HIPAA-compliant, secure, and trusted by 500+ clinics worldwide.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="flex justify-center">
                        <button
                            onClick={() => setShowDemoModal(true)}
                            className="btn-primary text-lg px-8 py-4 flex items-center gap-2 justify-center"
                        >
                            Request a Free Demo <ChevronRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                </motion.div>

                {/* Stats Bar */}
                <motion.div
                    id="stats"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {[
                        { icon: <ClipboardList className="w-6 h-6" />, value: "10,000+", label: "Reports Generated" },
                        { icon: <Users className="w-6 h-6" />, value: "500+", label: "Clinics Onboarded" },
                        { icon: <TrendingUp className="w-6 h-6" />, value: "99.9%", label: "Uptime Guarantee" }
                    ].map((stat, i) => (
                        <TiltCard key={i} className="glass-card p-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl mb-3">
                                {stat.icon}
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                        </TiltCard>
                    ))}
                </motion.div>

                {/* How It Works */}
                <motion.section
                    id="how-it-works"
                    className="mt-32"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-900 dark:text-white">
                        How It Works
                    </h2>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto">
                        Three simple steps to transform your clinical documentation workflow
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Record Consultation",
                                desc: "Use your device to record the doctor-patient conversation. Upload audio files or record live directly in the app.",
                                icon: <Mic className="w-8 h-8" />
                            },
                            {
                                step: "02",
                                title: "AI Processes Data",
                                desc: "Our AI transcribes the audio and extracts structured medical data: symptoms, diagnoses, medications, and treatment plans.",
                                icon: <Activity className="w-8 h-8" />
                            },
                            {
                                step: "03",
                                title: "Review & Approve",
                                desc: "Doctors review the auto-generated report, make edits if needed, and approve. PDF is instantly generated and stored securely.",
                                icon: <CheckCircle className="w-8 h-8" />
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                            >
                                <TiltCard className="glass-card p-8 relative h-full">
                                    <div className="text-6xl font-bold text-primary-100 dark:text-primary-900/30 absolute top-4 right-4">
                                        {item.step}
                                    </div>
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl mb-4">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Feature Grid */}
                <div id="features" className="mt-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Built for Healthcare Professionals
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Enterprise-grade features designed specifically for modern medical practices
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Stethoscope className="w-8 h-8" />,
                                title: "100% Accurate Transcription",
                                desc: "Advanced AI transcription with medical terminology recognition. Supports 50+ languages and accents. No per-recording fees, unlimited usage.",
                                benefit: "Save 30+ minutes per consultation"
                            },
                            {
                                icon: <Heart className="w-8 h-8" />,
                                title: "Intelligent Data Extraction",
                                desc: "Automatically extracts symptoms, diagnoses, medications, dosages, and treatment plans. Structured data ready for EHR integration.",
                                benefit: "Reduce documentation errors by 95%"
                            },
                            {
                                icon: <ClipboardList className="w-8 h-8" />,
                                title: "Instant PDF Reports",
                                desc: "Generate professional medical reports in seconds. Customizable templates with your clinic's branding, letterhead, and digital signatures.",
                                benefit: "Deliver reports to patients immediately"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <TiltCard className="glass-card p-8 h-full">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{feature.desc}</p>
                                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-lg">
                                        <CheckCircle className="w-4 h-4" />
                                        {feature.benefit}
                                    </div>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Use Cases */}
                <motion.section
                    className="mt-32"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-900 dark:text-white">
                        Perfect For Every Medical Practice
                    </h2>
                    <p className="text-center text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto">
                        From solo practitioners to multi-specialty hospitals
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: "General Practitioners", desc: "Handle 50+ patients daily without documentation burnout. Auto-generate SOAP notes instantly." },
                            { title: "Specialty Clinics", desc: "Cardiology, Orthopedics, Pediatrics - custom templates for every specialty with relevant fields." },
                            { title: "Multi-Doctor Hospitals", desc: "Centralized patient history, role-based access, and seamless collaboration across departments." },
                            { title: "Telemedicine Providers", desc: "Record virtual consultations, generate reports, and share with patients via secure links." }
                        ].map((useCase, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <TiltCard className="glass-card p-6 border-l-4 border-primary-500 h-full">
                                    <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{useCase.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{useCase.desc}</p>
                                </TiltCard>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>


                {/* Onboarding Section */}
                <motion.section
                    id="onboarding"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 glass-card p-12 relative overflow-hidden shadow-xl"
                >
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                                Built for <span className="text-primary-600 dark:text-primary-500">Clinics</span>, Not Individuals
                            </h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                We don't offer generic subscriptions. We partner with clinics to provide custom installation,
                                staff training, and manual onboarding for maximum security and performance.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Manual Clinical Onboarding",
                                    "Dedicated Multi-Tenant Database",
                                    "Custom PDF Branding for your Clinic",
                                    "Secure Cloud Storage Integration"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-500 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="glass-card p-8 bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Request Manual Setup</h3>
                            <form onSubmit={handleInterestSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Clinic Name"
                                    className="input-field"
                                    value={interestForm.clinic_name}
                                    onChange={(e) => setInterestForm({ ...interestForm, clinic_name: e.target.value })}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Professional Email"
                                    className="input-field"
                                    value={interestForm.professional_email}
                                    onChange={(e) => setInterestForm({ ...interestForm, professional_email: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="Tell us about your clinic size..."
                                    className="input-field h-32"
                                    value={interestForm.description}
                                    onChange={(e) => setInterestForm({ ...interestForm, description: e.target.value })}
                                />
                                {interestStatus === 'success' && (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
                                        <CheckCircle className="w-5 h-5" />
                                        Submitted! We'll contact you soon.
                                    </div>
                                )}
                                {interestStatus === 'error' && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                                        <AlertCircle className="w-5 h-5" />
                                        Failed to submit. Please try again.
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={interestStatus === 'loading'}
                                    className="btn-primary w-full"
                                >
                                    {interestStatus === 'loading' ? 'Submitting...' : 'Submit Interest'}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.section>
            </main>

            {/* Footer */}
            <footer className="mt-32 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Company Info */}
                        <div className="col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <img src={logoDark} alt="VoxAI Logo" className="h-8 w-auto object-contain block dark:hidden" />
                                <img src={logoWhite} alt="VoxAI Logo" className="h-8 w-auto object-contain hidden dark:block" />
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                                Transform medical consultations into precise reports with AI-powered transcription and data extraction.
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500">
                                A product of{' '}
                                <a
                                    href="https://automaticxai.online"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                                >
                                    automaticxai.online
                                </a>
                            </p>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Product</h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Features', href: '#features' },
                                    { name: 'Demo', href: '#' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'About Us', href: '/about' },
                                    { name: 'Blog', href: '/blog' },
                                    { name: 'Partners', href: '/partners' },
                                    { name: 'FAQ', href: '/faq' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal & Support */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Legal & Support</h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Privacy Policy', href: '/privacy' },
                                    { name: 'Terms of Service', href: '/terms' },
                                    { name: 'HIPAA Compliance', href: '/hipaa' },
                                    { name: 'Security', href: '/security' },
                                    { name: 'Contact Support', href: 'mailto:ainan@automaticxai.online' }
                                ].map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                © 2026 VoxAI. All rights reserved.
                            </p>
                            <ThemeToggle />
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                                <Globe className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                                <Shield className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all">
                                <Heart className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Demo Request Modal */}
            <DemoRequestModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
        </div>
    );
};

export default LandingPage;
