import React, { useState } from 'react';
import { Card } from './ui/Card';
import { GlucoseUpload } from '../types';
import { UploadCloud, FileText, Activity, AlertCircle } from 'lucide-react';

interface GlucoseUploadProps {
  uploads: GlucoseUpload[];
  onUpload: (upload: GlucoseUpload) => void;
  onBack: () => void;
}

export const GlucoseUploadSection: React.FC<GlucoseUploadProps> = ({ uploads, onUpload, onBack }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedType, setSelectedType] = useState<'SENSOR_DATA' | 'REPORT'>('SENSOR_DATA');
  const [relatedEvent, setRelatedEvent] = useState<'APPLICATION' | 'REMOVAL'>('APPLICATION');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFile = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      // Mock upload process
      const newUpload: GlucoseUpload = {
        id: Date.now().toString(),
        type: selectedType,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        relatedEvent: relatedEvent
      };
      onUpload(newUpload);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Blood Glucose Data</h2>
        <button onClick={onBack} className="text-blue-600 font-medium hover:underline">Back to Dashboard</button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Protocol Reminder:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Upload <strong>Sensor Data</strong> on the night you apply a new patch.</li>
            <li>Upload <strong>Glucose Report</strong> on the day you remove the patch.</li>
          </ul>
        </div>
      </div>

      <Card title="📤 Upload New Data">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Data Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedType('SENSOR_DATA')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${selectedType === 'SENSOR_DATA' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-200 text-gray-600'}`}
                >
                  Raw Data
                </button>
                <button
                   type="button"
                   onClick={() => setSelectedType('REPORT')}
                   className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${selectedType === 'REPORT' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-200 text-gray-600'}`}
                >
                  Report PDF
                </button>
              </div>
             </div>
             
             <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Context</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRelatedEvent('APPLICATION')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${relatedEvent === 'APPLICATION' ? 'bg-green-50 border-green-500 text-green-700' : 'border-gray-200 text-gray-600'}`}
                >
                  New Patch
                </button>
                <button
                   type="button"
                   onClick={() => setRelatedEvent('REMOVAL')}
                   className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${relatedEvent === 'REMOVAL' ? 'bg-red-50 border-red-500 text-red-700' : 'border-gray-200 text-gray-600'}`}
                >
                  Removed
                </button>
              </div>
             </div>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => handleFile(e.target.files)}
              accept=".csv,.pdf,.json,.txt"
            />
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <UploadCloud size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mt-1">
                Uploading {selectedType === 'SENSOR_DATA' ? 'Raw Data' : 'Report'} for {relatedEvent === 'APPLICATION' ? 'Patch Application' : 'Patch Removal'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="📂 Upload History">
        {uploads.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No uploads yet.</p>
        ) : (
          <div className="space-y-3">
            {uploads.map((upload) => (
              <div key={upload.id} className="flex items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className={`p-2 rounded-lg mr-3 ${upload.type === 'REPORT' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {upload.type === 'REPORT' ? <FileText size={20} /> : <Activity size={20} />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">{upload.fileName}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(upload.uploadDate).toLocaleDateString()} • {upload.relatedEvent}
                  </p>
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                  Uploaded
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
