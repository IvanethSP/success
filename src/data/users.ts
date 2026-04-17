export interface PaymentInfo {
  type: 'yape' | 'plin' | 'mercado_pago' | null;
  number: string;
}

export interface AffiliationInfo {
  sponsorCode: string;
  paymentMonth: string; // "2026-03"
  paymentProofUrl: string | null;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy: number | null;
  approvedAt: string | null;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  referralCode: string;
  referredBy: string | null;
  level: number;
  isActive: boolean;
  subscriptionActive: boolean;
  isAdmin: boolean;
  age: number | null;
  weight: number | null;
  height: number | null;
  activityLevel: string | null;
  healthGoal: string | null;
  brand?: string | null;
  gender: string | null;
  whatsapp: string | null;
  paymentInfo: PaymentInfo | null;
  affiliation: AffiliationInfo | null;
  healthConditions: string[];
  targetWeight: number | null;
  weightHistory: { date: string; weight: number }[];
  dailyLog: { date: string; completed: boolean }[];
  waterIntake: { date: string; glasses: number }[];
  exercises: { date: string; menu: string; calories: number }[];
  glucoseHistory: { date: string; glucose: number }[];
  bloodPressureHistory: { date: string; systolic: number; diastolic: number }[];
}

export const COMMISSION_RATES = [
  { level: 1, rate: 0.10, perPerson: 1.40, maxPeople: 3 },
  { level: 2, rate: 0.16, perPerson: 2.24, maxPeople: 9 },
  { level: 3, rate: 0.15, perPerson: 2.10, maxPeople: 27 },
  { level: 4, rate: 0.15, perPerson: 2.10, maxPeople: 81 },
  { level: 5, rate: 0.15, perPerson: 2.10, maxPeople: 243 },
  { level: 6, rate: 0.15, perPerson: 2.10, maxPeople: 729 },
  { level: 7, rate: 0.14, perPerson: 1.96, maxPeople: 2187 },
];

export const SUBSCRIPTION_PRICE = 20;
export const COMMISSION_TOTAL_PCT = 70;

const generatedL4 = Array.from({ length: 60 }).map((_, i) => ({
  id: 100 + i, email: `l4_${i}@success.app`, password: "demo", name: `Socio Pro ${100+i}`, referralCode: `LX4_${i}`, referredBy: "MARCO001", level: 4, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: "moderate", healthGoal: "general", brand: "FUXION", gender: "male" as any, whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: []
}));

const generatedL5 = Array.from({ length: 120 }).map((_, i) => ({
  id: 300 + i, email: `l5_${i}@success.app`, password: "demo", name: `Socio Pro ${300+i}`, referralCode: `LX5_${i}`, referredBy: "PATRI001", level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: "moderate", healthGoal: "general", brand: "FUXION", gender: "male" as any, whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: []
}));

