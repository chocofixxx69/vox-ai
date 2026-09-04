import React, { useState, useEffect, useRef } from 'react';
import {
    Mic, MicOff, User, FileText, ArrowRight, CheckCircle2,
    AlertCircle, Activity, ChevronRight, ClipboardCheck,
    Send, Download, Loader2, Plus, Trash2, Edit3
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:5001/api';

const ConsultationWizard = ({ onComplete }) => {
    const [step, setStep] = useState('patient-info'); // 'patient-info', 'record', 'processing', 'review'
    const [patientInfo, setPatientInfo] = useState({ name: '', age: '', gender: '', email: '', phone: '' });
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [consultationId, setConsultationId] = useState(null);
    const [reportData, setReportData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);

    // Phase 5 & 6: Manual Entry & Preview State
    const [viewMode, setViewMode] = useState('editor'); // 'editor' or 'preview'
    const [showMedForm, setShowMedForm] = useState(false);
    const [editingMedIndex, setEditingMedIndex] = useState(null);
    const [newMed, setNewMed] = useState({ name: '', dosage: '500mg', frequency: 'Once Daily', duration: '5 Days' });

    const dosages = ['2.5mg', '5mg', '10mg', '20mg', '50mg', '100mg', '250mg', '500mg', '1g', '5ml', '10ml'];
    const frequencies = ['Once Daily', 'Twice Daily (BID)', 'Three Times (TID)', 'Four Times (QID)', 'Before Meals', 'After Meals', 'At Bedtime', 'As Needed (PRN)'];

    // Timer for recording
    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,       // Mono — best for speech
                    sampleRate: 16000,     // 16kHz — optimal for Whisper
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });
            streamRef.current = stream;

            // Choose best available codec with fallback
            const mimeTypes = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/ogg;codecs=opus',
                'audio/mp4'
            ];
            const selectedMime = mimeTypes.find(m => MediaRecorder.isTypeSupported(m)) || '';
            console.log('Using MIME type:', selectedMime || 'browser default');

            const recorderOptions = selectedMime ? { mimeType: selectedMime } : {};
            const recorder = new MediaRecorder(stream, recorderOptions);
            mediaRecorderRef.current = recorder;

            const chunks = [];
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks, { type: selectedMime || 'audio/webm' });
                setAudioBlob(blob);
                // Stop all tracks to release mic
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start(1000); // Collect data every second
            setIsRecording(true);
            setError(null);
        } catch (err) {
            console.error("Recording start error:", err);
            setError("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        console.log("Stopping recording and releasing microphone...");
        const recorder = mediaRecorderRef.current;

        try {
            // 1. Stop the recorder
            if (recorder && recorder.state !== 'inactive') {
                recorder.stop();
            }
        } catch (err) {
            console.error("Recorder stop error:", err);
        } finally {
            // 2. IMMEDIATELY stop all microphone tracks (Kills the 'recording' red dot)
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => {
                    track.stop();
                    console.log(`Track ${track.label} stopped.`);
                });
                streamRef.current = null;
            }

            // 3. Update UI
            setIsRecording(false);
        }
    };

    const handleProcess = async () => {
        if (!audioBlob) return;

        setIsProcessing(true);
        setStep('processing');

        // Read real session IDs from localStorage
        let clinicId = '00000000-0000-0000-0000-000000000000';
        let doctorId = '00000000-0000-0000-0000-000000000000';
        try {
            const savedSession = localStorage.getItem('voxai-session');
            if (savedSession) {
                const session = JSON.parse(savedSession);
                clinicId = session.clinicId || clinicId;
                doctorId = session.id || doctorId;
            }
        } catch (e) {
            console.warn('Could not read session:', e);
        }

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        formData.append('patient_info', JSON.stringify(patientInfo));
        formData.append('clinic_id', clinicId);
        formData.append('doctor_id', doctorId);

        try {
            const response = await axios.post(`${API_URL}/transcribe`, formData, {
                timeout: 300000 // 5 minutes for large recordings
            });
            setReportData(response.data.report);
            setConsultationId(response.data.consultation_id);
            setStep('review');
        } catch (err) {
            console.error('Transcription error:', err);
            setError(err.response?.data?.error || "AI Processing failed. Please try again.");
            setStep('record');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFinalApprove = async () => {
        if (!reportData || !consultationId) {
            console.error("Missing data for approval:", { reportData, consultationId });
            setError("Cannot finalize: Consultation data missing.");
            return;
        }

        setIsProcessing(true);
        setError(null);
        try {
            console.log("Finalizing report...", { consultationId, reportData });
            const response = await axios.post(`${API_URL}/approve-and-send`, {
                consultation_id: consultationId,
                report_data: reportData
            });

            if (response.data.success) {
                console.log("Approval successful!", response.data);
                if (response.data.pdf_url) {
                    window.open(response.data.pdf_url, '_blank');
                }
                setStep('complete');
            } else {
                setError(response.data.error || "Failed to finalize report.");
            }
        } catch (err) {
            console.error("Approve API error:", err);
            setError("Failed to connect to server for finalization.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddMedication = () => {
        if (!newMed.name) return;
        const updatedReport = { ...reportData };
        if (editingMedIndex !== null) {
            updatedReport.medical_information.medications[editingMedIndex] = { ...newMed };
            setEditingMedIndex(null);
        } else {
            updatedReport.medical_information.medications.push({ ...newMed });
        }
        setReportData(updatedReport);
        setNewMed({ name: '', dosage: '500mg', frequency: 'Once Daily', duration: '5 Days' });
        setShowMedForm(false);
    };

    const handleEditMedication = (index) => {
        setEditingMedIndex(index);
        setNewMed({ ...reportData.medical_information.medications[index] });
        setShowMedForm(true);
    };

    const removeMedication = (index) => {
        const updatedReport = { ...reportData };
        updatedReport.medical_information.medications.splice(index, 1);
        setReportData(updatedReport);
    };

    const updateField = (category, field, value) => {
        const updatedReport = { ...reportData };
        if (category === 'medical_information') {
            if (Array.isArray(updatedReport.medical_information[field])) {
                // If it's an array, we split it by newline for recommendations or comma for others
                const delimiter = field === 'recommendations' ? '\n' : ',';
                updatedReport.medical_information[field] = value.split(delimiter).map(i => i.trim()).filter(i => i !== '');
            } else {
                updatedReport.medical_information[field] = value;
            }
        }
        setReportData(updatedReport);
    };

    const stepVariants = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">

                {/* Step 1: Patient Details */}
                {step === 'patient-info' && (
                    <motion.div key="step1" {...stepVariants} className="glass-card p-10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <User className="text-primary-600 dark:text-primary-400" /> Patient Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={patientInfo.name}
                                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={patientInfo.phone}
                                    onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Age</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={patientInfo.age}
                                    onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Email (Optional)</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={patientInfo.email}
                                    onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="mt-10 flex justify-end">
                            <button
                                onClick={() => setStep('record')}
                                disabled={!patientInfo.name || !patientInfo.phone}
                                className="btn-primary group"
                            >
                                Proceed to Recording <ChevronRight className="inline ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Live Recording */}
                {step === 'record' && (
                    <motion.div key="step2" {...stepVariants} className="glass-card p-10 text-center">
                        <h2 className="text-2xl font-bold mb-10 text-slate-900 dark:text-white">Live Consultation Recording</h2>

                        <div className="relative inline-block mb-12">
                            {isRecording && (
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="absolute inset-0 bg-red-500/30 rounded-full blur-3xl pointer-events-none z-0"
                                />
                            )}
                            <button
                                type="button"
                                onClick={isRecording ? stopRecording : startRecording}
                                className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 dark:bg-primary-500 hover:scale-105'}`}
                            >
                                {isRecording ? (
                                    <>
                                        <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-sm mb-2" />
                                        <span className="text-white text-xs font-bold uppercase tracking-widest">Stop</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-12 h-12 text-white mb-2" />
                                        <span className="text-white text-xs font-bold uppercase tracking-widest">Record</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-5xl font-mono mb-6 text-slate-900 dark:text-white tracking-tight">
                            {formatTime(recordingTime)}
                        </div>

                        <div className="mb-12 h-8">
                            <AnimatePresence mode="wait">
                                {isRecording ? (
                                    <motion.p
                                        key="rec"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-red-400 font-bold flex items-center justify-center gap-2"
                                    >
                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                        Recording Live Consultation...
                                    </motion.p>
                                ) : (
                                    <motion.p
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-slate-600 dark:text-slate-400"
                                    >
                                        {audioBlob ? "Recording captured. Ready for AI Analysis." : "Click Record to begin the session."}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {error && <div className="text-red-600 mb-8 p-4 bg-red-50 rounded-xl border border-red-200 flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

                        <div className="flex justify-center gap-6">
                            <button onClick={() => setStep('patient-info')} className="btn-secondary px-8">Back</button>
                            {(audioBlob || !isRecording) && audioBlob && (
                                <button
                                    onClick={handleProcess}
                                    className="btn-primary px-10 flex items-center gap-2 shadow-lg shadow-primary-500/20"
                                >
                                    Generate AI Report <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Step 3: AI Processing */}
                {step === 'processing' && (
                    <motion.div key="step3" {...stepVariants} className="glass-card p-20 text-center">
                        <div className="relative mb-10 inline-block">
                            <Activity className="w-16 h-16 text-primary-600 dark:text-primary-400 animate-pulse" />
                            <div className="absolute inset-0 bg-primary-50 dark:bg-primary-900/200/20 blur-2xl animate-pulse"></div>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">AI Is Thinking...</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                            Transcribing audio and extracting medical insights with advanced AI.
                        </p>
                        <div className="mt-10 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 10, ease: "linear" }}
                                className="h-full premium-gradient"
                            />
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Review & Approve */}
                {step === 'review' && reportData && (
                    <motion.div key="step4" {...stepVariants} className="space-y-6">
                        <div className="glass-card p-8">
                            <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-3">
                                        {viewMode === 'editor' ? 'Medical Report Review' : 'Official Report Preview'}
                                        <span className={`text-[10px] uppercase tracking-tighter px-2 py-0.5 rounded-full ${viewMode === 'editor' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                            {viewMode} mode
                                        </span>
                                    </h2>
                                    <p className="text-slate-600 dark:text-slate-400">Patient: {patientInfo.name || 'Anonymous'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode(viewMode === 'editor' ? 'preview' : 'editor')}
                                        className="btn-secondary py-2 flex items-center gap-2 border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400"
                                    >
                                        <Activity className="w-4 h-4" />
                                        {viewMode === 'editor' ? 'Switch to Preview' : 'Back to Editor'}
                                    </button>
                                    <button
                                        onClick={handleFinalApprove}
                                        disabled={isProcessing}
                                        className="btn-primary py-2 px-8 flex items-center gap-2 shadow-lg shadow-primary-500/20"
                                    >
                                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
                                        Final Approve
                                    </button>
                                </div>
                            </div>

                            {viewMode === 'editor' ? (
                                /* EDITOR MODE */
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Content (Editable fields) */}
                                    <div className="lg:col-span-2 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <section>
                                                <h3 className="text-primary-600 dark:text-primary-400 font-bold text-sm uppercase tracking-wider mb-4">Diagnosis & Symptoms</h3>
                                                <div className="space-y-3">
                                                    <div className="p-4 bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-colors">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">Diagnoses (Separated by comma)</p>
                                                            <Edit3 className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-transparent border-none text-slate-900 dark:text-white outline-none p-0 focus:ring-0 text-sm"
                                                            value={reportData.medical_information.diagnoses.join(', ')}
                                                            onChange={(e) => updateField('medical_information', 'diagnoses', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="p-4 bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-colors">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">Symptoms (Separated by comma)</p>
                                                            <Edit3 className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-transparent border-none text-slate-900 dark:text-white outline-none p-0 focus:ring-0 text-sm"
                                                            value={reportData.medical_information.symptoms.join(', ')}
                                                            onChange={(e) => updateField('medical_information', 'symptoms', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-primary-600 dark:text-primary-400 font-bold text-sm uppercase tracking-wider">Medications</h3>
                                                    <button
                                                        onClick={() => {
                                                            setEditingMedIndex(null);
                                                            setNewMed({ name: '', dosage: '500mg', frequency: 'Once Daily', duration: '5 Days' });
                                                            setShowMedForm(!showMedForm);
                                                        }}
                                                        className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-indigo-300 flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-lg transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" /> Add
                                                    </button>
                                                </div>

                                                <AnimatePresence>
                                                    {showMedForm && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden mb-4"
                                                        >
                                                            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 space-y-3">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Medication Name"
                                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                                                                    value={newMed.name}
                                                                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                                                                />
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <select
                                                                        className="bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-2 text-sm outline-none focus:border-indigo-500"
                                                                        value={newMed.dosage}
                                                                        onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                                                                    >
                                                                        {dosages.map(d => <option key={d}>{d}</option>)}
                                                                    </select>
                                                                    <select
                                                                        className="bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-2 text-sm outline-none focus:border-indigo-500"
                                                                        value={newMed.frequency}
                                                                        onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                                                                    >
                                                                        {frequencies.map(f => <option key={f}>{f}</option>)}
                                                                    </select>
                                                                </div>
                                                                <div className="flex gap-2 pt-1">
                                                                    <button onClick={handleAddMedication} className="w-full py-2 bg-indigo-500 text-white rounded-lg text-xs font-bold hover:bg-indigo-600">
                                                                        {editingMedIndex !== null ? 'Update' : 'Apply'}
                                                                    </button>
                                                                    <button onClick={() => setShowMedForm(false)} className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold hover:bg-slate-700">Cancel</button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                <div className="max-h-[200px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                                    {reportData.medical_information.medications.length > 0 ? (
                                                        reportData.medical_information.medications.map((med, i) => (
                                                            <div key={i} className="p-3 bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center group">
                                                                <div>
                                                                    <p className="font-bold text-sm text-white">{med.name}</p>
                                                                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans italic">{med.dosage} • {med.frequency}</p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => handleEditMedication(i)}
                                                                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all border border-transparent hover:border-primary-100 dark:hover:border-primary-800"
                                                                        title="Edit Medication"
                                                                    >
                                                                        <Edit3 className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => removeMedication(i)}
                                                                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all border border-transparent hover:border-rose-100 dark:hover:border-rose-800"
                                                                        title="Remove Medication"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : <p className="text-slate-600 dark:text-slate-400 italic text-xs py-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">No medications detected.</p>}
                                                </div>
                                            </section>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                                            <section>
                                                <h3 className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-4">Recommendations</h3>
                                                <div className="p-4 bg-white dark:bg-slate-900 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-emerald-400 transition-colors">
                                                    <textarea
                                                        className="w-full bg-transparent border-none text-slate-700 dark:text-slate-300 outline-none p-0 focus:ring-0 text-sm leading-relaxed resize-none h-24"
                                                        value={reportData.medical_information.recommendations.join('\n')}
                                                        placeholder="List patient advice here..."
                                                        onChange={(e) => updateField('medical_information', 'recommendations', e.target.value)}
                                                    />
                                                </div>
                                            </section>
                                            <section>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-rose-600 font-bold text-sm uppercase tracking-wider">Follow Up & Avoid</h3>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-rose-400 transition-colors">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">Follow-up Instructions</p>
                                                            <Edit3 className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-transparent border-none text-slate-900 dark:text-white outline-none p-0 focus:ring-0 text-sm"
                                                            value={reportData.medical_information.follow_up}
                                                            placeholder="e.g. Next week, or After labs"
                                                            onChange={(e) => updateField('medical_information', 'follow_up', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 focus-within:border-rose-400 transition-colors">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <p className="text-xs text-slate-600 dark:text-slate-400">Prohibitions (Separated by comma)</p>
                                                            <Edit3 className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-transparent border-none text-slate-900 dark:text-white outline-none p-0 focus:ring-0 text-sm"
                                                            value={reportData.medical_information.prohibitions.join(', ')}
                                                            placeholder="Alcohol, heavy lifting, etc."
                                                            onChange={(e) => updateField('medical_information', 'prohibitions', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>

                                    {/* Right: Original Transcript Sidebar */}
                                    <div className="lg:col-span-1 border-l border-slate-200 dark:border-slate-800 pl-8">
                                        <h3 className="text-slate-600 dark:text-slate-400 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Live Transcript
                                        </h3>
                                        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[500px] overflow-y-auto text-slate-600 dark:text-slate-400 leading-relaxed text-xs italic scrollbar-thin">
                                            {reportData.transcription.full_text}
                                        </div>
                                        <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
                                            <p className="text-[10px] text-primary-600 dark:text-primary-400 leading-tight">
                                                Tip: Changes you make in the editor will be reflected in the final PDF report.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* PREVIEW MODE (Formal PDF Look) */
                                <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-sm shadow-2xl p-12 min-h-[800px] relative overflow-hidden font-serif">
                                    {/* Abstract background design for the 'paper' */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 opacity-50 rounded-bl-full"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-50 opacity-50 rounded-tr-full"></div>

                                    {/* Header */}
                                    <header className="flex justify-between items-start border-b-2 border-slate-200 dark:border-slate-800 pb-8 mb-10">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-sky-600/20">
                                                <Activity className="text-white w-6 h-6" />
                                            </div>
                                            <div>
                                                <h1 className="text-2xl font-black tracking-tight uppercase text-sky-900 leading-none">VoxAI</h1>
                                                <p className="text-[10px] text-slate-600 dark:text-slate-400 italic font-sans mt-0.5">Official Clinical Summary</p>
                                            </div>
                                        </div>
                                        <div className="text-right font-sans">
                                            <p className="text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-bold">Report ID</p>
                                            <p className="text-xs font-bold">#MV-{consultationId?.slice(0, 8).toUpperCase() || 'TEMP'}</p>
                                            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-2">Date: {new Date().toLocaleDateString()}</p>
                                        </div>
                                    </header>

                                    {/* Patient Info Bar */}
                                    <div className="bg-white dark:bg-slate-900 dark:bg-slate-900 p-6 rounded-lg grid grid-cols-4 gap-4 mb-10 font-sans border border-slate-100">
                                        <div className="col-span-2">
                                            <p className="text-[9px] text-slate-600 dark:text-slate-400 uppercase font-bold tracking-widest leading-none mb-1 text-sky-700">Patient Name</p>
                                            <p className="text-sm font-bold">{patientInfo.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-600 dark:text-slate-400 uppercase font-bold tracking-widest leading-none mb-1 text-sky-700">Age / Gender</p>
                                            <p className="text-sm font-bold">{patientInfo.age || '--'} / {patientInfo.gender || '--'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-slate-600 dark:text-slate-400 uppercase font-bold tracking-widest leading-none mb-1 text-sky-700">Phone</p>
                                            <p className="text-sm font-bold">{patientInfo.phone || '--'}</p>
                                        </div>
                                    </div>

                                    {/* Main Content Sections */}
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-2 gap-12">
                                            <section>
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] border-l-4 border-sky-600 pl-3 mb-4 text-sky-900">Clinical Assessment</h3>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold mb-1 font-sans">DIAGNOSES</p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {reportData.medical_information.diagnoses.map((d, i) => (
                                                                <span key={i} className="text-xs font-bold px-2 py-0.5 bg-sky-50 text-sky-800 rounded">{d}</span>
                                                            )) || <p className="text-xs italic text-slate-600 dark:text-slate-400">None detected</p>}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold mb-1 font-sans">SYMPTOMS</p>
                                                        <p className="text-xs leading-relaxed">{reportData.medical_information.symptoms.join(', ') || 'None reported'}</p>
                                                    </div>
                                                </div>
                                            </section>

                                            <section>
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] border-l-4 border-indigo-600 pl-3 mb-4 text-indigo-900">Prescribed Plan</h3>
                                                <div className="space-y-2">
                                                    {reportData.medical_information.medications.length > 0 ? (
                                                        reportData.medical_information.medications.map((med, i) => (
                                                            <div key={i} className="flex justify-between items-start border-b border-slate-100 pb-2">
                                                                <div>
                                                                    <p className="text-xs font-bold leading-tight uppercase">{med.name}</p>
                                                                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-sans italic">{med.dosage} • {med.frequency}</p>
                                                                </div>
                                                                <p className="text-[9px] font-bold text-indigo-600 font-sans px-1.5 py-0.5 border border-indigo-100 rounded">{med.duration}</p>
                                                            </div>
                                                        ))
                                                    ) : <p className="text-xs italic text-slate-600 dark:text-slate-400">No medications prescribed.</p>}
                                                </div>
                                            </section>
                                        </div>

                                        <section className="bg-emerald-50/30 p-8 rounded-xl border border-emerald-100/50">
                                            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-emerald-900 flex items-center gap-2">
                                                Recommendations & Lifestyle
                                            </h3>
                                            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 list-disc list-inside">
                                                {reportData.medical_information.recommendations.map((r, i) => (
                                                    <li key={i} className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">{r}</li>
                                                ))}
                                                {reportData.medical_information.prohibitions.map((p, i) => (
                                                    <li key={`p-${i}`} className="text-[11px] leading-relaxed text-rose-700 font-bold italic">AVOID: {p}</li>
                                                ))}
                                            </ul>
                                        </section>

                                        <div className="flex justify-between items-end pt-12">
                                            <div>
                                                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase mb-2">Follow up required</p>
                                                <div className="px-4 py-2 bg-rose-50 border border-rose-100 rounded-lg">
                                                    <p className="text-xs font-black text-rose-900">{reportData.medical_information.follow_up || 'As needed'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="w-48 h-12 border-b-2 border-slate-200 dark:border-slate-800 mb-2 relative">
                                                    <p className="absolute -bottom-1 -right-1 text-[10px] text-slate-700 dark:text-slate-300 pointer-events-none italic font-sans">Physician Signature</p>
                                                </div>
                                                <p className="text-[10px] font-sans font-bold text-slate-700 dark:text-slate-300">Electronically Verified by VoxAI</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <footer className="mt-16 text-center border-t border-slate-100 pt-6">
                                        <p className="text-[8px] text-slate-600 dark:text-slate-400 uppercase tracking-[0.3em] font-sans">
                                            This document is for clinical reference only. Validated by certified staff.
                                        </p>
                                    </footer>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Step 5: Complete */}
                {step === 'complete' && (
                    <motion.div key="step5" {...stepVariants} className="glass-card p-20 text-center">
                        <div className="w-24 h-24 premium-gradient rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(14,165,233,0.3)]">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-4xl font-extrabold mb-4">Consultation Finalized!</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-sm mx-auto">
                            The report has been saved and sent to the clinic systems.
                        </p>
                        <button onClick={() => setStep('patient-info')} className="btn-primary px-12">Next Patient</button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
};

export default ConsultationWizard;
