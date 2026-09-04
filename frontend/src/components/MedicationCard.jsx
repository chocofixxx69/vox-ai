// ═══════════════════════════════════════
// MEDICATION CARD - Display medication info
// ═══════════════════════════════════════

import { AlertCircle, Clock, Pill } from 'lucide-react';

function MedicationCard({ medication, index }) {
  return (
    <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Pill className="w-5 h-5 text-indigo-600 mr-2" />
            <h4 className="text-lg font-semibold text-gray-900">
              {medication.name || 'Unknown Medication'}
            </h4>
          </div>

          <div className="space-y-2 ml-7">
            {/* Dosage */}
            {medication.dosage && (
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 w-24">Dosage:</span>
                <span className="text-gray-900">{medication.dosage}</span>
              </div>
            )}

            {/* Duration */}
            {medication.duration && (
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 text-gray-500 mr-1" />
                <span className="font-medium text-gray-700 w-24">Duration:</span>
                <span className="text-gray-900">{medication.duration}</span>
              </div>
            )}

            {/* Instructions */}
            {medication.instructions && (
              <div className="flex items-start text-sm">
                <AlertCircle className="w-4 h-4 text-blue-500 mr-1 mt-0.5" />
                <span className="font-medium text-gray-700 w-24">Instructions:</span>
                <span className="text-gray-900 flex-1">{medication.instructions}</span>
              </div>
            )}
          </div>
        </div>

        {/* Medication Number Badge */}
        <div className="ml-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
            {index + 1}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MedicationCard;
