import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Users, Zap, Heart, Calendar, Code, FileText, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import RadialOrbitalTimeline from '../components/ui/radial-orbital-timeline';

const milestoneData = [
    {
        id: 1,
        title: "Founded",
        date: "Jan 2023",
        content: "VoxAI was founded with a mission to eliminate documentation burden for healthcare professionals.",
        category: "Milestone",
        icon: Calendar,
        relatedIds: [2],
        status: "completed",
        energy: 100,
    },
    {
        id: 2,
        title: "Beta Launch",
        date: "Jun 2023",
        content: "Launched our beta with 20 pilot clinics, achieving 95% transcription accuracy for medical terminology.",
        category: "Launch",
        icon: FileText,
        relatedIds: [1, 3],
        status: "completed",
        energy: 90,
    },
    {
        id: 3,
        title: "AI Engine v2",
        date: "Nov 2023",
        content: "Released our second-generation AI engine with real-time transcription and multi-language support.",
        category: "Technology",
        icon: Code,
        relatedIds: [2, 4],
        status: "completed",
        energy: 85,
    },
    {
        id: 4,
        title: "500+ Clinics",
        date: "Mar 2024",
        content: "Reached 500+ clinics worldwide, saving doctors an average of 2 hours of documentation time daily.",
        category: "Growth",
        icon: Users,
        relatedIds: [3, 5],
        status: "in-progress",
        energy: 65,
    },
    {
        id: 5,
        title: "HIPAA Certified",
        date: "May 2024",
        content: "Achieved full HIPAA compliance certification, reinforcing our commitment to patient data security.",
        category: "Compliance",
        icon: User,
        relatedIds: [4, 6],
        status: "in-progress",
        energy: 50,
    },
    {
        id: 6,
        title: "Global Expansion",
        date: "Q3 2024",
        content: "Expanding to 15 new countries with localized medical terminology models and regional compliance.",
        category: "Expansion",
        icon: Clock,
        relatedIds: [5],
        status: "pending",
        energy: 20,
    },
];

const AboutPage = () => {
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

            <main className="max-w-5xl mx-auto px-8 py-20">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white">About VoxAI</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
                        Revolutionizing medical documentation with AI-powered transcription
                    </p>

                    <div className="glass-card p-12 mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Our Mission</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                            VoxAI was created to solve a critical problem in healthcare: the overwhelming burden of medical documentation.
                            Doctors spend 2-3 hours daily on paperwork, time that could be spent with patients.
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            Our mission is to give doctors their time back by automating the transcription and structuring of medical consultations,
                            allowing them to focus on what matters most—patient care.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {[
                            { icon: <Target />, title: "Our Vision", desc: "To become the global standard for medical documentation, trusted by healthcare professionals worldwide." },
                            { icon: <Users />, title: "Our Team", desc: "Built by AI experts and healthcare professionals who understand the challenges of modern medical practice." },
                            { icon: <Zap />, title: "Our Technology", desc: "State-of-the-art AI models trained specifically for medical terminology and clinical workflows." },
                            { icon: <Heart />, title: "Our Values", desc: "Patient privacy, data security, and empowering healthcare professionals are at the core of everything we do." }
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-6">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Radial Orbital Timeline — Our Journey */}
                    <div className="mb-12">
                        <div className="text-center mb-4">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Journey</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                                Click any node to explore a milestone · Click background to reset
                            </p>
                        </div>
                        <div className="rounded-2xl overflow-hidden" style={{ height: '600px' }}>
                            <RadialOrbitalTimeline timelineData={milestoneData} />
                        </div>
                    </div>

                    <div className="glass-card p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Join 500+ Clinics Worldwide</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Experience the future of medical documentation
                        </p>
                        <Link to="/" className="btn-primary inline-block">
                            Request a Demo
                        </Link>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default AboutPage;
