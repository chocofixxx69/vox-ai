import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPage = () => {
    const posts = [
        {
            title: "How AI is Transforming Healthcare Documentation",
            date: "February 15, 2026",
            author: "Dr. Sarah Johnson",
            excerpt: "Discover how artificial intelligence is revolutionizing the way doctors document patient consultations, saving hours of administrative work.",
            category: "AI & Healthcare"
        },
        {
            title: "5 Ways VoxAI Improves Patient Care",
            date: "February 10, 2026",
            author: "Dr. Michael Chen",
            excerpt: "Learn how reducing documentation time allows doctors to spend more quality time with patients and improve overall care outcomes.",
            category: "Best Practices"
        },
        {
            title: "HIPAA Compliance in AI Medical Transcription",
            date: "February 5, 2026",
            author: "Legal Team",
            excerpt: "Understanding how VoxAI ensures complete HIPAA compliance while leveraging cutting-edge AI technology.",
            category: "Security & Compliance"
        }
    ];

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
                    <h1 className="text-5xl font-bold mb-6 text-slate-900 dark:text-white">Blog</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
                        Insights, updates, and best practices from the VoxAI team
                    </p>

                    <div className="space-y-6">
                        {posts.map((post, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card p-8 hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
                                    {post.category}
                                </div>
                                <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white hover:text-primary-600 transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {post.date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        {post.author}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="glass-card p-8 text-center mt-12">
                        <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Stay Updated</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Subscribe to our newsletter for the latest updates and insights
                        </p>
                        <div className="flex gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input-field flex-1"
                            />
                            <button className="btn-primary">Subscribe</button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default BlogPage;
