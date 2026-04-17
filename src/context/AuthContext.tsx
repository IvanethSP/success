import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { demoUsers, type User } from '../data/users';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  loginWithGoogle: () => void;
  register: (name: string, email: string, password: string, referredBy?: string) => boolean;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addWeightEntry: (weight: number) => void;
  logDay: (completed: boolean) => void;
  editDayStatus: (date: string, completed: boolean) => void;
  addWater: (date: string, glasses: number) => void;
  addExercise: (date: string, menu: string, calories: number) => void;
  addGlucose: (glucose: number) => void;
  addBloodPressure: (systolic: number, diastolic: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('success_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('success_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('success_user');
    }
  }, [user]);

  const login = (email: string, password: string): boolean => {
    const found = demoUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    const registered = JSON.parse(localStorage.getItem('success_registered') || '[]');
    const regUser = registered.find((u: User) => u.email === email && u.password === password);
    if (regUser) {
      setUser(regUser);
      return true;
    }
    return false;
  };

  const loginWithGoogle = () => {
    setUser(demoUsers[0]); // Ivaneth
  };

  const register = (name: string, email: string, password: string, referredBy?: string): boolean => {
    const allUsers = [...demoUsers, ...JSON.parse(localStorage.getItem('success_registered') || '[]')];
    if (allUsers.find(u => u.email === email)) return false;
    if (referredBy && !allUsers.find(u => u.referralCode === referredBy)) return false;

    const code = name.substring(0, 5).toUpperCase().replace(/\s/g, '') + String(Math.floor(Math.random() * 999)).padStart(3, '0');
    const sponsor = referredBy ? allUsers.find(u => u.referralCode === referredBy) : null;
    const newUser: User = {
      id: allUsers.length + 1,
      email, password, name,
      referralCode: code,
      referredBy: referredBy || null,
      level: sponsor ? sponsor.level + 1 : 0,
      isActive: false, // Pending admin approval
      subscriptionActive: false,
      isAdmin: false,
      age: null, weight: null, height: null,
      activityLevel: null, healthGoal: null, gender: null,
      whatsapp: null,
      paymentInfo: null,
      affiliation: referredBy ? {
        sponsorCode: referredBy,
        paymentMonth: new Date().toISOString().substring(0, 7),
        paymentProofUrl: null,
        status: 'pending',
        approvedBy: null,
        approvedAt: null,
      } : null,
      healthConditions: [],
      targetWeight: null,
      weightHistory: [],
      dailyLog: [],
      waterIntake: [],
      exercises: [],
      glucoseHistory: [],
      bloodPressureHistory: [],
    };

    const registered = JSON.parse(localStorage.getItem('success_registered') || '[]');
    registered.push(newUser);
    localStorage.setItem('success_registered', JSON.stringify(registered));
    return true;
  };

  const logout = () => setUser(null);

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  const addWeightEntry = (weight: number) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const history = [...(user.weightHistory || [])];
    const existingIdx = history.findIndex(h => h.date === today);
    if (existingIdx >= 0) {
      history[existingIdx].weight = weight;
    } else {
      history.push({ date: today, weight });
    }
    setUser({ ...user, weight, weightHistory: history });
  };

  const logDay = (completed: boolean) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const log = [...(user.dailyLog || [])];
    const existingIdx = log.findIndex(l => l.date === today);
    if (existingIdx >= 0) {
      log[existingIdx].completed = completed;
    } else {
      log.push({ date: today, completed });
    }
    setUser({ ...user, dailyLog: log });
  };

  const editDayStatus = (date: string, completed: boolean) => {
    if (!user) return;
    const log = [...(user.dailyLog || [])];
    const existingIdx = log.findIndex(l => l.date === date);
    if (existingIdx >= 0) {
      log[existingIdx].completed = completed;
    } else {
      log.push({ date, completed });
    }
    setUser({ ...user, dailyLog: log });
  };

  const addWater = (date: string, glasses: number) => {
    if (!user) return;
    const waterList = [...(user.waterIntake || [])];
    const existingIdx = waterList.findIndex(w => w.date === date);
    if (existingIdx >= 0) {
      waterList[existingIdx].glasses = glasses;
    } else {
      waterList.push({ date, glasses });
    }
    setUser({ ...user, waterIntake: waterList });
  };

  const addExercise = (date: string, menu: string, calories: number) => {
    if (!user) return;
    const exList = [...(user.exercises || [])];
    exList.push({ date, menu, calories });
    setUser({ ...user, exercises: exList });
  };

  const addGlucose = (glucose: number) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const glucoseList = [...(user.glucoseHistory || [])];
    glucoseList.push({ date: today, glucose });
    setUser({ ...user, glucoseHistory: glucoseList });
  };

  const addBloodPressure = (systolic: number, diastolic: number) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    const bpList = [...(user.bloodPressureHistory || [])];
    bpList.push({ date: today, systolic, diastolic });
    setUser({ ...user, bloodPressureHistory: bpList });
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, loginWithGoogle, register, logout, updateProfile, 
      addWeightEntry, logDay, editDayStatus, addWater, addExercise, 
      addGlucose, addBloodPressure 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
