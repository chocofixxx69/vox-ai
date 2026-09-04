// ═══════════════════════════════════════════════════════════
// LIVE RECORDER COMPONENT
// Handles real-time audio recording and transcription
// ═══════════════════════════════════════════════════════════

import axios from 'axios';
import { Loader, Mic, Square, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const API_URL = 'http://localhost:5001';

function LiveRecorder({ patientInfo, onComplete, onStatusChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const socketRef = useRef(null);
  const timerRef = useRef(null);

  // ⭐⭐ Connect to WebSocket for live transcription
  useEffect(() => {
    socketRef.current = io(API_URL);

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to server');
    });

    socketRef.current.on('transcription_update', (data) => {
      console.log('📝 Live transcription:', data.text);
      onStatusChange(`Transcribing: ${data.text.substring(0, 50)}...`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [onStatusChange]);

  // ⭐⭐ START RECORDING
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          
          // Send audio chunk to server for live transcription
          if (socketRef.current) {
            const reader = new FileReader();
            reader.onloadend = () => {
              socketRef.current.emit('audio_chunk', {
                audio: reader.result,
                patient_info: patientInfo
              });
            };
            reader.readAsDataURL(event.data);
          }
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorderRef.current.start(1000); // Send chunk every 1 second
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      onStatusChange('Recording in progress...');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  // ⭐⭐ STOP RECORDING
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      onStatusChange('Recording stopped. Processing audio...');
    }
  };

  // ⭐⭐ PROCESS RECORDING
  const processRecording = async () => {
    if (!audioBlob) {
      alert('No recording available');
      return;
    }

    setProcessing(true);
    onStatusChange('🔄 Processing audio with AI...');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('patient_info', JSON.stringify(patientInfo));

      const response = await axios.post(`${API_URL}/api/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 300000 // 5 minutes timeout
      });

      console.log('✅ Processing complete:', response.data);
      
      onStatusChange('✅ Processing complete!');
      
      // Call parent handler with report data
      if (response.data.report) {
        onComplete(response.data.report, response.data.consultation_id);
      }
      
    } catch (error) {
      console.error('❌ Processing error:', error);
      onStatusChange('❌ Error processing audio. Please try again.');
      alert('Error processing audio: ' + (error.response?.data?.error || error.message));
    } finally {
      setProcessing(false);
    }
  };

  // ⭐ Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
          isRecording ? 'bg-red-100 recording-pulse' : 'bg-indigo-100'
        }`}>
          {processing ? (
            <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
          ) : (
            <Mic className={`w-12 h-12 ${isRecording ? 'text-red-600' : 'text-indigo-600'}`} />
          )}
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {isRecording ? '🔴 Recording in Progress' : 'Ready to Record'}
        </h2>
        
        <p className="text-gray-600 mb-4">
          Patient: <span className="font-semibold">{patientInfo.name}</span>
        </p>

        {/* Timer */}
        {isRecording && (
          <div className="text-4xl font-mono font-bold text-red-600 mb-4">
            {formatTime(recordingTime)}
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-medium">Recording...</span>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!isRecording && !audioBlob && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click the microphone button to start recording</li>
            <li>• Conduct your consultation naturally</li>
            <li>• Click stop when finished</li>
            <li>• AI will automatically transcribe and extract medical information</li>
          </ul>
        </div>
      )}

      {/* Control Buttons */}
      <div className="space-y-4">
        {!isRecording && !audioBlob && (
          <button
            onClick={startRecording}
            disabled={processing}
            className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Mic className="w-6 h-6" />
            <span>Start Recording</span>
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="w-full bg-gray-800 text-white py-4 px-6 rounded-lg hover:bg-gray-900 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Square className="w-6 h-6" />
            <span>Stop Recording</span>
          </button>
        )}

        {audioBlob && !processing && (
          <div className="space-y-3">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium text-center">
                ✅ Recording captured ({formatTime(recordingTime)})
              </p>
            </div>

            <button
              onClick={processRecording}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Upload className="w-6 h-6" />
              <span>Process with AI</span>
            </button>

            <button
              onClick={() => {
                setAudioBlob(null);
                setRecordingTime(0);
              }}
              className="w-full bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            >
              Record Again
            </button>
          </div>
        )}

        {processing && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
            <Loader className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-indigo-900 font-medium">Processing with AI...</p>
            <p className="text-indigo-700 text-sm mt-2">This may take 30-60 seconds</p>
          </div>
        )}
      </div>

      {/* Audio preview */}
      {audioBlob && (
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-600 mb-2">Audio Preview:</p>
          <audio 
            controls 
            src={URL.createObjectURL(audioBlob)}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}

export default LiveRecorder;
