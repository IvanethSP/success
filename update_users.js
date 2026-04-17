import fs from 'fs';
let code = fs.readFileSync('src/data/users.ts', 'utf8');

// Update User Interface
code = code.replace(
  'dailyLog: { date: string; completed: boolean }[];', 
  'dailyLog: { date: string; completed: boolean }[];\n  waterIntake: { date: string; glasses: number }[];\n  exercises: { date: string; menu: string; calories: number }[];\n  glucoseHistory: { date: string; glucose: number }[];\n  bloodPressureHistory: { date: string; systolic: number; diastolic: number }[];'
);

// Update dummy users
code = code.replace(/dailyLog: \[\]/g, 'dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: []');
// Ensure ivaneth gets them too
code = code.replace(/dailyLog: \[.*?\}\]/g, match => match + ', waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: []');

// Add level 5 affiliates
const newAffiliates = `  // --- ADDITIONAL NIVEL 5 ---
  { id: 34, email: 'afiliado1@success.app', password: 'demo', name: 'Alfonso', referralCode: 'ALFON001', referredBy: 'RICAR001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'male', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 35, email: 'afiliado2@success.app', password: 'demo', name: 'Betina',   referralCode: 'BETIN001', referredBy: 'RICAR001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'female', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 36, email: 'afiliado3@success.app', password: 'demo', name: 'Carlos',   referralCode: 'CARLO002', referredBy: 'RICAR001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'male', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 37, email: 'afiliado4@success.app', password: 'demo', name: 'Karla',    referralCode: 'KARLA001', referredBy: 'VALER001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'female', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 38, email: 'afiliado5@success.app', password: 'demo', name: 'Julio',    referralCode: 'JULIO001', referredBy: 'HECTO001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'male', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 39, email: 'afiliado6@success.app', password: 'demo', name: 'Gerson',   referralCode: 'GERSO001', referredBy: 'ISABE001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'male', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
];

export const demoEarnings`;

code = code.replace(/];[\s\n]*export const demoEarnings/, newAffiliates);

fs.writeFileSync('src/data/users.ts', code);
console.log('Modified users.ts successfully');
