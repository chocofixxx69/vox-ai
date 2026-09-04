import { useRef, useState } from 'react';

function FileUpload({ patientInfo, onComplete, apiUrl }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setUploadedFile(file);
      setError(null);
    } else {
      setError('Please upload an audio file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const processUploadedFile = async () => {
    if (!uploadedFile) return;

    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('audio', uploadedFile);
      formData.append('patient_info', JSON.stringify(patientInfo));

      const response = await fetch(`${apiUrl}/api/transcribe`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onComplete(data.report, data.consultation_id);
      } else {
        setError(data.error || 'Processing failed');
      }
    } catch (error) {
      setError('Error processing audio. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {!processing ? (
        <div className="space-y-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {uploadedFile ? uploadedFile.name : 'Click to upload or drag & drop'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              MP3, WAV, M4A, WEBM, OGG (max 200MB)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {uploadedFile && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-10 h-10 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">{uploadedFile.name}</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                  }}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {uploadedFile && (
            <button
              onClick={processUploadedFile}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-300 font-semibold text-lg shadow-xl flex items-center justify-center"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Process Audio File
            </button>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-900 dark:text-white font-semibold text-lg">
                Processing Audio File...
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                🌍 Detecting language • 📝 Transcribing • 🤖 Extracting medical info
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error</h4>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          🌏 <strong>100+ Languages</strong> | 
          🚀 <strong>Real-time Processing</strong> | 
          🔒 <strong>HIPAA Compliant</strong> | 
          📝 <strong>Output in English</strong>
        </p>
      </div>
    </div>
  );
}

export default FileUpload;
