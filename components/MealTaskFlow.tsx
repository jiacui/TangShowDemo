import React, { useState, useEffect } from 'react';
import { PhaseType, MealLog, MealAssessment, StimulationSession } from '../types';
import { Card } from './ui/Card';
import { ChevronLeft, Play, Square, Timer, CheckCircle2, Zap } from 'lucide-react';

interface MealTaskFlowProps {
  phase: PhaseType;
  type: 'BREAKFAST' | 'DINNER';
  onComplete: (log: MealLog) => void;
  onBack: () => void;
}

type Step = 'PRE_ASSESS' | 'STIMULATION' | 'POST_ASSESS' | 'MEAL_TIMER' | 'COMPLETED';

export const MealTaskFlow: React.FC<MealTaskFlowProps> = ({ phase, type, onComplete, onBack }) => {
  const [step, setStep] = useState<Step>('PRE_ASSESS');
  const [data, setData] = useState<Partial<MealLog>>({});

  const title = type === 'BREAKFAST' ? '早餐实验任务' : '晚餐实验任务';

  const handleAssessmentSubmit = (key: 'preAssessment' | 'postAssessment', values: MealAssessment) => {
    setData(prev => ({ ...prev, [key]: values }));
    if (key === 'preAssessment') setStep('STIMULATION');
    if (key === 'postAssessment') setStep('MEAL_TIMER');
  };

  const handleStimulationComplete = (session: StimulationSession) => {
    setData(prev => ({ ...prev, stimulation: session }));
    setStep('POST_ASSESS');
  };

  const handleMealComplete = (duration: number) => {
    const finalData = {
      ...data,
      mealDurationSeconds: duration,
      completedAt: new Date().toISOString()
    } as MealLog;
    onComplete(finalData);
  };

  return (
    <div className="max-w-md mx-auto pb-20 animate-fade-in">
       <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>

      {step === 'PRE_ASSESS' && (
        <AssessmentStep 
          title="第一步：刺激前评估" 
          onSubmit={(vals) => handleAssessmentSubmit('preAssessment', vals)} 
        />
      )}

      {step === 'STIMULATION' && (
        <StimulationStep 
          phase={phase}
          title="第二步：刺激任务"
          onSubmit={handleStimulationComplete}
        />
      )}

      {step === 'POST_ASSESS' && (
        <AssessmentStep 
          title="第三步：刺激后评估" 
          onSubmit={(vals) => handleAssessmentSubmit('postAssessment', vals)} 
        />
      )}

      {step === 'MEAL_TIMER' && (
        <MealTimerStep 
          title="第四步：用餐"
          onSubmit={handleMealComplete}
        />
      )}
    </div>
  );
};

// --- Sub Components ---

const AssessmentStep: React.FC<{ title: string, onSubmit: (vals: MealAssessment) => void }> = ({ title, onSubmit }) => {
  const [hunger, setHunger] = useState(50);
  const [fullness, setFullness] = useState(50);
  const [desire, setDesire] = useState(50);

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <Card className="space-y-8 py-8">
        <SliderField label="饥饿感" left="毫无饥饿感" right="极度饥饿" value={hunger} onChange={setHunger} />
        <SliderField label="饱腹感" left="极不饱腹" right="极度饱腹" value={fullness} onChange={setFullness} />
        <SliderField label="想吃程度" left="完全不想吃" right="很想吃" value={desire} onChange={setDesire} />
      </Card>
      <button onClick={() => onSubmit({ hunger, fullness, desireToEat: desire })} className="w-full btn-primary">下一步</button>
    </div>
  );
};

const SliderField = ({ label, left, right, value, onChange }: any) => (
  <div>
    <div className="flex justify-between mb-2">
      <label className="font-bold text-gray-800">{label}</label>
      <span className="font-mono text-blue-600">{value}</span>
    </div>
    <input 
      type="range" min="0" max="100" 
      value={value} onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
    <div className="flex justify-between text-xs text-gray-400 mt-1">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  </div>
);

const StimulationStep: React.FC<{ phase: PhaseType, title: string, onSubmit: (s: StimulationSession) => void }> = ({ phase, title, onSubmit }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(phase === PhaseType.BLANK ? 1800 : 1800); // 30 mins
  const [intensity, setIntensity] = useState(phase === PhaseType.BLANK ? 0 : 4); // Default intensity

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleFinish = () => {
    onSubmit({
      intensity,
      durationSeconds: 1800 - timeLeft,
      completed: true,
      startedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <Card className="flex flex-col items-center py-10 space-y-6">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${isActive ? 'border-blue-500 animate-pulse bg-blue-50' : 'border-gray-200'}`}>
          <Zap size={48} className={isActive ? 'text-blue-500' : 'text-gray-300'} />
        </div>
        
        <div className="text-center px-4">
          <p className="text-gray-600 mb-2">
            {phase === PhaseType.BLANK 
              ? "按图佩戴电极，涂导电膏，打开刺激设备，保持设备在关闭状态。" 
              : "按图佩戴电极，涂导电膏，打开刺激设备，在APP调整电流至有明显刺激、无明显刺痛感"}
          </p>
          <div className="text-sm bg-gray-100 py-1 px-3 rounded-full inline-block text-gray-500 mt-2">
            设备状态: {isActive ? '进行中' : '未开始'} | 电流档位: {intensity}
          </div>
        </div>

        {isActive && (
          <div className="text-4xl font-mono font-bold text-gray-800">
            {formatTime(timeLeft)}
          </div>
        )}
      </Card>

      {!isActive && timeLeft === 1800 ? (
        <button onClick={() => setIsActive(true)} className="w-full btn-primary">
          开始刺激
        </button>
      ) : (
        <button onClick={handleFinish} className="w-full btn-primary bg-green-600 hover:bg-green-700">
          {timeLeft === 0 ? '完成刺激' : '结束刺激 (测试用)'}
        </button>
      )}
    </div>
  );
};

const MealTimerStep: React.FC<{ title: string, onSubmit: (dur: number) => void }> = ({ title, onSubmit }) => {
  const [isEating, setIsEating] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isEating) {
      interval = setInterval(() => setElapsed(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isEating]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <Card className="flex flex-col items-center py-12 space-y-6">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
          <Timer size={40} />
        </div>
        <p className="text-center text-gray-600 px-8">
          {isEating 
            ? "正在用餐中..." 
            : "现在您可以摘下设备，准备用餐。点击“开始用餐”按钮开始进食。"}
        </p>
        
        {isEating && (
          <div className="text-4xl font-mono font-bold text-gray-800">
            {formatTime(elapsed)}
          </div>
        )}
      </Card>

      {!isEating ? (
         <button onClick={() => setIsEating(true)} className="w-full btn-primary">
           开始用餐
         </button>
      ) : (
        <button onClick={() => onSubmit(elapsed)} className="w-full btn-primary bg-orange-500 hover:bg-orange-600">
           结束用餐
        </button>
      )}
    </div>
  );
};
