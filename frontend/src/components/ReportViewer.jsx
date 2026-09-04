// ═══════════════════════════════════════
// REPORT VIEWER - View generated report
// (Optional component for future use)
// ═══════════════════════════════════════

import { Download, FileText } from 'lucide-react';

function ReportViewer({ reportData, pdfUrl }) {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-indigo-600" />
          Medical Report
        </h3>
        
        {pdfUrl && (
          <a
            href={pdfUrl}
            download
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </a>
        )}
      </div>

      <div className="space-y-4">
        {/* Report Summary */}
        {reportData?.summary && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="text-sm text-blue-700">
              <strong>Summary:</strong> {reportData.summary}
            </p>
          </div>
        )}

        {/* Timestamp */}
        {reportData?.timestamp && (
          <p className="text-sm text-gray-600">
            Generated: {new Date(reportData.timestamp).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default ReportViewer;
