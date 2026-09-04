import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
    {
        category: "Security & Privacy",
        questions: [
            {
                q: "Is my patient data secure?",
                a: "Yes. We use bank-level encryption (AES-256), HIPAA-compliant infrastructure, and never store audio files permanently. All data is encrypted at rest and in transit. Our servers are hosted in SOC 2 Type II certified data centers."
            },
            {
                q: "Are you HIPAA compliant?",
                a: "Absolutely. VoxAI is fully HIPAA compliant. We sign Business Associate Agreements (BAAs) with all clinic partners, maintain strict access controls, and undergo regular third-party security audits."
            },
            {
                q: "Who can access my clinic's data?",
                a: "Only authorized staff at your clinic can access your data. We operate a strict multi-tenant architecture — your data is completely isolated from other clinics. Our team only accesses data for support purposes with your explicit consent."
            }
        ]
    },
    {
        category: "Transcription & Accuracy",
        questions: [
            {
                q: "How accurate is the transcription?",
                a: "Our AI achieves 98%+ accuracy for medical terminology. Doctors review and approve all reports before finalization, ensuring 100% accuracy. The system is trained on millions of medical conversations and continuously improves."
            },
            {
                q: "What languages are supported?",
                a: "Currently supports English, Hindi, Spanish, French, German, Arabic, Mandarin, and 45+ other languages. We're constantly adding more based on user demand. The output report is always generated in English."
            },
            {
                q: "How long does processing take?",
                a: "A 10-minute consultation is transcribed and processed in under 30 seconds. You'll have a draft report ready for review almost instantly. Processing time scales linearly — a 1-hour recording takes about 3 minutes."
            }
        ]
    },
    {
        category: "Reports & Customization",
        questions: [
            {
                q: "Can I customize the report format?",
                a: "Absolutely. You can customize templates with your clinic's logo, letterhead, preferred sections, and even add custom fields specific to your specialty. We support SOAP notes, discharge summaries, referral letters, and more."
            },
            {
                q: "Can I edit the AI-generated report?",
                a: "Yes. Every report goes through a doctor review step before finalization. You can edit any field, add notes, correct terminology, or restructure sections. The AI handles the heavy lifting; you maintain full control."
            },
            {
                q: "What file formats are supported for output?",
                a: "Reports are generated as professional PDFs with your clinic's branding. We also support export to DOCX, and we're working on direct EHR integration for popular systems like Epic and Cerner."
            }
        ]
    },
    {
        category: "Pricing & Onboarding",
        questions: [
            {
                q: "Do you offer a free trial?",
                a: "Yes! Request a demo and we'll set up a 14-day free trial with full access to all features. No credit card required. Our team will personally onboard your clinic and train your staff."
            },
            {
                q: "How does onboarding work?",
                a: "We don't do self-serve signups. We partner with clinics directly — our team handles installation, staff training, data migration, and custom configuration. This ensures maximum security and a perfect fit for your workflow."
            },
            {
                q: "Is there a per-consultation fee?",
                a: "No. We offer flat-rate clinic pricing based on the number of doctors and monthly consultation volume. There are no per-recording or per-report fees. Unlimited usage within your plan."
            }
        ]
    }
];

function FAQItem({ question, answer }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            className="glass-card overflow-hidden"
            initial={false}
        >
            <button
                className="w-full flex items-center justify-between p-6 text-left group"
                onClick={() => setOpen(!open)}
            >
                <span className="text-base font-semibold text-slate-900 dark:text-white pr-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400"
                >
                    <ChevronDown className="w-4 h-4" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                        <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

const FAQPage = () => {
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
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl mb-6">
                            <HelpCircle className="w-8 h-8" />
                        </div>
                        <h1 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Everything you need to know about VoxAI. Can't find your answer?{' '}
                            <a href="mailto:ainan@automaticxai.online" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                                Contact us
                            </a>.
                        </p>
                    </div>

                    {/* FAQ Categories */}
                    <div className="space-y-12">
                        {faqs.map((category, ci) => (
                            <motion.div
                                key={ci}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: ci * 0.1 }}
                            >
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                    <span className="w-1 h-7 bg-primary-600 rounded-full inline-block"></span>
                                    {category.category}
                                </h2>
                                <div className="space-y-3">
                                    {category.questions.map((faq, qi) => (
                                        <FAQItem key={qi} question={faq.q} answer={faq.a} />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-20 glass-card p-10 text-center"
                    >
                        <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Still have questions?</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Our team is happy to walk you through everything in a personalized demo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="mailto:ainan@automaticxai.online" className="btn-secondary inline-block text-center">
                                Email Us
                            </a>
                            <Link to="/" className="btn-primary inline-block text-center">
                                Request a Demo
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
};

export default FAQPage;
