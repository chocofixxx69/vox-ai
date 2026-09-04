import axios from 'axios';
import { useEffect, useState } from 'react';
import logo from '../assets/logo-white.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

function HomePage({ onStart }) {
  const [stats, setStats] = useState({ languages: 0, status: 'checking' });

  useEffect(() => {
    checkSystem();
  }, []);

  const checkSystem = async () => {
    try {
      const health = await axios.get(`${API_URL}/health`);
      const langs = await axios.get(`${API_URL}/api/languages`);

      setStats({
        languages: langs.data.count,
        status: health.data.status === 'healthy' ? 'online' : 'offline',
        groqConfigured: health.data.groq_configured
      });
    } catch (error) {
      setStats({ languages: 100, status: 'offline' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <div className="inline-block bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-8">
            <div className="flex items-center justify-center">
              <img src={logo} alt="VoxAI Logo" className="h-24 w-auto object-contain" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            VoxAI
          </h1>

          <p className="text-2xl md:text-3xl text-indigo-200 font-light mb-4">
            Where Conversations Become Care
          </p>

          <p className="text-lg text-indigo-300 max-w-2xl mx-auto mb-8">
            Transform medical consultations into professional reports in 30 seconds.
            Speak in any language, get reports in English.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-12 flex-wrap gap-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${stats.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${stats.status === 'online' ? 'bg-white animate-pulse' : 'bg-white'}`} />
              <span className="text-white font-semibold text-sm uppercase">{stats.status}</span>
            </div>

            <div className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
              <span className="text-white font-semibold text-sm">{stats.languages}+ Languages</span>
            </div>

            <div className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full">
              <span className="text-white font-semibold text-sm">🔒 HIPAA Ready</span>
            </div>
          </div>

          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-2xl font-bold text-indigo-900 bg-white rounded-full overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center">
              Start Consultation
              <svg className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <FeatureCard icon="🎤" title="Record or Upload" description="Record live or upload audio files. We handle the rest." />
          <FeatureCard icon="🌍" title="100+ Languages" description="Speak in any language. Output in English." />
          <FeatureCard icon="⚡" title="30 Second Reports" description="Professional PDF in 30 seconds." />
          <FeatureCard icon="🔒" title="Secure & Private" description="HIPAA compliant. Encrypted." />
          <FeatureCard icon="✏️" title="Doctor Review" description="Edit before sending." />
          <FeatureCard icon="📧" title="Auto Send" description="Email with PDF attachment." />
        </div>

        <div className="text-center mt-16">
          <p className="text-indigo-300 text-sm">
            Powered by Groq AI • 50-100 consultations/day • Production Ready
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-indigo-200 text-sm">{description}</p>
    </div>
  );
}

export default HomePage;
