import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';
import { HEALTH_GOALS, ACTIVITY_LEVELS, HEALTH_CONDITIONS } from '../data/users';
import { peruvianMeals, type Meal } from '../data/peruvianMeals';
import { Sun, Cloud, Moon, Save, User, AlertTriangle, Heart, Check, Info, ShoppingCart } from 'lucide-react';

const goalProductMap: Record<string, string[]> = {
  weight_loss: ['Control de Peso', 'Sistema Base'],
  muscle_gain: ['Sport', 'Sistema Base'],
  energy: ['Sistema Base', 'Vigor Mental'],
  immunity: ['Inmunológica', 'Sistema Base'],
  detox: ['Sistema Base'],
  anti_aging: ['Anti-Edad', 'Sistema Base'],
  mental: ['Vigor Mental', 'Sistema Base'],
  general: ['Sistema Base'],
};

const goalTagMap: Record<string, string[]> = {
  weight_loss: ['termogénico', 'fit', 'fibra', 'metabolismo', 'control', 'l-carnitina'],
  muscle_gain: ['proteína', 'muscular', 'pre-entreno', 'post-entreno', 'BCAA', 'creatina', 'sport'],
  energy: ['energía', 'vitalidad', 'vitaminas', 'cafeína', 'adaptógeno'],
  immunity: ['inmunidad', 'defensa', 'probiótico', 'vitamina C', 'betaglucanos'],
  detox: ['detox', 'limpieza', 'hígado', 'verde', 'fibra'],
  anti_aging: ['anti-edad', 'colágeno', 'belleza', 'articulaciones', 'CoQ10'],
  mental: ['mental', 'concentración', 'estrés', 'sueño', 'relajación'],
  general: ['vitaminas', 'energía', 'proteína', 'digestión', 'diario'],
};

// Health condition product recommendations
const conditionProductMap: Record<string, string[]> = {
  diabetes: ['fibra', 'probiótico', 'control', 'minerales'],
  prediabetes: ['fibra', 'control', 'minerales', 'metabolismo'],
  celiaquia: ['probiótico', 'digestión', 'flora', 'vitaminas'],
  hashimoto: ['inmunidad', 'minerales', 'vitaminas', 'energía'],
  hipotiroidismo: ['energía', 'vitalidad', 'minerales', 'vitaminas'],
  hipertension: ['minerales', 'relajación', 'antioxidante', 'fibra'],
  colesterol: ['fibra', 'antioxidante', 'verde', 'detox'],
  anemia: ['minerales', 'vitaminas', 'energía', 'proteína'],
  gastritis: ['probiótico', 'digestión', 'flora', 'relajación'],
  intolerancia_lactosa: ['probiótico', 'digestión', 'flora', 'fibra'],
  sindrome_colon: ['probiótico', 'fibra', 'digestión', 'flora', 'relajación'],
  artritis: ['articulaciones', 'anti-inflamatorio', 'colágeno', 'cúrcuma'],
  osteoporosis: ['minerales', 'colágeno', 'proteína', 'vitaminas'],
  migraña: ['relajación', 'estrés', 'minerales', 'mental'],
  insomnio: ['sueño', 'descanso', 'relajación', 'estrés'],
  ansiedad: ['estrés', 'relajación', 'mental', 'adaptógeno'],
};

