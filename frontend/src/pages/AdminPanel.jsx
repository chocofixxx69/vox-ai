import React, { useState, useEffect } from 'react';
import { Building2, UserPlus, Shield, Activity, Search, Plus, Trash2, Edit, Loader2, Copy, CheckCircle2, Users, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import TeamManagement from '../components/TeamManagement';
import axios from 'axios';
import { countries } from '../constants/countries';

const SearchableCountrySelect = ({ value, onChange, placeholder = "Select Country" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = React.useRef(null);

    const filteredCountries = countries.filter(c =>
        c.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="input-field cursor-pointer flex justify-between items-center bg-slate-950"
            >
                <span className={value ? "text-slate-200" : "text-slate-500"}>
                    {value || placeholder}
                </span>
                <Search className="w-4 h-4 text-slate-500" />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-[300] w-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-2 border-b border-slate-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search countries..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs outline-none focus:border-sky-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                            {filteredCountries.length > 0 ? (
                                filteredCountries.map((country) => (
                                    <button
                                        key={country}
                                        onClick={() => {
                                            onChange(country);
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors hover:bg-white/5 
                                            ${value === country ? 'text-sky-400 bg-sky-500/5' : 'text-slate-400'}`}
                                    >
                                        {country}
                                    </button>
                                ))
                            ) : (
                                <div className="p-4 text-center text-xs text-slate-500 italic">No countries found</div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminPanel = () => {
    const [clinics, setClinics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddClinic, setShowAddClinic] = useState(false);

    // Form State for New Clinic
    const [newClinic, setNewClinic] = useState({ name: '', adminEmail: '', region: 'India', plan: 'Enterprise' });
    const [creating, setCreating] = useState(false);
    const [adminOnboardingLink, setAdminOnboardingLink] = useState('');

    // State for Editing Clinic
    const [showEditClinic, setShowEditClinic] = useState(false);
    const [editClinicData, setEditClinicData] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Manual Onboarding State
    const [inviteData, setInviteData] = useState({ email: '', clinicId: '', role: 'doctor' });
    const [generatedLink, setGeneratedLink] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Staff View State
    const [selectedClinicId, setSelectedClinicId] = useState(null);
    const [selectedClinicName, setSelectedClinicName] = useState('');

    useEffect(() => {
        fetchClinics();
    }, []);

    const fetchClinics = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/admin/clinics');
            setClinics(response.data);
        } catch (err) {
            console.error("Failed to fetch clinics", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClinic = async () => {
        if (!newClinic.name || !newClinic.adminEmail) {
            alert("Please fill in all required fields.");
            return;
        }
        setCreating(true);
        try {
            const response = await axios.post('http://localhost:5001/api/admin/create-clinic', {
                name: newClinic.name,
                admin_email: newClinic.adminEmail
            });
            setAdminOnboardingLink(response.data.onboarding_link);
            // Don't close modal yet so they can copy the link
            // setShowAddClinic(false);
            // setNewClinic({ name: '', adminEmail: '', region: 'India', plan: 'Enterprise' });
            fetchClinics();
        } catch (err) {
            alert("Failed to create clinic. Check console for details.");
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    const handleGenerateLink = async () => {
        if (!inviteData.email || !inviteData.clinicId) {
            alert("Please provide both an email and a clinic.");
            return;
        }
        setIsGenerating(true);
        try {
            const response = await axios.post('http://localhost:5001/api/admin/generate-invite-link', {
                email: inviteData.email,
                clinic_id: inviteData.clinicId,
                role: inviteData.role
            });
            setGeneratedLink(response.data.invite_link);
        } catch (err) {
            alert("Failed to generate link.");
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteClinic = async (clinicId) => {
        if (!window.confirm("ARE YOU SURE? This will permanently delete the clinic and ALL associated data (Staff, Patients, Consultations). This cannot be undone.")) {
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5001/api/admin/clinics/${clinicId}`);
            if (response.data.success) {
                alert("Clinic and all associated data deleted successfully.");
                fetchClinics();
            }
        } catch (err) {
            console.error("Failed to delete clinic", err);
            alert("Failed to delete clinic. Check console for details.");
        }
    };

    const handleUpdateClinic = async () => {
        if (!editClinicData.name) {
            alert("Clinic name is required.");
            return;
        }
        setUpdating(true);
        try {
            const response = await axios.patch(`http://localhost:5001/api/admin/clinics/${editClinicData.id}`, {
                name: editClinicData.name,
                location: editClinicData.location,
                plan: editClinicData.plan,
                phone: editClinicData.phone,
                website: editClinicData.website
            });
            if (response.data.success) {
                alert("Clinic updated successfully.");
                setShowEditClinic(false);
                fetchClinics();
            }
        } catch (err) {
            console.error("Failed to update clinic", err);
            alert("Failed to update clinic.");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-8 text-slate-200">
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                    <Shield className="text-sky-400 w-10 h-10" />
                    <div>
                        <h1 className="text-3xl font-bold">Master Admin</h1>
                        <p className="text-slate-500 text-sm italic">SaaS Management Suite</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <button onClick={() => setShowAddClinic(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Add New Clinic
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 🏥 Clinics Overview */}
                <section className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Building2 className="text-sky-400" /> Active Clinics</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input type="text" placeholder="Search clinics..." className="bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-sky-500" />
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-sky-400 w-10 h-10" /></div>
                        ) : clinics.length === 0 ? (
                            <div className="glass-card p-12 text-center text-slate-500">No clinics registered yet.</div>
                        ) : (
                            clinics.map((clinic) => (
                                <motion.div
                                    key={clinic.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card p-6 flex items-center justify-between group hover:border-slate-500 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800">
                                            <Activity className="text-sky-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">{clinic.name}</h3>
                                            <p className="text-sm text-slate-500 flex items-center gap-2">
                                                <MapPin className="w-3 h-3" /> {clinic.location || 'Global'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-12 items-center flex-1 justify-end mr-8">
                                        {/* 💳 Plan Column */}
                                        <div className="hidden md:block text-center px-4">
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1 opacity-50">Current Plan</p>
                                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black border tracking-tight
                                                ${clinic.plan === 'Enterprise' ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                                                    clinic.plan === 'Standard' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' :
                                                        'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                                {clinic.plan || 'ENTERPRISE'}
                                            </span>
                                        </div>

                                        {/* 👥 Staff Column */}
                                        <button
                                            onClick={() => {
                                                setSelectedClinicId(clinic.id);
                                                setSelectedClinicName(clinic.name);
                                            }}
                                            className="text-center group-hover:bg-sky-500/5 p-2 px-4 rounded-xl transition-colors border border-transparent hover:border-sky-500/10"
                                        >
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1 opacity-50">Staff Members</p>
                                            <div className="flex items-center gap-2 justify-center">
                                                <p className="text-xl font-bold text-slate-200">{clinic.doctors || 0}</p>
                                                <Users className="w-4 h-4 text-sky-500" />
                                            </div>
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditClinicData({ ...clinic });
                                                setShowEditClinic(true);
                                            }}
                                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-5 h-5 text-slate-400" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClinic(clinic.id)}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-400" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* 👤 Manual Invitations / Quick Stats */}
                <section className="space-y-8">
                    <div className="glass-card p-8">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><UserPlus className="text-indigo-400" /> Manual Onboarding</h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Doctor Email</label>
                                <input
                                    type="email"
                                    placeholder="doctor@clinic.com"
                                    className="input-field"
                                    value={inviteData.email}
                                    onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Assign Clinic</label>
                                <select
                                    className="input-field bg-slate-950 appearance-none"
                                    value={inviteData.clinicId}
                                    onChange={(e) => setInviteData({ ...inviteData, clinicId: e.target.value })}
                                >
                                    <option value="">Select Hospital/Clinic</option>
                                    {clinics.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Assign Role</label>
                                <select
                                    className="input-field bg-slate-950 appearance-none"
                                    value={inviteData.role}
                                    onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                                >
                                    <option value="doctor">Medical Doctor</option>
                                    <option value="admin">Clinic Admin / Manager</option>
                                </select>
                            </div>

                            {generatedLink ? (
                                <div className="mt-6 space-y-3">
                                    <div className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Secure Invite Link Generated</div>
                                    <div className="flex gap-2">
                                        <input
                                            readOnly
                                            value={generatedLink}
                                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-[10px] w-full text-slate-300 font-mono overflow-x-auto"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                                            title="Copy to clipboard"
                                        >
                                            <Copy className="w-4 h-4 text-slate-300" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setGeneratedLink('')}
                                        className="text-[10px] text-slate-500 hover:text-slate-300 underline underline-offset-4"
                                    >
                                        Generate New
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                                    onClick={handleGenerateLink}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : "Generate Invite Link"}
                                </button>
                            )}
                        </form>
                        <p className="text-[10px] text-slate-500 mt-6 text-center italic">
                            Notice: Manual onboarding requires authentication confirmation.
                            Links expire in 24 hours.
                        </p>
                    </div>

                    <div className="glass-card p-8 premium-gradient border-0 text-white">
                        <h3 className="text-lg font-bold mb-2">System Health</h3>
                        <div className="space-y-4 mt-6">
                            <div className="flex justify-between text-sm">
                                <span>Database</span>
                                <span className="font-bold">Online</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Transcription Service</span>
                                <span className="font-bold">Active</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>AI Extraction</span>
                                <span className="font-bold">Online</span>
                            </div>
                        </div>
                    </div>
                </section >
            </main >

            {
                showAddClinic && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card p-10 max-w-lg w-full"
                        >
                            <h2 className="text-2xl font-bold mb-6">Register New Clinic Cluster</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Clinic Identity</label>
                                    <input
                                        type="text"
                                        placeholder="Clinic Name (e.g. Mayo Clinic)"
                                        className="input-field"
                                        value={newClinic.name}
                                        onChange={(e) => setNewClinic({ ...newClinic, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Onboard Primary Admin (Clinic Manager)</label>
                                    <input
                                        type="email"
                                        placeholder="admin@clinic.com"
                                        className="input-field"
                                        value={newClinic.adminEmail}
                                        onChange={(e) => setNewClinic({ ...newClinic, adminEmail: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Region / Country</label>
                                        <SearchableCountrySelect
                                            value={newClinic.region}
                                            onChange={(val) => setNewClinic({ ...newClinic, region: val })}
                                            placeholder="Select Country"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Billing Plan</label>
                                        <select
                                            className="input-field bg-slate-950"
                                            value={newClinic.plan}
                                            onChange={(e) => setNewClinic({ ...newClinic, plan: e.target.value })}
                                        >
                                            <option>Enterprise</option>
                                            <option>Standard</option>
                                        </select>
                                    </div>
                                </div>
                                {adminOnboardingLink ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl mt-6"
                                    >
                                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-4">
                                            <CheckCircle2 className="w-5 h-5" /> Clinic Created Successfully!
                                        </div>
                                        <p className="text-xs text-slate-400 mb-4">Copy this link and send it to the Clinic Manager ({newClinic.adminEmail}) so they can set their password.</p>
                                        <div className="flex gap-2">
                                            <input
                                                readOnly
                                                value={adminOnboardingLink}
                                                className="w-full text-[10px] bg-slate-900 border border-emerald-500/20 px-3 py-2 rounded-lg text-slate-300 font-mono"
                                            />
                                            <button
                                                onClick={() => { navigator.clipboard.writeText(adminOnboardingLink); alert("Admin Link Copied!"); }}
                                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => { setShowAddClinic(false); setAdminOnboardingLink(''); setNewClinic({ name: '', adminEmail: '', region: 'India', plan: 'Enterprise' }); }}
                                            className="w-full mt-6 py-3 text-slate-400 hover:text-white text-xs font-medium"
                                        >
                                            Done
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="flex gap-4 mt-8">
                                        <button onClick={() => setShowAddClinic(false)} className="btn-secondary w-full">Cancel</button>
                                        <button
                                            onClick={handleCreateClinic}
                                            disabled={creating}
                                            className="btn-primary w-full shadow-lg flex items-center justify-center gap-2"
                                        >
                                            {creating ? <Loader2 className="animate-spin w-5 h-5" /> : "Create Instance"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )
            }
            {/* 📝 Edit Clinic Modal */}
            {
                showEditClinic && editClinicData && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="glass-card p-10 max-w-lg w-full"
                        >
                            <h2 className="text-2xl font-bold mb-6">Edit Clinic Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Clinic Name</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={editClinicData.name}
                                        onChange={(e) => setEditClinicData({ ...editClinicData, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Region / Country</label>
                                        <SearchableCountrySelect
                                            value={editClinicData.location || ''}
                                            onChange={(val) => setEditClinicData({ ...editClinicData, location: val })}
                                            placeholder="Select Country"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Billing Plan</label>
                                        <select
                                            className="input-field bg-slate-950"
                                            value={editClinicData.plan || 'Enterprise'}
                                            onChange={(e) => setEditClinicData({ ...editClinicData, plan: e.target.value })}
                                        >
                                            <option>Enterprise</option>
                                            <option>Standard</option>
                                            <option>Starter</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-8">
                                    <button onClick={() => setShowEditClinic(false)} className="btn-secondary w-full">Cancel</button>
                                    <button
                                        onClick={handleUpdateClinic}
                                        disabled={updating}
                                        className="btn-primary w-full shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {updating ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )
            }

            {/* 👥 Staff Management Modal */}
            <AnimatePresence>
                {selectedClinicId && (
                    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-white/5 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedClinicName}</h2>
                                    <p className="text-slate-500 text-sm">Managing staff and invitations for this clinic</p>
                                </div>
                                <button
                                    onClick={() => setSelectedClinicId(null)}
                                    className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                <TeamManagement clinicId={selectedClinicId} />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default AdminPanel;
