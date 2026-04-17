import { useMemo, useState } from 'react';
import { COMMISSION_RATES, demoUsers } from '../data/users';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function CalculatorPage() {
  const [levelPeople, setLevelPeople] = useState(
    COMMISSION_RATES.map(r => {
      return demoUsers.filter(u => u.level === r.level && u.id !== 1 && u.subscriptionActive).length;
    })
  );

  const results = useMemo(() => {
    const breakdown = levelPeople.map((people, i) => {
      return {
        level: i + 1,
        rate: COMMISSION_RATES[i].rate,
        perPerson: COMMISSION_RATES[i].perPerson,
        maxPeople: COMMISSION_RATES[i].maxPeople,
        people,
        earnings: people * COMMISSION_RATES[i].perPerson,
      };
    });
    const totalPeople = breakdown.reduce((s, b) => s + b.people, 0);
    const totalEarnings = breakdown.reduce((s, b) => s + b.earnings, 0);
    return { breakdown, totalPeople, totalEarnings };
  }, [levelPeople]);

  const maxTotalEarnings = COMMISSION_RATES.reduce((sum, r) => sum + r.maxPeople * r.perPerson, 0);
  const progressPct = maxTotalEarnings > 0 ? Math.min((results.totalEarnings / maxTotalEarnings) * 100, 100) : 0;

  return (
    <div className="page">
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Simula tus ingresos potenciales</p>

      {/* Total Card */}
      <div className="gradient-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Ingreso mensual actual</p>
            <p style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: 4 }}>
              S/ {results.totalEarnings.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Red total</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{results.totalPeople.toLocaleString()}</p>
            <p style={{ fontSize: '0.6875rem', opacity: 0.7 }}>personas</p>
          </div>
        </div>
      </div>

      {/* Actual vs Desired Progress */}
      <div className="card card-padding" style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.875rem', marginBottom: 8 }}>Nivel de Llenado de la Red</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 6 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Simulado: <strong style={{color: 'var(--text)'}}>S/ {results.totalEarnings.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong></span>
          <span style={{ color: 'var(--text-secondary)' }}>Máx (100%): <strong style={{color: 'var(--primary)'}}>S/ {maxTotalEarnings.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</strong></span>
        </div>
        <div style={{ width: '100%', height: 10, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progressPct}%`,
            background: 'linear-gradient(90deg, #F59E0B, #10B981)',
            borderRadius: 5,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 6, textAlign: 'end' }}>
          {progressPct.toFixed(1)}% de la capacidad máxima de la matriz
        </p>
      </div>

      {/* Breakdown by level */}
      <div className="card card-padding" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <DollarSign size={18} color="#D4A843" />
          <h3>Desglose por Nivel</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {results.breakdown.map(b => {
            const fillPct = b.maxPeople ? Math.min((b.people / b.maxPeople) * 100, 100) : 0;
            return (
              <div key={b.level}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(43,122,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)' }}>
                      {b.level}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>
                        Nivel {b.level}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginLeft: 6 }}>
                        ({(b.rate * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
                      S/ {b.earnings.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                {/* Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input 
                    type="range" 
                    min="0" 
                    max={b.maxPeople} 
                    value={b.people}
                    onChange={(e) => {
                      const newArr = [...levelPeople];
                      newArr[b.level - 1] = parseInt(e.target.value);
                      setLevelPeople(newArr);
                    }}
                    style={{ flex: 1, accentColor: fillPct >= 90 ? '#D4A843' : 'var(--primary)' }}
                  />
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 700, minWidth: 52, textAlign: 'right',
                    color: fillPct >= 90 ? '#D4A843' : 'var(--text-secondary)',
                  }}>
                    {b.people.toLocaleString()}/{b.maxPeople.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div style={{ borderTop: '2px solid var(--border)', marginTop: 16, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={20} color="var(--primary)" />
            <span style={{ fontWeight: 700 }}>TOTAL MENSUAL</span>
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
            S/ {results.totalEarnings.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>



      {/* Info */}
      <div className="card card-padding" style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}>
        <p style={{ fontSize: '0.8125rem', color: 'var(--gold-dark)', lineHeight: 1.6 }}>
          💡 <strong>¿Cómo funciona?</strong> Cada suscriptor paga S/20/mes. El 70% (S/14) se distribuye como comisiones a través de 7 niveles. El formato muestra personas actuales / máximo por nivel.
        </p>
      </div>
    </div>
  );
}