// Foods to avoid per condition
const conditionWarnings: Record<string, string> = {
  diabetes: '⚠️ Evitar exceso de azúcares simples. Preferir carbohidratos complejos y fibra.',
  prediabetes: '⚠️ Reducir carbohidratos refinados. Aumentar fibra y proteínas.',
  celiaquia: '⚠️ Evitar gluten (trigo, cebada, centeno). Verificar etiquetas.',
  hashimoto: '⚠️ Limitar soja, gluten y alimentos procesados. Aumentar selenio y zinc.',
  hipotiroidismo: '⚠️ Limitar soja y vegetales crucíferos crudos. Aumentar yodo y selenio.',
  hipertension: '⚠️ Reducir sodio. Evitar alimentos ultraprocesados y embutidos.',
  colesterol: '⚠️ Reducir grasas saturadas y trans. Aumentar fibra soluble y Omega-3.',
  anemia: '⚠️ Aumentar hierro (carnes rojas, legumbres) con vitamina C para absorción.',
  gastritis: '⚠️ Evitar picantes, café en exceso, cítricos y alcohol.',
  intolerancia_lactosa: '⚠️ Evitar lácteos o usar deslactosados. Asegurar calcio de otras fuentes.',
  sindrome_colon: '⚠️ Evitar alimentos que producen gases. Comer despacio, porciones pequeñas.',
  artritis: '⚠️ Reducir alimentos inflamatorios. Aumentar Omega-3 y antioxidantes.',
  osteoporosis: '⚠️ Aumentar calcio y vitamina D. Evitar exceso de cafeína y sodio.',
  migraña: '⚠️ Evitar quesos añejos, chocolate en exceso, vino tinto y alimentos con tiramina.',
  insomnio: '⚠️ Evitar cafeína después de las 2pm. Cenar ligero 3h antes de dormir.',
  ansiedad: '⚠️ Reducir cafeína y azúcares. Aumentar magnesio y triptófano.',
};

const morningTags = ['energía', 'vitaminas', 'vitalidad', 'diario', 'café', 'cafeína'];
const afternoonTags = ['proteína', 'fibra', 'concentración', 'mental', 'sopa', 'muscular'];
const eveningTags = ['relajación', 'sueño', 'descanso', 'detox', 'probiótico', 'colágeno'];

