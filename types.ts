export enum PhaseType {
  BLANK = 'BLANK', // 2 weeks, sham stimulation
  STIMULATION = 'STIMULATION' // 6 weeks, active stimulation
}

export interface UserProfile {
  phoneNumber: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  heightCm: number;
}

export interface MorningStats {
  weight: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  visceralFat?: number;
  bmr?: number; // Basal Metabolic Rate
  submittedAt?: string;
  notes?: string;
}

export interface MealAssessment {
  hunger: number; // 0-100
  fullness: number; // 0-100
  desireToEat: number; // 0-100
}

export interface StimulationSession {
  intensity: number; // 0-10 (0 for Blank phase)
  durationSeconds: number;
  completed: boolean;
  startedAt: string;
}

export interface MealLog {
  preAssessment?: MealAssessment;
  stimulation?: StimulationSession;
  postAssessment?: MealAssessment;
  mealDurationSeconds?: number; // How long they took to eat
  completedAt?: string;
}

export interface AppetiteStats {
  breakfastScore: number;
  dinnerScore: number;
  breakfastTime?: string;
  dinnerTime?: string;
}

export interface DeviceUsageStats {
  confirmed: boolean;
  durationMinutes: number;
  intensityLevel: number;
  timestamp: string;
}

export interface DailyLog {
  day: number;
  date: string;
  phase: PhaseType;
  morningStats?: MorningStats;
  breakfast?: MealLog;
  dinner?: MealLog;
  appetite?: AppetiteStats;
  deviceUsage?: DeviceUsageStats;
}

export interface GlucoseUpload {
  id: string;
  type: 'SENSOR_DATA' | 'REPORT';
  fileName: string;
  uploadDate: string;
  relatedEvent: 'APPLICATION' | 'REMOVAL';
}

export interface UserState {
  isAuthenticated: boolean;
  profile?: UserProfile;
  currentDay: number;
  startDate: string;
  logs: Record<string, DailyLog>;
  glucoseUploads: GlucoseUpload[];
}

export type ViewState = 
  | 'LOGIN' 
  | 'PROFILE_SETUP' 
  | 'DASHBOARD' 
  | 'MORNING_MEASURE' 
  | 'BREAKFAST_TASK' 
  | 'DINNER_TASK' 
  | 'GLUCOSE_UPLOAD';