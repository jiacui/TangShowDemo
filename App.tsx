import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { MorningMeasurement } from './components/MorningMeasurement';
import { MealTaskFlow } from './components/MealTaskFlow';
import { GlucoseUploadSection } from './components/GlucoseUpload';
import { UserState, PhaseType, DailyLog, ViewState, GlucoseUpload, UserProfile, MorningStats, MealLog } from './types';
import { Settings, Battery, Signal } from 'lucide-react';

// Constants
const BLANK_PHASE_DAYS = 14;
const STIMULATION_PHASE_DAYS = 42;
const TOTAL_DAYS = BLANK_PHASE_DAYS + STIMULATION_PHASE_DAYS;

const App: React.FC = () => {
  // --- State Management ---
  const [view, setView] = useState<ViewState>('LOGIN');
  
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem('obesity-intervention-state-v2-1');
    if (saved) return JSON.parse(saved);
    return {
      isAuthenticated: false,
      currentDay: 1,
      startDate: new Date().toISOString(),
      logs: {},
      glucoseUploads: []
    };
  });

  useEffect(() => {
    localStorage.setItem('obesity-intervention-state-v2-1', JSON.stringify(userState));
  }, [userState]);

  // Handle Initial Route
  useEffect(() => {
    if (!userState.isAuthenticated) {
      setView('LOGIN');
    } else if (!userState.profile) {
      setView('PROFILE_SETUP');
    } else if (view === 'LOGIN' || view === 'PROFILE_SETUP') {
      setView('DASHBOARD');
    }
  }, [userState.isAuthenticated, userState.profile]);

  // Derived State
  const currentPhase = userState.currentDay <= BLANK_PHASE_DAYS ? PhaseType.BLANK : PhaseType.STIMULATION;
  const currentLog = userState.logs[`Day-${userState.currentDay}`] || { day: userState.currentDay, date: new Date().toISOString(), phase: currentPhase };
  
  // Status Checks
  const isMorningDone = !!currentLog.morningStats;
  const isBreakfastDone = !!currentLog.breakfast?.completedAt;
  const isDinnerDone = !!currentLog.dinner?.completedAt;

  // --- Handlers ---

  const handleLogin = () => {
    setUserState(prev => ({ ...prev, isAuthenticated: true }));
  };

  const handleProfileComplete = (profile: UserProfile) => {
    setUserState(prev => ({ ...prev, profile }));
    setView('DASHBOARD');
  };

  const handleUpdateLog = (updates: Partial<DailyLog>) => {
    const dayKey = `Day-${userState.currentDay}`;
    setUserState(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [dayKey]: {
          ...currentLog,
          ...updates
        }
      }
    }));
    setView('DASHBOARD');
  };

  const handleGlucoseUpload = (upload: GlucoseUpload) => {
    setUserState(prev => ({
      ...prev,
      glucoseUploads: [upload, ...prev.glucoseUploads]
    }));
    setView('DASHBOARD');
  };

  // --- Render Helpers ---

  const renderDashboard = () => (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Mock Status Bar */}
      <div className="bg-white px-6 py-2 flex justify-between items-center text-xs font-bold text-gray-800">
        <span>9:41</span>
        <div className="flex gap-2 text-gray-800">
          <Signal size={14} />
          <span className="text-[10px]">5G</span>
          <Battery size={14} />
        </div>
      </div>

      <div className="flex-1 px-6 pt-8 pb-10 flex flex-col items-center">
         {/* Date / Phase Info */}
         <div className="mb-12 text-center">
           <h2 className="text-gray-500 font-medium mb-1">
             {new Date().toISOString().split('T')[0]} 实验第{userState.currentDay}天
           </h2>
           <h1 className="text-2xl font-bold text-gray-900">
             实验阶段：{currentPhase === PhaseType.BLANK ? '空白期' : '刺激期'}
           </h1>
         </div>

         {/* Task Buttons */}
         <div className="w-full max-w-xs space-y-6">
           <DashboardButton 
             label="每日晨测" 
             done={isMorningDone} 
             onClick={() => setView('MORNING_MEASURE')} 
           />
           <DashboardButton 
             label="早餐实验任务" 
             done={isBreakfastDone} 
             onClick={() => setView('BREAKFAST_TASK')} 
           />
           <DashboardButton 
             label="晚餐实验任务" 
             done={isDinnerDone} 
             onClick={() => setView('DINNER_TASK')} 
           />
           <DashboardButton 
             label="血糖数据上传" 
             done={false} // Always available
             onClick={() => setView('GLUCOSE_UPLOAD')} 
             variant="secondary"
           />
         </div>
      </div>
      
      {/* Dev Reset */}
      <div className="pb-4 text-center">
         <button onClick={() => {
           localStorage.removeItem('obesity-intervention-state-v2');
           window.location.reload();
         }} className="text-xs text-gray-300">Reset App</button>
      </div>
    </div>
  );

  // --- Main Render ---

  if (view === 'LOGIN' || view === 'PROFILE_SETUP') {
    return <Onboarding onLogin={handleLogin} onProfileComplete={handleProfileComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative">
      <style>{`
        .btn-primary {
          @apply py-4 rounded-full font-bold text-white bg-blue-500 shadow-md shadow-blue-200 transition-all active:scale-95 text-center block;
        }
      `}</style>
      
      {view === 'DASHBOARD' && renderDashboard()}

      {view !== 'DASHBOARD' && (
        <div className="pt-6 px-4">
           {/* Top Status Bar Placeholder for sub-pages */}
           <div className="fixed top-0 left-0 right-0 h-6 bg-gray-50 z-10"></div>
           
           {view === 'MORNING_MEASURE' && (
             <MorningMeasurement 
               day={userState.currentDay}
               onSave={(stats) => handleUpdateLog({ morningStats: stats })}
               onBack={() => setView('DASHBOARD')}
             />
           )}

           {view === 'BREAKFAST_TASK' && (
             <MealTaskFlow 
               phase={currentPhase}
               type="BREAKFAST"
               onComplete={(log) => handleUpdateLog({ breakfast: log })}
               onBack={() => setView('DASHBOARD')}
             />
           )}

           {view === 'DINNER_TASK' && (
             <MealTaskFlow 
               phase={currentPhase}
               type="DINNER"
               onComplete={(log) => handleUpdateLog({ dinner: log })}
               onBack={() => setView('DASHBOARD')}
             />
           )}

           {view === 'GLUCOSE_UPLOAD' && (
             <GlucoseUploadSection 
               uploads={userState.glucoseUploads}
               onUpload={handleGlucoseUpload}
               onBack={() => setView('DASHBOARD')}
             />
           )}
        </div>
      )}
    </div>
  );
};

const DashboardButton = ({ label, done, onClick, variant = 'primary' }: any) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full py-4 rounded-full text-sm font-bold border transition-all active:scale-95 shadow-sm relative
        ${variant === 'primary' 
           ? 'bg-white border-gray-200 text-gray-800 hover:border-gray-300' 
           : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300'
        }
        ${done ? 'opacity-50' : ''}
      `}
    >
      {label}
      {done && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></span>
      )}
    </button>
  );
};

export default App;