export default function NutritionPage() {
  const { user, updateProfile } = useAuth();
  const [showProfile, setShowProfile] = useState(!user?.healthGoal);
  const [age, setAge] = useState(String(user?.age || ''));
  const [weight, setWeight] = useState(String(user?.weight || ''));
  const [height, setHeight] = useState(String(user?.height || ''));
  const [activity, setActivity] = useState(user?.activityLevel || 'moderate');
  const [goal, setGoal] = useState(user?.healthGoal || 'general');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [brand, setBrand] = useState(user?.brand || 'FUXION');
  const [targetW, setTargetW] = useState(String(user?.targetWeight || ''));
  const [conditions, setConditions] = useState<string[]>(user?.healthConditions || []);

  // Products consumed today
  const today = new Date().toISOString().split('T')[0];
  const storageKey = `success_consumed_${today}`;
  const mealStorageKey = `success_meal_${today}`;
  const [consumed, setConsumed] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [consumedMeals, setConsumedMeals] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(mealStorageKey);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  
  const customFoodsKey = `fuxi_custom_foods_${today}`;
  const [customFoods] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem(customFoodsKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const toggleConsumed = (productId: number) => {
    setConsumed(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      localStorage.setItem(storageKey, JSON.stringify([...next]));
      return next;
    });
  };

  const toggleMealConsumed = (mealId: string) => {
    setConsumedMeals(prev => {
      const next = new Set(prev);
      if (next.has(mealId)) next.delete(mealId);
      else next.add(mealId);
      localStorage.setItem(mealStorageKey, JSON.stringify([...next]));
      return next;
    });
  };

  const toggleCondition = (id: string) => {
    setConditions(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const saveProfile = () => {
    updateProfile({
      age: parseInt(age) || null,
      weight: parseInt(weight) || null,
      height: parseInt(height) || null,
      activityLevel: activity,
      healthGoal: goal,
      brand: brand,
      gender: gender,
      healthConditions: conditions,
      targetWeight: parseFloat(targetW) || null,
    });
    setShowProfile(false);
  };

  const plan = useMemo(() => {
    const g = user?.healthGoal || goal || 'general';
    const categories = goalProductMap[g] || goalProductMap.general;
    const tags = [...(goalTagMap[g] || goalTagMap.general)];

    // Add condition-specific tags
    const userConditions = user?.healthConditions || conditions;
    userConditions.forEach(c => {
      const condTags = conditionProductMap[c] || [];
      condTags.forEach(t => { if (!tags.includes(t)) tags.push(t); });
    });

    const scored = products
      .filter(p => !brand || p.brand === brand)
      .map(p => {
        let score = 0;
        if (categories.includes(p.category)) score += 3;
        for (const t of p.tags) { if (tags.includes(t)) score += 2; }
        return { ...p, score };
      }).sort((a, b) => b.score - a.score);

    const morning = scored.filter(p => p.tags.some(t => morningTags.includes(t))).slice(0, 1);
    const usedIds = new Set(morning.map(p => p.id));
    const afternoon = scored.filter(p => p.tags.some(t => afternoonTags.includes(t)) && !usedIds.has(p.id)).slice(0, 1);
    afternoon.forEach(p => usedIds.add(p.id));
    const evening = scored.filter(p => p.tags.some(t => eveningTags.includes(t)) && !usedIds.has(p.id)).slice(0, 1);

    // Calorie calc
    const w = user?.weight || parseInt(weight) || 70;
    const h = user?.height || parseInt(height) || 170;
    const a = user?.age || parseInt(age) || 30;
    const gen = user?.gender || gender;
    const act = user?.activityLevel || activity;

    const bmr = gen === 'female'
      ? 655 + (9.6 * w) + (1.8 * h) - (4.7 * a)
      : 66 + (13.7 * w) + (5 * h) - (6.8 * a);

    const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const dailyCalories = Math.round(bmr * (multipliers[act] || 1.55));

    const warnings = userConditions
      .map(c => conditionWarnings[c])
      .filter(Boolean);

    return { morning, afternoon, evening, dailyCalories, goal: HEALTH_GOALS[g] || 'Bienestar General', warnings };
  }, [user, age, weight, height, activity, goal, gender, conditions]);

  // Count total plan products and consumed
  const totalPlanProducts = (plan.morning?.length || 0) + (plan.afternoon?.length || 0) + (plan.evening?.length || 0);
  const allPlanIds = [...(plan.morning || []), ...(plan.afternoon || []), ...(plan.evening || [])].map((p: any) => p.id);
  const consumedCount = allPlanIds.filter(id => consumed.has(id)).length;

  const totalMacro = useMemo(() => {
    let cal = 0, pro = 0, car = 0, fat = 0;
    // Analyzed mapped foods
    customFoods.forEach(f => {
      cal += f.calories || 0;
      pro += f.protein || 0;
      car += f.carbs || 0;
      fat += f.fats || 0;
    });
    // Consumed predefined Peruvian meals
    consumedMeals.forEach(id => {
      const meal = peruvianMeals.find(m => m.id === id);
      if (meal) {
        cal += meal.calories;
        pro += meal.protein;
        car += meal.carbs;
        fat += meal.fat;
      }
    });
    // Consumed Supplements (average 20kcal, 2g pro, 2g carb)
    cal += consumed.size * 20;
    pro += consumed.size * 2;
    car += consumed.size * 2;

    // Burned calories from exercises
    let burned = 0;
    (user?.exercises || []).filter(e => e.date === today).forEach(ex => {
      burned += ex.calories || 0;
    });

    return { 
      calories: Math.max(0, Math.round(cal - burned)),
      protein: Math.round(pro),
      carbs: Math.round(car),
      fats: Math.round(fat)
    };
  }, [customFoods, consumedMeals, consumed, user?.exercises, today]);

  const TimeBlock = ({ icon: Icon, label, time, color, items }: any) => (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div className="time-icon" style={{ background: color }}>
          <Icon size={20} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{label}</p>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{time}</p>
        </div>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
          {items.filter((p: any) => consumed.has(p.id)).length}/{items.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 48 }}>
        {items.map((p: any) => {
          const done = consumed.has(p.id);
          return (
            <div
              key={p.id}
              className="card card-padding"
              style={{
                display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer',
                opacity: done ? 0.7 : 1,
                transition: 'all 0.2s ease',
              }}
              onClick={() => toggleConsumed(p.id)}
            >
              {/* Checkbox */}
              <div style={{
                width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                border: done ? '2px solid var(--primary)' : '2px solid var(--border)',
                background: done ? 'var(--primary)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                {done && <Check size={14} color="#fff" strokeWidth={3} />}
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${p.imageColor}, ${p.imageColor}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.6875rem', flexShrink: 0 }}>
                {p.name.substring(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, textDecoration: done ? 'line-through' : 'none' }}>{p.name}</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{p.category} · {p.flavor}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const MealBlock = ({ meals, title, time }: { meals: Meal[]; title: string; time: string }) => (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{title} <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{time}</span></p>
      <div style={{ display: 'flex', overflowX: 'auto', gap: 12, padding: '8px 0', marginLeft: -2, paddingLeft: 2 }}>
        {meals.map(m => {
          const done = consumedMeals.has(m.id);
          return (
            <div key={m.id} className="card animate-in" style={{
              width: 160, flexShrink: 0, padding: 12, position: 'relative',
              backgroundColor: 'var(--bg-card)',
              opacity: done ? 0.7 : 1, transition: 'all 0.2s'
            }}>
              <div 
                style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, background: done ? 'var(--primary)' : 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}
                onClick={(e) => { e.stopPropagation(); toggleMealConsumed(m.id); }}
              >
                {done && <Check size={12} color="#fff" strokeWidth={3} />}
              </div>
              <div 
                style={{ height: 60, borderRadius: 8, background: m.imageColor, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                onClick={() => setSelectedMeal(m)}
              >
                <span style={{ fontSize: '1.5rem' }}>🍽️</span>
              </div>
              <h4 style={{ fontSize: '0.8125rem', marginBottom: 4, lineHeight: 1.2, cursor: 'pointer' }} onClick={() => setSelectedMeal(m)}>{m.name}</h4>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{m.calories} kcal</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="page" style={{ paddingBottom: selectedMeal ? 300 : 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h1>Mi Plan</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Plan nutricional personalizado</p>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={() => setShowProfile(!showProfile)}>
          <User size={16} /> Perfil
        </button>
      </div>

      {/* Profile Form */}
      {showProfile && (
        <div className="card card-padding animate-in" style={{ marginBottom: 16 }}>
          <h3 style={{ marginBottom: 12 }}>Tu Perfil Nutricional</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="grid-3">
              <div className="input-group">
                <label>Edad</label>
                <input className="input" style={{ paddingLeft: 12 }} type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="30" />
              </div>
              <div className="input-group">
                <label>Peso (kg)</label>
                <input className="input" style={{ paddingLeft: 12 }} type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" />
              </div>
              <div className="input-group">
                <label>Altura (cm)</label>
                <input className="input" style={{ paddingLeft: 12 }} type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" />
              </div>
            </div>
            <div className="grid-2">
              <div className="input-group">
                <label>Género</label>
                <select className="select" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </div>
              <div className="input-group">
                <label>Peso meta (kg)</label>
                <input className="input" style={{ paddingLeft: 12 }} type="number" value={targetW} onChange={e => setTargetW(e.target.value)} placeholder="70" step="0.1" />
              </div>
            </div>
            <div className="input-group">
              <label>Nivel de actividad</label>
              <select className="select" value={activity} onChange={e => setActivity(e.target.value)}>
                {Object.entries(ACTIVITY_LEVELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Objetivo de salud</label>
              <select className="select" value={goal} onChange={e => setGoal(e.target.value)}>
                {Object.entries(HEALTH_GOALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="input-group">
              <label>Marca de Preferencia</label>
              <select className="select" value={brand} onChange={e => setBrand(e.target.value)}>
                <option value="FUXION">Fuxion</option>
                <option value="Omnilife">Omnilife</option>
                <option value="Santa Natura">Santa Natura</option>
                <option value="Herbalife">Herbalife</option>
              </select>
            </div>

            {/* Health Conditions */}
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Heart size={14} color="var(--primary)" /> Condiciones de salud
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {HEALTH_CONDITIONS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => toggleCondition(c.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      border: conditions.includes(c.id) ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: conditions.includes(c.id) ? 'rgba(43,122,61,0.1)' : 'var(--bg)',
                      color: conditions.includes(c.id) ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: conditions.includes(c.id) ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'inherit',
                    }}
                    title={c.description}
                  >
                    {conditions.includes(c.id) ? '✓ ' : ''}{c.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={saveProfile}>
              <Save size={16} /> Guardar Perfil
            </button>
          </div>
        </div>
      )}

      {/* Health Condition Warnings */}
      {plan.warnings.length > 0 && (
        <div className="card card-padding" style={{ marginBottom: 16, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <AlertTriangle size={16} color="#F59E0B" />
            <h3 style={{ fontSize: '0.875rem', color: '#D97706' }}>Recomendaciones para tus condiciones</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {plan.warnings.map((w, i) => (
              <p key={i} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: 8, borderLeft: '2px solid #F59E0B' }}>{w}</p>
            ))}
          </div>
        </div>
      )}

      {/* Goal & Calories */}
      <div className="gradient-header" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Tu objetivo</p>
          <p style={{ fontSize: '1.125rem', fontWeight: 700 }}>{plan.goal}</p>
          {(user?.healthConditions || conditions).length > 0 && (
            <p style={{ fontSize: '0.6875rem', opacity: 0.7, marginTop: 4 }}>
              Condiciones: {(user?.healthConditions || conditions).length} activas
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Consumidas</p>
            <p style={{ fontSize: '1.25rem', fontWeight: 700, color: totalMacro.calories > plan.dailyCalories ? '#ef4444' : 'inherit' }}>
              {totalMacro.calories} <span style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: 400 }}>/ {plan.dailyCalories}</span>
            </p>
          </div>
          <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
            <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
              <circle 
                cx="22" cy="22" r="18" 
                fill="none" 
                stroke={totalMacro.calories > plan.dailyCalories ? '#ef4444' : '#fff'} 
                strokeWidth="4" 
                strokeDasharray="113.1" 
                strokeDashoffset={113.1 - (Math.min(totalMacro.calories / Math.max(plan.dailyCalories, 1), 1) * 113.1)} 
                strokeLinecap="round" 
                style={{ transition: 'stroke-dashoffset 0.8s ease' }} 
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.6875rem', fontWeight: 800 }}>{Math.round((totalMacro.calories / Math.max(plan.dailyCalories, 1)) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Macronutrientes Summary */}
      <div className="card card-padding" style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
        <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Proteínas</p>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#3b82f6' }}>{totalMacro.protein}g</p>
        </div>
        <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Carbohidratos</p>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b' }}>{totalMacro.carbs}g</p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Grasas</p>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#8b5cf6' }}>{totalMacro.fats}g</p>
        </div>
      </div>

      {/* Daily Schedule */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2>Plan Diario</h2>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 20,
          background: consumedCount === totalPlanProducts && totalPlanProducts > 0 ? 'rgba(34,197,94,0.1)' : 'rgba(43,122,61,0.08)',
          border: consumedCount === totalPlanProducts && totalPlanProducts > 0 ? '1px solid rgba(34,197,94,0.3)' : '1px solid var(--border)',
        }}>
          {consumedCount === totalPlanProducts && totalPlanProducts > 0 && <Check size={12} color="#22c55e" />}
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: consumedCount === totalPlanProducts && totalPlanProducts > 0 ? '#22c55e' : 'var(--text-secondary)' }}>
            {consumedCount}/{totalPlanProducts} consumidos
          </span>
        </div>
      </div>
      <TimeBlock icon={Sun} label="Mañana" time="6:00 - 12:00" color="#F59E0B" items={plan.morning} />
      <TimeBlock icon={Cloud} label="Tarde" time="12:00 - 18:00" color="#3B82F6" items={plan.afternoon} />
      <TimeBlock icon={Moon} label="Noche" time="18:00 - 22:00" color="#6366F1" items={plan.evening} />
      <div style={{ marginTop: 24, marginBottom: 16 }}>
        <h2>Menú Saludable (Perú)</h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Opciones para complementar tus nutracéuticos</p>
      </div>
      
      <MealBlock meals={peruvianMeals.filter(m => m.type === 'breakfast')} title="Desayuno" time="7:00 - 9:00" />
      <MealBlock meals={peruvianMeals.filter(m => m.type === 'lunch')} title="Almuerzo" time="13:00 - 15:00" />
      <MealBlock meals={peruvianMeals.filter(m => m.type === 'snack')} title="Snacks" time="Media mañana / Media tarde" />
      <MealBlock meals={peruvianMeals.filter(m => m.type === 'dinner')} title="Cena" time="19:00 - 21:00" />

      {/* Modal / Dialog for Meal Details */}
      {selectedMeal && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} onClick={() => setSelectedMeal(null)} />
          <div className="card animate-in" style={{
            position: 'fixed', bottom: 64, left: '50%', transform: 'translateX(-50%)',
            width: '95%', maxWidth: 400, maxHeight: '80vh', overflowY: 'auto',
            background: 'var(--bg)', borderRadius: '20px 20px 0 0', zIndex: 101, padding: 20
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h2 style={{ fontSize: '1.25rem' }}>{selectedMeal.name}</h2>
              <button className="btn btn-ghost" onClick={() => setSelectedMeal(null)} style={{ padding: 4 }}>✕</button>
            </div>
            
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, padding: 10, background: 'var(--bg-card)', borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Calorías</p>
                <p style={{ fontWeight: 700 }}>{selectedMeal.calories}</p>
              </div>
              <div style={{ flex: 1, padding: 10, background: 'var(--bg-card)', borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Proteínas</p>
                <p style={{ fontWeight: 700 }}>{selectedMeal.protein}g</p>
              </div>
              <div style={{ flex: 1, padding: 10, background: 'var(--bg-card)', borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Carbs</p>
                <p style={{ fontWeight: 700 }}>{selectedMeal.carbs}g</p>
              </div>
              <div style={{ flex: 1, padding: 10, background: 'var(--bg-card)', borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Grasas</p>
                <p style={{ fontWeight: 700 }}>{selectedMeal.fat}g</p>
              </div>
            </div>

            <h3 style={{ fontSize: '0.9rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><ShoppingCart size={16} /> Lista de Compras / Ingredientes</h3>
            <ul style={{ paddingLeft: 18, marginBottom: 16, fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {selectedMeal.ingredients.map((ing, i) => (
                <li key={i} style={{ marginBottom: 4 }}><strong>{ing.item}</strong>: {ing.amount}</li>
              ))}
            </ul>

            <h3 style={{ fontSize: '0.9rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Info size={16} /> Preparación</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 20 }}>
              {selectedMeal.instructions}
            </p>

            <button 
              className={`btn btn-full ${consumedMeals.has(selectedMeal.id) ? 'btn-outline' : 'btn-primary'}`} 
              onClick={() => {
                toggleMealConsumed(selectedMeal.id);
                setSelectedMeal(null);
              }}
            >
              {consumedMeals.has(selectedMeal.id) ? 'Desmarcar como consumido' : 'Marcar como consumido ✓'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
