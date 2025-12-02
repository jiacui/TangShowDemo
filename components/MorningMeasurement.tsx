import React, { useState } from 'react';
import { Card } from './ui/Card';
import { MorningStats } from '../types';
import { Save, ChevronLeft } from 'lucide-react';

interface MorningMeasurementProps {
  onSave: (stats: MorningStats) => void;
  onBack: () => void;
  day: number;
}

export const MorningMeasurement: React.FC<MorningMeasurementProps> = ({ onSave, onBack, day }) => {
  const [formData, setFormData] = useState<Partial<MorningStats>>({
    weight: undefined,
    bodyFatPercentage: undefined,
    muscleMass: undefined,
    visceralFat: undefined,
    bmr: undefined,
  });

  const handleChange = (field: keyof MorningStats, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? undefined : parseFloat(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.weight) {
      onSave({
        ...formData,
        weight: formData.weight,
        submittedAt: new Date().toISOString()
      } as MorningStats);
    }
  };

  return (
    <div className="max-w-md mx-auto pb-20 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">每日晨测 (Day {day})</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">体重 (kg) <span className="text-red-500">*</span></label>
            <input
              type="number"
              step="0.1"
              required
              placeholder="e.g. 65.5"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.weight || ''}
              onChange={(e) => handleChange('weight', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">体脂率 (%)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 24.5"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.bodyFatPercentage || ''}
              onChange={(e) => handleChange('bodyFatPercentage', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">肌肉量 (kg)</label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 45.2"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.muscleMass || ''}
              onChange={(e) => handleChange('muscleMass', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内脏脂肪等级</label>
            <input
              type="number"
              step="1"
              placeholder="e.g. 5"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.visceralFat || ''}
              onChange={(e) => handleChange('visceralFat', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">基础代谢率 (kcal/day)</label>
            <input
              type="number"
              step="1"
              placeholder="e.g. 1500"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.bmr || ''}
              onChange={(e) => handleChange('bmr', e.target.value)}
            />
          </div>
        </Card>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          提交
        </button>
      </form>
    </div>
  );
};