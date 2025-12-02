import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Card } from './ui/Card';

interface OnboardingProps {
  onLogin: () => void;
  onProfileComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onLogin, onProfileComplete }) => {
  const [step, setStep] = useState<'LOGIN' | 'PROFILE'>('LOGIN');

  if (step === 'LOGIN') {
    return <LoginView onNext={() => {
      onLogin();
      setStep('PROFILE');
    }} />;
  }

  return <ProfileView onComplete={onProfileComplete} />;
};

const LoginView = ({ onNext }: { onNext: () => void }) => (
  <div className="min-h-screen bg-white p-6 flex flex-col justify-center max-w-md mx-auto">
    <div className="mb-10 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">用户登录</h1>
      <p className="text-gray-500">肥胖干预实验数据采集系统</p>
    </div>
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
        <input type="tel" className="w-full p-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入手机号" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">验证码</label>
        <div className="flex gap-3">
          <input type="text" className="flex-1 p-4 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500" placeholder="请输入验证码" />
          <button type="button" className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium whitespace-nowrap">获取验证码</button>
        </div>
      </div>
      <button onClick={onNext} className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-200 mt-8">登录</button>
    </div>
  </div>
);

const ProfileView = ({ onComplete }: { onComplete: (p: UserProfile) => void }) => {
  const [form, setForm] = useState<UserProfile>({
    name: '',
    phoneNumber: '', // already authed
    gender: 'MALE',
    age: 30,
    heightCm: 170
  });

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col max-w-md mx-auto pt-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">用户信息</h1>
        <p className="text-gray-500 text-sm">请完善您的基础信息以便建立档案</p>
      </div>
      <div className="space-y-6 flex-1">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
           <label className="text-gray-800">用户名称</label>
           <input 
             className="text-right outline-none text-gray-600" 
             placeholder="请填写"
             value={form.name}
             onChange={e => setForm({...form, name: e.target.value})}
            />
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
           <label className="text-gray-800">性别</label>
           <div className="flex gap-4">
             <label className="flex items-center gap-2">
               <input type="radio" name="gender" checked={form.gender === 'MALE'} onChange={() => setForm({...form, gender: 'MALE'})} />
               <span className="text-sm">男</span>
             </label>
             <label className="flex items-center gap-2">
               <input type="radio" name="gender" checked={form.gender === 'FEMALE'} onChange={() => setForm({...form, gender: 'FEMALE'})} />
               <span className="text-sm">女</span>
             </label>
           </div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
           <label className="text-gray-800">年龄</label>
           <div className="flex items-center gap-2">
             <input 
               type="number" 
               className="text-right outline-none text-gray-600 w-20" 
               value={form.age}
               onChange={e => setForm({...form, age: parseInt(e.target.value)})}
              />
              <span className="text-gray-400">岁</span>
           </div>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-gray-100">
           <label className="text-gray-800">身高</label>
           <div className="flex items-center gap-2">
             <input 
               type="number" 
               className="text-right outline-none text-gray-600 w-20" 
               value={form.heightCm}
               onChange={e => setForm({...form, heightCm: parseInt(e.target.value)})}
              />
              <span className="text-gray-400">厘米</span>
           </div>
        </div>
      </div>
      
      <button 
        onClick={() => onComplete(form)}
        className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-200 mb-8"
      >
        提交
      </button>
    </div>
  );
};
