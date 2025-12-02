import React, { useState } from 'react';
import { DailyLog, PhaseType } from '../types';
import { Card } from './ui/Card';
import { Save, Sun, Utensils, Zap, CheckCircle2 } from 'lucide-react';
import { generateDailyInsight } from '../services/geminiService';

interface DailyLogFormProps {
  currentDay: number;
  currentPhase: PhaseType;
  existingLog?: DailyLog;
  onSave: (log: DailyLog) => void;
  onCancel: () => void;
}

export const DailyLogForm: React.FC<DailyLogFormProps> = ({
  currentDay,
  currentPhase,
  existingLog,
  onSave,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string>("");

  const [formData, setFormData] = useState<DailyLog>(existingLog || {
    day: currentDay,
    date: new Date().toISOString(),
    phase: currentPhase,
    morningStats: {
      weight: 0,
      notes: ''
    },
    appetite: {
      breakfastScore: 50,
      dinnerScore: 50,
      breakfastTime: '08:00',
      dinnerTime: '19:00'
    },
    deviceUsage: {
      confirmed: false,
      durationMinutes: 30,
      intensityLevel: currentPhase === PhaseType.BLANK ? 0 : 5,
      timestamp: new Date().toISOString()
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay and fetch insight
    const aiFeedback = await generateDailyInsight(formData, currentPhase);
    setInsight(aiFeedback);
    
    setTimeout(() => {
      onSave(formData);
      setLoading(false);
    }, 800);
  };

  const handleMorningChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      morningStats: { ...prev.morningStats!, [field]: value }
    }));
  };

  const handleAppetiteChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      appetite: { ...prev.appetite!, [field]: value }
    }));
  };

  const handleDeviceConfirm = () => {
    setFormData(prev => ({
      ...prev,
      deviceUsage: { ...prev.deviceUsage!, confirmed: !prev.deviceUsage?.confirmed }
    }));
  };

  if (insight) {
    return (
      <div className="max-w-md mx-auto py-8 text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
          <CheckCircle2 size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Log Saved!</h2>
          <p className="text-gray-500 mt-2">Day {currentDay} data recorded successfully.</p>
        </div>
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-blue-900 text-sm mb-1">Health Assistant</h4>
              <p className="text-blue-800 italic text-sm">"{insight}"</p>
            </div>
          </div>
        </Card>
        <button 
          onClick={onCancel}
          className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Day {currentDay} Log</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
          currentPhase === PhaseType.STIMULATION 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {currentPhase === PhaseType.BLANK ? 'Observation Phase' : 'Stimulation Phase'}
        </span>
      </div>

      {/* Morning Stats */}
      <Card title="🌅 Morning Metrics">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Morning Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g., 70.5"
              value={formData.morningStats?.weight || ''}
              onChange={(e) => handleMorningChange('weight', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">How are you feeling?</label>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
              placeholder="Any symptoms, sleep quality, or general notes..."
              value={formData.morningStats?.notes || ''}
              onChange={(e) => handleMorningChange('notes', e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Appetite Assessment */}
      <Card title="🍽️ Appetite Assessment">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Breakfast Appetite (0-100)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  value={formData.appetite?.breakfastScore}
                  onChange={(e) => handleAppetiteChange('breakfastScore', parseInt(e.target.value))}
                />
                <span className="w-12 text-center font-bold text-orange-600 bg-orange-50 rounded py-1">
                  {formData.appetite?.breakfastScore}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dinner Appetite (0-100)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  value={formData.appetite?.dinnerScore}
                  onChange={(e) => handleAppetiteChange('dinnerScore', parseInt(e.target.value))}
                />
                <span className="w-12 text-center font-bold text-indigo-600 bg-indigo-50 rounded py-1">
                  {formData.appetite?.dinnerScore}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Device Usage */}
      <Card title="⚡ Device Protocol">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className={`p-4 rounded-full ${formData.deviceUsage?.confirmed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <Zap size={32} fill={formData.deviceUsage?.confirmed ? "currentColor" : "none"} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">
              {currentPhase === PhaseType.BLANK ? 'Wear Device (Off)' : 'Stimulation Session (On)'}
            </h4>
            <p className="text-sm text-gray-500 mt-1">
              {currentPhase === PhaseType.BLANK 
                ? 'Please wear the device for 30 minutes without turning it on.'
                : 'Please wear the device for 30 minutes with stimulation active.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleDeviceConfirm}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              formData.deviceUsage?.confirmed
                ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                : 'bg-white border-2 border-gray-300 text-gray-500 hover:border-gray-400'
            }`}
          >
            {formData.deviceUsage?.confirmed ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 flex justify-center gap-4 shadow-lg z-10">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl font-bold bg-blue-600 text-white shadow-blue-200 shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          {loading ? (
            <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
          ) : (
            <>
              <Save size={20} />
              Save Log
            </>
          )}
        </button>
      </div>
    </form>
  );
};
