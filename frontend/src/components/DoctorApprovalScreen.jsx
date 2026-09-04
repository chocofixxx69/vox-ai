import { useState } from 'react';
import MedicationCard from './MedicationCard';
import TranscriptionDisplay from './TranscriptionDisplay';

function DoctorApprovalScreen({ reportData, patientInfo, approvalId, onApprovalComplete, apiUrl }) {
  const [sending, setSending] = useState(false);
  const [editMode, setEditMode] = useState({ diagnoses: false, medications: false });
  const [editedReport, setEditedReport] = useState(reportData);
  const [showTranscription, setShowTranscription] = useState(false);

  const medicalInfo = editedReport?.medical_information || {};

  const toggleEdit = (section) => {
    setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDiagnosesChange = (value) => {
    const diagnosesArray = value.split('\n').filter(d => d.trim());
    setEditedReport(prev => ({
      ...prev,
      medical_information: { ...prev.medical_information, diagnoses: diagnosesArray }
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...(medicalInfo.medications || [])];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setEditedReport(prev => ({
      ...prev,
      medical_information: { ...prev.medical_information, medications: updatedMedications }
    }));
  };

  const addMedication = () => {
    const newMed = { name: '', dosage: '', frequency: '', timing: '', duration: '', instructions: '' };
    setEditedReport(prev => ({
      ...prev,
      medical_information: {
        ...prev.medical_information,
        medications: [...(prev.medical_information.medications || []), newMed]
      }
    }));
  };

  const removeMedication = (index) => {
    const updatedMedications = (medicalInfo.medications || []).filter((_, i) => i !== index);
    setEditedReport(prev => ({
      ...prev,
      medical_information: { ...prev.medical_information, medications: updatedMedications }
    }));
  };

  const handleApprove = async () => {
    setSending(true);
    try {
      const response = await fetch(`${apiUrl}/api/approve-and-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approval_id: approvalId,
          report_data: editedReport,
          patient_info: patientInfo
        })
      });
      
      const data = await response.json();
      onApprovalComplete({ pdf_filename: data.pdf_filename });
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Doctor Approval Required</h2>
          <p className="text-gray-600 dark:text-gray-300">Review and edit before sending</p>
        </div>

        {/* Language Detection */}
        {reportData?.translation_note && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-blue-800 dark:text-blue-200 text-sm flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {reportData.translation_note}
            </p>
          </div>
        )}

        {/* Patient Info */}
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-3">Patient Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="text-indigo-700 dark:text-indigo-300">Name:</span> <span className="ml-2 font-medium text-indigo-900 dark:text-indigo-100">{patientInfo?.name}</span></div>
            <div><span className="text-indigo-700 dark:text-indigo-300">Age:</span> <span className="ml-2 font-medium text-indigo-900 dark:text-indigo-100">{patientInfo?.age}</span></div>
            <div><span className="text-indigo-700 dark:text-indigo-300">Phone:</span> <span className="ml-2 font-medium text-indigo-900 dark:text-indigo-100">{patientInfo?.phone}</span></div>
            {patientInfo?.email && <div><span className="text-indigo-700 dark:text-indigo-300">Email:</span> <span className="ml-2 font-medium text-indigo-900 dark:text-indigo-100">{patientInfo.email}</span></div>}
          </div>
        </div>

        {/* Transcription Toggle */}
        <button
          onClick={() => setShowTranscription(!showTranscription)}
          className="w-full mb-6 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 py-3 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900 transition-all font-semibold flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showTranscription ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            )}
          </svg>
          {showTranscription ? 'Hide' : 'Show'} Full Transcription
        </button>

        {/* Transcription Display */}
        {showTranscription && (
          <div className="mb-6">
            <TranscriptionDisplay
              transcription={reportData?.transcription}
              languageDetected={reportData?.language_detected}
              translationNote={reportData?.translation_note}
            />
          </div>
        )}

        <div className="space-y-6 mb-8">
          {/* DIAGNOSES */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Diagnoses
              </h3>
              <button onClick={() => toggleEdit('diagnoses')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-semibold">
                {editMode.diagnoses ? '✓ Save' : '✏️ Edit'}
              </button>
            </div>
            {editMode.diagnoses ? (
              <textarea
                value={(medicalInfo.diagnoses || []).join('\n')}
                onChange={(e) => handleDiagnosesChange(e.target.value)}
                className="w-full border-2 border-indigo-300 dark:border-indigo-700 rounded-lg p-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                rows="4"
                placeholder="Enter each diagnosis on a new line"
              />
            ) : (
              <ul className="space-y-2">
                {(medicalInfo.diagnoses || []).map((d, i) => <li key={i} className="text-gray-700 dark:text-gray-300">• {d}</li>) || <li className="text-gray-500 italic">No diagnoses</li>}
              </ul>
            )}
          </div>

          {/* SYMPTOMS */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Symptoms Reported
            </h3>
            <ul className="space-y-2">
              {(medicalInfo.symptoms || []).map((s, i) => <li key={i} className="text-gray-700 dark:text-gray-300">• {s}</li>) || <li className="text-gray-500 italic">No symptoms</li>}
            </ul>
          </div>

          {/* MEDICATIONS */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Medications Prescribed
              </h3>
              <button onClick={() => toggleEdit('medications')} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-semibold">
                {editMode.medications ? '✓ Save' : '✏️ Edit'}
              </button>
            </div>
            <div className="space-y-4">
              {(medicalInfo.medications || []).map((med, idx) => (
                <MedicationCard
                  key={idx}
                  medication={med}
                  index={idx}
                  isEditing={editMode.medications}
                  onChange={handleMedicationChange}
                  onRemove={removeMedication}
                />
              ))}
              {editMode.medications && (
                <button onClick={addMedication} className="w-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 py-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 font-semibold flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Medication
                </button>
              )}
            </div>
          </div>

          {/* RECOMMENDATIONS */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recommendations
            </h3>
            <ul className="space-y-2">
              {(medicalInfo.recommendations || []).map((r, i) => <li key={i} className="text-gray-700 dark:text-gray-300">✓ {r}</li>) || <li className="text-gray-500 italic">No recommendations</li>}
            </ul>
          </div>
        </div>

        {/* Approve Button */}
        <button onClick={handleApprove} disabled={sending} className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-5 px-6 rounded-xl hover:from-green-700 hover:to-green-800 font-bold text-xl shadow-2xl disabled:opacity-50 flex items-center justify-center space-x-3">
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Approve & Send to Patient</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default DoctorApprovalScreen;
