// ═══════════════════════════════════════
// TRANSCRIPTION DISPLAY - Show full transcript
// ═══════════════════════════════════════

import { ChevronDown, ChevronUp, FileText, Globe } from 'lucide-react';

function TranscriptionDisplay({ transcription, language, show, onToggle }) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center">
          <FileText className="w-6 h-6 mr-2 text-indigo-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Full Transcription
          </h3>
          {language && (
            <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Globe className="w-3 h-3 mr-1" />
              {language.toUpperCase()}
            </span>
          )}
        </div>
        {show ? (
          <ChevronUp className="w-6 h-6 text-gray-400" />
        ) : (
          <ChevronDown className="w-6 h-6 text-gray-400" />
        )}
      </button>

      {show && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {transcription || 'No transcription available'}
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This is the complete transcription of the consultation
          </p>
        </div>
      )}
    </div>
  );
}

export default TranscriptionDisplay;