export const demoUsers: User[] = [
  // ADMIN / Raíz de la red
  { id: 1, email: "ivaneth@success.app", password: "admin123", name: "Ivaneth Silva Pernalette", referralCode: "IVANETH001", referredBy: null, level: 0, isActive: true, subscriptionActive: true, isAdmin: true, age: 38, weight: 62, height: 165, activityLevel: "moderate", healthGoal: "general", gender: "female", whatsapp: "+51999888777", paymentInfo: { type: "yape", number: "999888777" }, affiliation: null, healthConditions: [], targetWeight: 58, weightHistory: [{date:"2026-01-01",weight:65},{date:"2026-01-15",weight:64},{date:"2026-02-01",weight:63.2},{date:"2026-02-15",weight:62.5},{date:"2026-03-01",weight:62},{date:"2026-03-10",weight:61.5},{date:"2026-03-20",weight:61}], dailyLog: [{date:"2026-03-01",completed:true},{date:"2026-03-02",completed:true},{date:"2026-03-03",completed:true},{date:"2026-03-04",completed:false},{date:"2026-03-05",completed:true},{date:"2026-03-06",completed:true},{date:"2026-03-07",completed:true},{date:"2026-03-08",completed:true},{date:"2026-03-09",completed:false},{date:"2026-03-10",completed:true},{date:"2026-03-11",completed:true},{date:"2026-03-12",completed:true},{date:"2026-03-13",completed:true},{date:"2026-03-14",completed:true},{date:"2026-03-15",completed:true},{date:"2026-03-16",completed:false},{date:"2026-03-17",completed:true},{date:"2026-03-18",completed:true},{date:"2026-03-19",completed:true},{date:"2026-03-20",completed:true}], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 1 (bajo Ivaneth) ───
  { id: 2, email: "maria@success.app", password: "demo123", name: "María López", referralCode: "MARIA001", referredBy: "IVANETH001", level: 1, isActive: true, subscriptionActive: true, isAdmin: false, age: 28, weight: 62, height: 165, activityLevel: "active", healthGoal: "weight_loss", gender: "female", whatsapp: "+51998776655", paymentInfo: { type: "yape", number: "998776655" }, affiliation: { sponsorCode: "IVANETH001", paymentMonth: "2026-03", paymentProofUrl: "captura_maria.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-01" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 3, email: "juan@success.app", password: "demo123", name: "Juan Pérez", referralCode: "JUAN001", referredBy: "IVANETH001", level: 1, isActive: true, subscriptionActive: true, isAdmin: false, age: 42, weight: 85, height: 180, activityLevel: "light", healthGoal: "energy", gender: "male", whatsapp: "+51997665544", paymentInfo: { type: "plin", number: "997665544" }, affiliation: { sponsorCode: "IVANETH001", paymentMonth: "2026-03", paymentProofUrl: "captura_juan.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-02" }, healthConditions: ["hipertension"], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 4, email: "ana@success.app", password: "demo123", name: "Ana García", referralCode: "ANA001", referredBy: "IVANETH001", level: 1, isActive: true, subscriptionActive: true, isAdmin: false, age: 31, weight: 58, height: 160, activityLevel: "moderate", healthGoal: "immunity", gender: "female", whatsapp: "+51996554433", paymentInfo: null, affiliation: { sponsorCode: "IVANETH001", paymentMonth: "2026-03", paymentProofUrl: "captura_ana.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-03" }, healthConditions: ["hashimoto"], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 2 (bajo Ana) ───
  { id: 5, email: "roberto@success.app", password: "demo123", name: "Roberto Castillo", referralCode: "ROBERTO001", referredBy: "ANA001", level: 2, isActive: true, subscriptionActive: true, isAdmin: false, age: 35, weight: 78, height: 175, activityLevel: "active", healthGoal: "muscle_gain", gender: "male", whatsapp: "+51995443322", paymentInfo: { type: "mercado_pago", number: "995443322" }, affiliation: { sponsorCode: "ANA001", paymentMonth: "2026-03", paymentProofUrl: "captura_roberto.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-04" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 2 (bajo María) ───
  { id: 6, email: "pedro@success.app", password: "demo123", name: "Pedro Ruiz", referralCode: "PEDRO001", referredBy: "MARIA001", level: 2, isActive: true, subscriptionActive: true, isAdmin: false, age: 25, weight: 70, height: 172, activityLevel: "very_active", healthGoal: "muscle_gain", gender: "male", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "MARIA001", paymentMonth: "2026-03", paymentProofUrl: "captura_pedro.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-05" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 7, email: "lucia@success.app", password: "demo123", name: "Lucía Torres", referralCode: "LUCIA001", referredBy: "MARIA001", level: 2, isActive: true, subscriptionActive: true, isAdmin: false, age: 33, weight: 65, height: 168, activityLevel: "moderate", healthGoal: "anti_aging", gender: "female", whatsapp: "+51993322111", paymentInfo: { type: "yape", number: "993322111" }, affiliation: { sponsorCode: "MARIA001", paymentMonth: "2026-03", paymentProofUrl: "captura_lucia.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-06" }, healthConditions: ["celiaquia"], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 8, email: "diego@success.app", password: "demo123", name: "Diego Sánchez", referralCode: "DIEGO001", referredBy: "MARIA001", level: 2, isActive: false, subscriptionActive: false, isAdmin: false, age: 29, weight: 75, height: 178, activityLevel: "sedentary", healthGoal: "detox", gender: "male", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "MARIA001", paymentMonth: "2026-02", paymentProofUrl: null, status: "rejected", approvedBy: 1, approvedAt: null }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 2 (bajo Juan) ───
  { id: 9, email: "rosa@success.app", password: "demo123", name: "Rosa Flores", referralCode: "ROSA001", referredBy: "JUAN001", level: 2, isActive: true, subscriptionActive: true, isAdmin: false, age: 45, weight: 68, height: 162, activityLevel: "light", healthGoal: "general", gender: "female", whatsapp: "+51992211000", paymentInfo: { type: "plin", number: "992211000" }, affiliation: { sponsorCode: "JUAN001", paymentMonth: "2026-03", paymentProofUrl: "captura_rosa.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-07" }, healthConditions: ["diabetes", "colesterol"], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 10, email: "luis@success.app", password: "demo123", name: "Luis Vargas", referralCode: "LUIS001", referredBy: "JUAN001", level: 2, isActive: true, subscriptionActive: true, isAdmin: false, age: 38, weight: 82, height: 176, activityLevel: "moderate", healthGoal: "weight_loss", gender: "male", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "JUAN001", paymentMonth: "2026-03", paymentProofUrl: "captura_luis.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-08" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 11, email: "valentina@success.app", password: "demo123", name: "Valentina Ríos", referralCode: "VALE001", referredBy: "JUAN001", level: 2, isActive: true, subscriptionActive: true, isAdmin: false, age: 26, weight: 55, height: 162, activityLevel: "active", healthGoal: "energy", gender: "female", whatsapp: "+51991100998", paymentInfo: null, affiliation: { sponsorCode: "JUAN001", paymentMonth: "2026-03", paymentProofUrl: "captura_vale.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-09" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 2 (bajo Ana) ───
  { id: 12, email: "carmen@success.app", password: "demo123", name: "Carmen Díaz", referralCode: "CARMEN001", referredBy: "ANA001", level: 2, isActive: true, subscriptionActive: true, isAdmin: false, age: 27, weight: 55, height: 158, activityLevel: "active", healthGoal: "energy", gender: "female", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "ANA001", paymentMonth: "2026-03", paymentProofUrl: "captura_carmen.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-10" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 13, email: "alberto@success.app", password: "demo123", name: "Alberto Mendoza", referralCode: "ALBERT001", referredBy: "ANA001", level: 2, isActive: true, subscriptionActive: true, isAdmin: false, age: 40, weight: 88, height: 182, activityLevel: "light", healthGoal: "weight_loss", gender: "male", whatsapp: "+51990099887", paymentInfo: { type: "yape", number: "990099887" }, affiliation: { sponsorCode: "ANA001", paymentMonth: "2026-03", paymentProofUrl: "captura_alberto.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-11" }, healthConditions: ["gastritis"], targetWeight: 80, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 3 (bajo Roberto) ───
  { id: 14, email: "fernanda@success.app", password: "demo123", name: "Fernanda Vega", referralCode: "FERNAN001", referredBy: "ROBERTO001", level: 3, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 60, height: 164, activityLevel: "active", healthGoal: "anti_aging", gender: "female", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "ROBERTO001", paymentMonth: "2026-03", paymentProofUrl: "captura_fernanda.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-12" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 15, email: "gabriel@success.app", password: "demo123", name: "Gabriel Morales", referralCode: "GABRI001", referredBy: "ROBERTO001", level: 3, isActive: true, subscriptionActive: true, isAdmin: false, age: 34, weight: 76, height: 174, activityLevel: "very_active", healthGoal: "muscle_gain", gender: "male", whatsapp: "+51989988776", paymentInfo: { type: "mercado_pago", number: "989988776" }, affiliation: { sponsorCode: "ROBERTO001", paymentMonth: "2026-03", paymentProofUrl: "captura_gabriel.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-13" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 3 (bajo Pedro) ───
  { id: 16, email: "marco@success.app", password: "demo123", name: "Marco Quispe", referralCode: "MARCO001", referredBy: "PEDRO001", level: 3, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 72, height: 170, activityLevel: "active", healthGoal: "muscle_gain", gender: "male", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "PEDRO001", paymentMonth: "2026-03", paymentProofUrl: "captura_marco.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-14" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 17, email: "sofia@success.app", password: "demo123", name: "Sofía Huamán", referralCode: "SOFIA001", referredBy: "PEDRO001", level: 3, isActive: true, subscriptionActive: true, isAdmin: false, age: 26, weight: 57, height: 163, activityLevel: "moderate", healthGoal: "general", gender: "female", whatsapp: "+51988877665", paymentInfo: null, affiliation: { sponsorCode: "PEDRO001", paymentMonth: "2026-03", paymentProofUrl: "captura_sofia.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-15" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 3 (bajo Lucía) ───
  { id: 18, email: "jorge@success.app", password: "demo123", name: "Jorge Castillo", referralCode: "JORGE001", referredBy: "LUCIA001", level: 3, isActive: true, subscriptionActive: true, isAdmin: false, age: 34, weight: 80, height: 177, activityLevel: "light", healthGoal: "detox", gender: "male", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "LUCIA001", paymentMonth: "2026-03", paymentProofUrl: "captura_jorge.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-16" }, healthConditions: ["gastritis"], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 19, email: "camila@success.app", password: "demo123", name: "Camila Herrera", referralCode: "CAMILA001", referredBy: "LUCIA001", level: 3, isActive: true, subscriptionActive: true, isAdmin: false, age: 23, weight: 52, height: 158, activityLevel: "active", healthGoal: "energy", gender: "female", whatsapp: "+51987766554", paymentInfo: { type: "yape", number: "987766554" }, affiliation: { sponsorCode: "LUCIA001", paymentMonth: "2026-03", paymentProofUrl: "captura_camila.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-17" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 3 (bajo Rosa) ───
  { id: 20, email: "eduardo@success.app", password: "demo123", name: "Eduardo Paredes", referralCode: "EDUAR001", referredBy: "ROSA001", level: 3, isActive: true, subscriptionActive: true, isAdmin: false, age: 48, weight: 90, height: 178, activityLevel: "light", healthGoal: "weight_loss", gender: "male", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "ROSA001", paymentMonth: "2026-03", paymentProofUrl: "captura_eduar.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-18" }, healthConditions: ["diabetes"], targetWeight: 82, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 3 (bajo Valentina) ───
  { id: 21, email: "daniela@success.app", password: "demo123", name: "Daniela Cruz", referralCode: "DANIE001", referredBy: "VALE001", level: 3, isActive: true, subscriptionActive: true, isAdmin: false, age: 24, weight: 54, height: 160, activityLevel: "active", healthGoal: "general", gender: "female", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "VALE001", paymentMonth: "2026-03", paymentProofUrl: "captura_daniela.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-19" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 4 (bajo Fernanda) ───
  { id: 22, email: "natalia@success.app", password: "demo123", name: "Natalia Rojas", referralCode: "NATAL001", referredBy: "FERNAN001", level: 4, isActive: true, subscriptionActive: true, isAdmin: false, age: 29, weight: 58, height: 162, activityLevel: "moderate", healthGoal: "anti_aging", gender: "female", whatsapp: "+51986655443", paymentInfo: { type: "plin", number: "986655443" }, affiliation: { sponsorCode: "FERNAN001", paymentMonth: "2026-03", paymentProofUrl: "captura_natalia.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-19" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 4 (bajo Gabriel) ───
  { id: 23, email: "andres@success.app", password: "demo123", name: "Andrés Salazar", referralCode: "ANDRE001", referredBy: "GABRI001", level: 4, isActive: true, subscriptionActive: true, isAdmin: false, age: 31, weight: 74, height: 176, activityLevel: "very_active", healthGoal: "muscle_gain", gender: "male", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "GABRI001", paymentMonth: "2026-03", paymentProofUrl: "captura_andres.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-20" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 4 (bajo Marco) ───
  { id: 24, email: "patricia@success.app", password: "demo123", name: "Patricia Luna", referralCode: "PATRI001", referredBy: "MARCO001", level: 4, isActive: true, subscriptionActive: true, isAdmin: false, age: 36, weight: 63, height: 166, activityLevel: "moderate", healthGoal: "immunity", gender: "female", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "MARCO001", paymentMonth: "2026-03", paymentProofUrl: "captura_patricia.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-20" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 4 (bajo Camila) ───
  { id: 25, email: "ricardo@success.app", password: "demo123", name: "Ricardo Espinoza", referralCode: "RICAR001", referredBy: "CAMILA001", level: 4, isActive: true, subscriptionActive: true, isAdmin: false, age: 32, weight: 78, height: 175, activityLevel: "active", healthGoal: "energy", gender: "male", whatsapp: "+51985544332", paymentInfo: { type: "yape", number: "985544332" }, affiliation: { sponsorCode: "CAMILA001", paymentMonth: "2026-03", paymentProofUrl: "captura_ricardo.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-20" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 5 (bajo Patricia) ───
  { id: 28, email: "valeria@success.app", password: "demo123", name: "Valeria Pacheco", referralCode: "VALER001", referredBy: "PATRI001", level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 27, weight: 56, height: 161, activityLevel: "active", healthGoal: "energy", gender: "female", whatsapp: "+51983322110", paymentInfo: { type: "yape", number: "983322110" }, affiliation: { sponsorCode: "PATRI001", paymentMonth: "2026-03", paymentProofUrl: "captura_valeria.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-20" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 29, email: "hector@success.app", password: "demo123", name: "Héctor Guzmán", referralCode: "HECTO001", referredBy: "PATRI001", level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 41, weight: 84, height: 179, activityLevel: "moderate", healthGoal: "weight_loss", gender: "male", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "PATRI001", paymentMonth: "2026-03", paymentProofUrl: "captura_hector.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-20" }, healthConditions: ["hipertension"], targetWeight: 76, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── NIVEL 5 (bajo Ricardo) ───
  { id: 30, email: "isabela@success.app", password: "demo123", name: "Isabela Navarro", referralCode: "ISABE001", referredBy: "RICAR001", level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 25, weight: 53, height: 159, activityLevel: "very_active", healthGoal: "muscle_gain", gender: "female", whatsapp: "+51982211009", paymentInfo: { type: "plin", number: "982211009" }, affiliation: { sponsorCode: "RICAR001", paymentMonth: "2026-03", paymentProofUrl: "captura_isabela.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-03-20" }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 31, email: "oscar@success.app", password: "demo123", name: "Óscar Fuentes", referralCode: "OSCAR001", referredBy: "RICAR001", level: 5, isActive: false, subscriptionActive: false, isAdmin: false, age: 37, weight: 79, height: 175, activityLevel: "light", healthGoal: "detox", gender: "male", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "RICAR001", paymentMonth: "2026-02", paymentProofUrl: "captura_oscar.jpg", status: "approved", approvedBy: 1, approvedAt: "2026-02-20" }, healthConditions: ["gastritis"], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },

  // ─── Pendientes de aprobación ───
  { id: 32, email: "nuevo1@success.app", password: "demo123", name: "Laura Medina", referralCode: "LAURA001", referredBy: "CARMEN001", level: 3, isActive: false, subscriptionActive: false, isAdmin: false, age: 29, weight: 60, height: 163, activityLevel: "moderate", healthGoal: "general", brand: "FUXION", gender: "female", whatsapp: "+51984433221", paymentInfo: null, affiliation: { sponsorCode: "CARMEN001", paymentMonth: "2026-03", paymentProofUrl: "captura_laura.jpg", status: "pending", approvedBy: null, approvedAt: null }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 33, email: "nuevo2@success.app", password: "demo123", name: "Carlos Ramos", referralCode: "CARLO001", referredBy: "LUCIA001", level: 3, isActive: false, subscriptionActive: false, isAdmin: false, age: 33, weight: 82, height: 178, activityLevel: "moderate", healthGoal: "general", brand: "FUXION", gender: "male", whatsapp: null, paymentInfo: null, affiliation: { sponsorCode: "LUCIA001", paymentMonth: "2026-03", paymentProofUrl: "captura_carlos_r.jpg", status: "pending", approvedBy: null, approvedAt: null }, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  // --- ADDITIONAL NIVEL 5 ---
  { id: 34, email: 'afiliado1@success.app', password: 'demo', name: 'Alfonso', referralCode: 'ALFON001', referredBy: 'RICAR001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'male', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 35, email: 'afiliado2@success.app', password: 'demo', name: 'Betina',   referralCode: 'BETIN001', referredBy: 'RICAR001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'female', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 36, email: 'afiliado3@success.app', password: 'demo', name: 'Carlos',   referralCode: 'CARLO002', referredBy: 'RICAR001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'male', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 37, email: 'afiliado4@success.app', password: 'demo', name: 'Karla',    referralCode: 'KARLA001', referredBy: 'VALER001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'female', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 38, email: 'afiliado5@success.app', password: 'demo', name: 'Julio',    referralCode: 'JULIO001', referredBy: 'HECTO001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'male', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  { id: 39, email: 'afiliado6@success.app', password: 'demo', name: 'Gerson',   referralCode: 'GERSO001', referredBy: 'ISABE001', level: 5, isActive: true, subscriptionActive: true, isAdmin: false, age: 30, weight: 70, height: 170, activityLevel: 'active', healthGoal: 'general', gender: 'male', whatsapp: null, paymentInfo: null, affiliation: null, healthConditions: [], targetWeight: null, weightHistory: [], dailyLog: [], waterIntake: [], exercises: [], glucoseHistory: [], bloodPressureHistory: [] },
  ...generatedL4,
  ...generatedL5
];

export const demoEarnings = (() => {
  const levels = [1, 2, 3, 4, 5, 6, 7].map(lvl => {
    const activeCount = demoUsers.filter(u => u.level === lvl && u.id !== 1 && u.subscriptionActive).length;
    return activeCount * COMMISSION_RATES[lvl - 1].perPerson;
  });
  const total = levels.reduce((a, b) => a + b, 0);

  return {
    userId: 1,
    month: "2026-03",
    level1: levels[0],
    level2: levels[1],
    level3: levels[2],
    level4: levels[3],
    level5: levels[4],
    level6: levels[5],
    level7: levels[6],
    total,
  };
})();

export const HEALTH_CONDITIONS: { id: string; label: string; description: string }[] = [
  { id: "diabetes", label: "Diabetes", description: "Diabetes tipo 1 o tipo 2" },
  { id: "prediabetes", label: "Prediabetes", description: "Resistencia a la insulina" },
  { id: "celiaquia", label: "Celiaquía", description: "Intolerancia al gluten" },
  { id: "hashimoto", label: "Hashimoto", description: "Tiroiditis autoinmune" },
  { id: "hipotiroidismo", label: "Hipotiroidismo", description: "Tiroides hipoactiva" },
  { id: "hipertension", label: "Hipertensión", description: "Presión arterial alta" },
  { id: "colesterol", label: "Colesterol alto", description: "Hipercolesterolemia" },
  { id: "anemia", label: "Anemia", description: "Deficiencia de hierro" },
  { id: "gastritis", label: "Gastritis", description: "Inflamación estomacal" },
  { id: "intolerancia_lactosa", label: "Intolerancia a la lactosa", description: "No tolera lácteos" },
  { id: "sindrome_colon", label: "Colon irritable", description: "Síndrome del intestino irritable" },
  { id: "artritis", label: "Artritis", description: "Inflamación articular" },
  { id: "osteoporosis", label: "Osteoporosis", description: "Pérdida de densidad ósea" },
  { id: "migraña", label: "Migraña", description: "Dolores de cabeza crónicos" },
  { id: "insomnio", label: "Insomnio", description: "Dificultad para dormir" },
  { id: "ansiedad", label: "Ansiedad", description: "Trastorno de ansiedad" },
];

export const HEALTH_GOALS: Record<string, string> = {
  weight_loss: "Pérdida de Peso",
  muscle_gain: "Ganancia Muscular",
  energy: "Energía y Vitalidad",
  immunity: "Sistema Inmunológico",
  detox: "Desintoxicación",
  anti_aging: "Anti-Envejecimiento",
  mental: "Vigor Mental",
  general: "Bienestar General",
};

export const ACTIVITY_LEVELS: Record<string, string> = {
  sedentary: "Sedentario",
  light: "Actividad Ligera",
  moderate: "Actividad Moderada",
  active: "Activo",
  very_active: "Muy Activo",
};

export const PAYMENT_METHODS: Record<string, string> = {
  yape: "Yape",
  plin: "Plin",
  mercado_pago: "Mercado Pago",
};
