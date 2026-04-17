import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Target, CheckCircle, XCircle, Plus, Scale, Award, Flame, Droplets, Activity, HeartPulse, Dumbbell } from 'lucide-react';
import { peruvianMeals } from '../data/peruvianMeals';

const EXERCISE_TYPES = [
  { id: 'walk', label: '🚶‍♂️ Caminar', calPerMin: 5 },
  { id: 'run', label: '🏃 Correr', calPerMin: 10 },
  { id: 'bike', label: '🚴 Ciclismo', calPerMin: 8 },
  { id: 'weights', label: '🏋️ Pesas', calPerMin: 6 },
  { id: 'yoga', label: '🧘 Yoga', calPerMin: 4 },
  { id: 'swim', label: '🏊 Natación', calPerMin: 9 },
  { id: 'hiit', label: '🔥 HIIT', calPerMin: 12 },
  { id: 'other', label: '✏️ Otro', calPerMin: 0 },
];

export default function ProgressPage() {
  const { user, addWeightEntry, logDay, editDayStatus, addWater, addExercise, addGlucose, addBloodPressure } = useAuth();
  const [newWeight, setNewWeight] = useState('');
  const [newGlucose, setNewGlucose] = useState('');
  const [newSystolic, setNewSystolic] = useState('');
  const [newDiastolic, setNewDiastolic] = useState('');
  const [newExercise, setNewExercise] = useState('');
  const [manualCal, setManualCal] = useState('');
  const [selectedEx, setSelectedEx] = useState('walk');
  const [exDuration, setExDuration] = useState('30');
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const weightHistory = user?.weightHistory || [];
  const dailyLog = user?.dailyLog || [];
  const currentWeight = user?.weight || 0;
  const targetWeight = user?.targetWeight || currentWeight;
  const startWeight = weightHistory.length > 0 ? weightHistory[0].weight : currentWeight;

  // Calendar data
  const calendarData = useMemo(() => {
    const year = viewMonth.year;
    const month = viewMonth.month;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const logMap = new Map<string, boolean>();
    dailyLog.forEach(l => logMap.set(l.date, l.completed));

    const weeks: { day: number | null; date: string; status: 'completed' | 'failed' | 'future' | 'empty'; calories?: number }[][] = [];
    let currentWeek: typeof weeks[0] = [];

    // Pad start
    for (let i = 0; i < startDow; i++) {
      currentWeek.push({ day: null, date: '', status: 'empty' });
    }

    const today = new Date().toISOString().split('T')[0];

    const w = user?.weight || 70;
    const h = user?.height || 170;
    const a = user?.age || 30;
    const gen = user?.gender || 'male';
    const act = user?.activityLevel || 'moderate';
    const bmr = gen === 'female' ? 655 + (9.6 * w) + (1.8 * h) - (4.7 * a) : 66 + (13.7 * w) + (5 * h) - (6.8 * a);
    const multipliers: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const dailyLimit = Math.round(bmr * (multipliers[act] || 1.55));

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      let status: 'completed' | 'failed' | 'future' | 'empty' = 'future';
      let dayCals = 0;

      if (dateStr <= today) {
        // Compute calories natively
        try {
          const custom = JSON.parse(localStorage.getItem(`fuxi_custom_foods_${dateStr}`) || '[]');
          custom.forEach((f: any) => dayCals += f.calories || 0);
          
          const meals = JSON.parse(localStorage.getItem(`success_meal_${dateStr}`) || '[]');
          meals.forEach((id: string) => {
            const meal = peruvianMeals.find(m => m.id === id);
            if (meal) dayCals += meal.calories;
          });
          
          const supplements = JSON.parse(localStorage.getItem(`success_consumed_${dateStr}`) || '[]');
          dayCals += supplements.length * 20;

          // Subtract burned calories
          let burned = 0;
          (user?.exercises || []).filter(e => e.date === dateStr).forEach(ex => {
            burned += ex.calories || 0;
          });
          dayCals = Math.max(0, dayCals - burned);

        } catch {}

        if (dayCals > 0) {
          status = dayCals <= dailyLimit ? 'completed' : 'failed';
        } else if (logMap.has(dateStr)) {
          status = logMap.get(dateStr) ? 'completed' : 'failed';
        } else if (dateStr < today) {
          status = 'empty';
        }
      }

      currentWeek.push({ day: d, date: dateStr, status, calories: dayCals > 0 ? dayCals : undefined });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Pad end
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ day: null, date: '', status: 'empty' });
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return weeks;
  }, [viewMonth, dailyLog, user]);

  // Streak calculation
  const currentStreak = useMemo(() => {
    let streak = 0;
    const sorted = [...dailyLog].sort((a, b) => b.date.localeCompare(a.date));
    for (const entry of sorted) {
      if (entry.completed) streak++;
      else break;
    }
    return streak;
  }, [dailyLog]);

  const totalCompleted = dailyLog.filter(l => l.completed).length;
  const totalFailed = dailyLog.filter(l => !l.completed).length;

  // Weight progress
  const weightLost = startWeight - currentWeight;
  const weightToGo = currentWeight - targetWeight;
  const totalToLose = startWeight - targetWeight;
  const progressPct = totalToLose > 0 ? Math.min(100, ((weightLost) / totalToLose) * 100) : 0;

  // SVG line chart
  const chartPoints = useMemo(() => {
    if (weightHistory.length < 2) return null;

    const W = 340;
    const H = 160;
    const padX = 40;
    const padY = 20;
    const plotW = W - padX * 2;
    const plotH = H - padY * 2;

    const weights = weightHistory.map(h => h.weight);
    const maxW = Math.max(...weights) + 1;
    const minW = Math.min(...weights, targetWeight) - 1;
    const range = maxW - minW;

    const points = weightHistory.map((h, i) => ({
      x: padX + (i / (weightHistory.length - 1)) * plotW,
      y: padY + ((maxW - h.weight) / range) * plotH,
      weight: h.weight,
      date: h.date,
    }));

    const targetY = padY + ((maxW - targetWeight) / range) * plotH;

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = pathD + ` L ${points[points.length - 1].x} ${H - padY} L ${points[0].x} ${H - padY} Z`;

    // Y axis labels
    const yLabels = [];
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const val = minW + (range * i) / steps;
      const y = padY + ((maxW - val) / range) * plotH;
      yLabels.push({ y, label: Math.round(val) });
    }

    return { points, targetY, pathD, areaD, W, H, padX, padY, yLabels };
  }, [weightHistory, targetWeight]);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  const prevMonth = () => {
    setViewMonth(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  };
  const nextMonth = () => {
    setViewMonth(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
  };

  const handleAddWeight = () => {
    const w = parseFloat(newWeight);
    if (!isNaN(w) && w > 0) {
      addWeightEntry(w);
      setNewWeight('');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogged = dailyLog.some(l => l.date === todayStr);

  return (
    <div className="page">
      <h1 style={{ marginBottom: 4 }}>Mi Progreso</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Seguimiento de tus metas y evolución</p>

      {/* Streak Stats */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="card card-padding" style={{ textAlign: 'center' }}>
          <Flame size={20} color="#F59E0B" style={{ margin: '0 auto 4px' }} />
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>{currentStreak}</p>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>Racha actual</p>
        </div>
        <div className="card card-padding" style={{ textAlign: 'center' }}>
          <CheckCircle size={20} color="#22c55e" style={{ margin: '0 auto 4px' }} />
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>{totalCompleted}</p>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>Días cumplidos</p>
        </div>
        <div className="card card-padding" style={{ textAlign: 'center' }}>
          <XCircle size={20} color="#ef4444" style={{ margin: '0 auto 4px' }} />
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>{totalFailed}</p>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>Días fallados</p>
        </div>
      </div>

      {/* Today's Check-in */}
      {!todayLogged && (
        <div className="card card-padding animate-in" style={{ marginBottom: 16, border: '2px solid var(--primary)' }}>
          <p style={{ fontWeight: 600, marginBottom: 10 }}>¿Cumpliste tus metas hoy?</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => logDay(true)}>
              <CheckCircle size={16} /> ¡Sí! ✅
            </button>
            <button className="btn btn-outline" style={{ flex: 1, color: '#ef4444', borderColor: '#ef4444' }} onClick={() => logDay(false)}>
              <XCircle size={16} /> No pude ❌
            </button>
          </div>
        </div>
      )}

      {/* Calendar Streaks */}
      <div className="card card-padding" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button className="btn btn-ghost btn-sm" onClick={prevMonth}>◀</button>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={16} /> {monthNames[viewMonth.month]} {viewMonth.year}
          </h3>
          <button className="btn btn-ghost btn-sm" onClick={nextMonth}>▶</button>
        </div>

        {/* Day Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
          {dayNames.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.625rem', fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {calendarData.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
              {week.map((day, di) => (
                <div 
                  key={`${wi}-${di}`} 
                  onClick={() => {
                    if (day.date && day.date <= todayStr && day.status !== 'future') {
                      editDayStatus(day.date, day.status !== 'completed');
                    }
                  }}
                  style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: day.status === 'completed' || day.status === 'failed' ? 700 : 400,
                  cursor: day.date && day.date <= todayStr && day.day ? 'pointer' : 'default',
                  background:
                    day.status === 'completed' ? 'rgba(34, 197, 94, 0.15)' :
                    day.status === 'failed' ? 'rgba(239, 68, 68, 0.12)' :
                    day.day ? 'var(--bg)' : 'transparent',
                  color:
                    day.status === 'completed' ? '#16a34a' :
                    day.status === 'failed' ? '#dc2626' :
                    day.status === 'future' ? 'var(--text-muted)' :
                    'var(--text-secondary)',
                  border: day.date === todayStr ? '2px solid var(--primary)' : 'none',
                  position: 'relative',
                }}>
                  {day.day !== null && (
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <span>{day.day}</span>
                        {day.calories && (
                          <span style={{ fontSize: '0.5rem', opacity: 0.8, marginTop: -2 }}>{day.calories}k</span>
                        )}
                      </div>
                      {day.status === 'completed' && !day.calories && (
                        <span style={{ position: 'absolute', bottom: 1, fontSize: '0.5rem' }}>✅</span>
                      )}
                      {day.status === 'failed' && (
                        <span style={{ position: 'absolute', bottom: 1, fontSize: '0.5rem' }}>❌</span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(34,197,94,0.15)', border: '1px solid #16a34a' }} /> Meta cumplida
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(239,68,68,0.12)', border: '1px solid #dc2626' }} /> No cumplida
          </div>
        </div>
      </div>

      {/* Water Tracking */}
      <div className="card card-padding" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Droplets size={18} color="#0ea5e9" />
          <h3>Agua Hoy</h3>
        </div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
          {[1,2,3,4,5,6,7,8].map(glass => {
            const todayWater = user?.waterIntake?.find(w => w.date === todayStr)?.glasses || 0;
            const isFull = glass <= todayWater;
            return (
              <button 
                key={glass}
                onClick={() => addWater(todayStr, isFull && todayWater === glass ? glass - 1 : glass)}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer',
                  opacity: isFull ? 1 : 0.3,
                  transform: isFull ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s', padding: 0
                }}
              >
                <Droplets size={24} color="#0ea5e9" fill={isFull ? '#0ea5e9' : 'transparent'} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Exercise Tracking */}
      <div className="card card-padding" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Dumbbell size={18} color="#f97316" />
          <h3>Ejercicio Hoy</h3>
        </div>
        <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(user?.exercises || []).filter(e => e.date === todayStr).length > 0 ? (
            user?.exercises?.filter(e => e.date === todayStr).map((ex, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg)', padding: '10px 14px', borderRadius: 8, borderLeft: '3px solid #f97316' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{ex.menu}</span>
                <span style={{ fontSize: '0.8125rem', color: '#f97316', fontWeight: 700 }}>{ex.calories} kcal 🔥</span>
              </div>
            ))
          ) : (
            <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: 8, textAlign: 'center', border: '1px dashed var(--border)' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Aún no has registrado ejercicios hoy.</p>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <select 
              className="input" 
              value={selectedEx} 
              onChange={e => setSelectedEx(e.target.value)} 
              style={{ flex: 2, padding: '0 8px', fontSize: '0.8125rem' }}
            >
              {EXERCISE_TYPES.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
            </select>
            
            {selectedEx === 'other' ? (
              <input 
                 className="input" 
                 placeholder="Ej. Bailar" 
                 value={newExercise} 
                 onChange={e => setNewExercise(e.target.value)} 
                 style={{ flex: 1.5, fontSize: '0.8125rem' }} 
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1.2 }}>
                <input 
                  className="input" 
                  type="number" 
                  placeholder="Min" 
                  value={exDuration} 
                  onChange={e => setExDuration(e.target.value)} 
                  style={{ width: '100%', textAlign: 'center', padding: '0 4px', fontSize: '0.8125rem' }} 
                />
                <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>min</span>
              </div>
            )}
            
            {selectedEx === 'other' ? (
              <input className="input" type="number" placeholder="Kcal" value={manualCal} onChange={e => setManualCal(e.target.value)} style={{ flex: 1, padding: '0 4px', fontSize: '0.8125rem' }} />
            ) : (
              <div className="input" style={{ flex: 1.1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: '#f97316', fontWeight: 700, fontSize: '0.8125rem', padding: '0 2px' }}>
                {parseInt(exDuration || '0') * (EXERCISE_TYPES.find(e => e.id === selectedEx)?.calPerMin || 0)} <span style={{fontSize:'0.5rem', marginLeft: 2, opacity: 0.8}}>kcal</span>
              </div>
            )}
          </div>
          
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => {
            if (selectedEx === 'other') {
              if (newExercise && manualCal) {
                addExercise(todayStr, newExercise, parseInt(manualCal));
                setNewExercise('');
                setManualCal('');
              }
            } else {
              const dur = parseInt(exDuration || '0');
              if (dur > 0) {
                const exData = EXERCISE_TYPES.find(e => e.id === selectedEx);
                if (exData) {
                  addExercise(todayStr, `${exData.label.substring(3).trim()} (${dur} min)`, dur * exData.calPerMin);
                  setExDuration('30');
                }
              }
            }
          }}>
            <Plus size={16} /> Agregar al registro
          </button>
        </div>
      </div>

      {/* Weight Progress */}
      {targetWeight && targetWeight !== currentWeight && (
        <div className="card card-padding" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Target size={18} color="var(--primary)" />
            <h3>Evolución de Peso</h3>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
              <span>Inicio: {startWeight} kg</span>
              <span>Meta: {targetWeight} kg</span>
            </div>
            <div style={{ height: 12, borderRadius: 6, background: 'var(--gray-200)', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                borderRadius: 6,
                background: 'linear-gradient(90deg, var(--primary), #D4A843)',
                width: `${progressPct}%`,
                transition: 'width 0.8s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>
                Actual: {currentWeight} kg
              </span>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: weightToGo > 0 ? '#F59E0B' : '#22c55e' }}>
                {weightToGo > 0 ? `Faltan ${weightToGo.toFixed(1)} kg` : '¡Meta alcanzada! 🎉'}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4, textAlign: 'center' }}>
              Has perdido <strong style={{ color: 'var(--primary)' }}>{weightLost.toFixed(1)} kg</strong> de {totalToLose.toFixed(1)} kg · {progressPct.toFixed(0)}% completado
            </p>
          </div>

          {/* SVG Chart */}
          {chartPoints && (
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '12px 4px', marginBottom: 12 }}>
              <svg viewBox={`0 0 ${chartPoints.W} ${chartPoints.H}`} style={{ width: '100%', height: 'auto' }}>
                {/* Grid lines */}
                {chartPoints.yLabels.map((yl, i) => (
                  <g key={i}>
                    <line x1={chartPoints.padX} y1={yl.y} x2={chartPoints.W - chartPoints.padX} y2={yl.y} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
                    <text x={chartPoints.padX - 6} y={yl.y + 3} textAnchor="end" fontSize="8" fill="var(--text-muted)">{yl.label}</text>
                  </g>
                ))}

                {/* Target line */}
                <line x1={chartPoints.padX} y1={chartPoints.targetY} x2={chartPoints.W - chartPoints.padX} y2={chartPoints.targetY} stroke="#D4A843" strokeWidth="1.5" strokeDasharray="6 3" />
                <text x={chartPoints.W - chartPoints.padX + 4} y={chartPoints.targetY + 3} fontSize="7" fill="#D4A843" fontWeight="600">Meta</text>

                {/* Area fill */}
                <path d={chartPoints.areaD} fill="url(#areaGrad)" opacity="0.3" />
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Line */}
                <path d={chartPoints.pathD} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Data points */}
                {chartPoints.points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="2" />
                    <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="7" fill="var(--text)" fontWeight="600">{p.weight}</text>
                  </g>
                ))}

                {/* X axis labels */}
                {chartPoints.points.filter((_, i, arr) => i === 0 || i === arr.length - 1 || i === Math.floor(arr.length / 2)).map((p, i) => (
                  <text key={i} x={p.x} y={chartPoints.H - 4} textAnchor="middle" fontSize="6.5" fill="var(--text-muted)">
                    {p.date.substring(5)}
                  </text>
                ))}
              </svg>
            </div>
          )}

          {/* Add Weight Entry */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="input-wrap" style={{ flex: 1 }}>
              <Scale size={18} />
              <input className="input" type="number" placeholder="Registrar peso (kg)" value={newWeight} onChange={e => setNewWeight(e.target.value)} step="0.1" />
            </div>
            <button className="btn btn-primary" onClick={handleAddWeight}>
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Glucose Progress */}
      <div className="card card-padding" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Activity size={18} color="#8b5cf6" />
          <h3>Glucosa</h3>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input className="input" type="number" placeholder="mg/dL" value={newGlucose} onChange={e => setNewGlucose(e.target.value)} style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={() => {
            if(newGlucose) { addGlucose(parseFloat(newGlucose)); setNewGlucose(''); }
          }}>Registrar</button>
        </div>
        <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 4 }}>
          {user?.glucoseHistory?.slice(-5).map((g, i) => (
            <div key={i} style={{ background: 'var(--bg)', padding: '8px 12px', borderRadius: 8, minWidth: 80, textAlign: 'center' }}>
              <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>{g.date.substring(5)}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#8b5cf6' }}>{g.glucose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Blood Pressure */}
      <div className="card card-padding" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <HeartPulse size={18} color="#ec4899" />
          <h3>Presión Arterial</h3>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input className="input" type="number" placeholder="Sistólica" value={newSystolic} onChange={e => setNewSystolic(e.target.value)} style={{ flex: 1 }} />
          <input className="input" type="number" placeholder="Diastólica" value={newDiastolic} onChange={e => setNewDiastolic(e.target.value)} style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={() => {
            if(newSystolic && newDiastolic) { addBloodPressure(parseInt(newSystolic), parseInt(newDiastolic)); setNewSystolic(''); setNewDiastolic(''); }
          }}>
            <Plus size={16} />
          </button>
        </div>
        <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 4 }}>
          {user?.bloodPressureHistory?.slice(-5).map((bp, i) => (
            <div key={i} style={{ background: 'var(--bg)', padding: '8px 12px', borderRadius: 8, minWidth: 90, textAlign: 'center' }}>
              <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>{bp.date.substring(5)}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ec4899' }}>{bp.systolic}/{bp.diastolic}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="card card-padding">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Award size={18} color="#D4A843" />
          <h3>Logros</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Primera semana', desc: '7 días seguidos cumpliendo metas', achieved: currentStreak >= 7, icon: '🔥' },
            { label: 'Disciplina de acero', desc: '14 días seguidos cumpliendo metas', achieved: currentStreak >= 14, icon: '💪' },
            { label: 'Primer kilo', desc: 'Has perdido al menos 1 kg', achieved: weightLost >= 1, icon: '⚡' },
            { label: 'Medio camino', desc: '50% del objetivo de peso cumplido', achieved: progressPct >= 50, icon: '🎯' },
            { label: '¡Meta alcanzada!', desc: 'Llegaste a tu peso objetivo', achieved: weightToGo <= 0, icon: '🏆' },
          ].map((m, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 8,
              background: m.achieved ? 'rgba(212,168,67,0.08)' : 'var(--bg)',
              opacity: m.achieved ? 1 : 0.5,
            }}>
              <span style={{ fontSize: '1.25rem' }}>{m.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{m.label}</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{m.desc}</p>
              </div>
              {m.achieved && <CheckCircle size={16} color="#D4A843" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
