import { useState } from 'react';
import { demoUsers, demoEarnings, COMMISSION_RATES } from '../data/users';
import { Users, TrendingUp, DollarSign, CheckCircle, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TreeNode {
  user: typeof demoUsers[0];
  children: TreeNode[];
}

function buildTree(users: typeof demoUsers, parentCode: string | null): TreeNode[] {
  return users
    .filter(u => u.referredBy === parentCode)
    .map(u => ({
      user: u,
      children: buildTree(users, u.referralCode),
    }));
}

function HorizontalNode({ node, currentUser, depth = 0 }: { node: TreeNode; currentUser: any; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const initials = node.user.name.split(' ').map(n => n[0]).join('').substring(0, 2);
  const isActive = node.user.subscriptionActive;
  const hasChildren = node.children.length > 0;

  // Show WhatsApp only to sponsor and top 3 referrals
  const isSponsor = currentUser?.referralCode === node.user.referredBy;
  const isTopReferral = currentUser?.referredBy === node.user.referralCode;
  const showWhatsapp = (isSponsor || isTopReferral || currentUser?.isAdmin) && node.user.whatsapp;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
      {/* Node */}
      <div 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 64, cursor: hasChildren ? 'pointer' : 'default' }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: isActive ? 'linear-gradient(135deg, var(--primary), #2B7A3D)' : 'rgba(239,68,68,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: isActive ? '#fff' : '#ef4444', fontSize: '0.6875rem', fontWeight: 700,
          border: node.user.isAdmin ? '2px solid #D4A843' : 'none',
          boxShadow: isActive ? '0 2px 8px rgba(43,122,61,0.3)' : 'none',
        }}>
          {initials}
        </div>
        <span style={{ fontSize: '0.5625rem', fontWeight: 600, marginTop: 2, maxWidth: 64, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {node.user.name.split(' ')[0]}
        </span>
        <span style={{ fontSize: '0.5rem', color: isActive ? '#22c55e' : '#ef4444' }}>
          N{node.user.level} · {isActive ? '✓' : '✗'}
        </span>
        {showWhatsapp && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 1 }}>
            <Phone size={8} color="var(--primary)" />
            <span style={{ fontSize: '0.4375rem', color: 'var(--text-muted)' }}>{node.user.whatsapp?.slice(-4)}</span>
          </div>
        )}
        {hasChildren && (
          <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {expanded ? '◂' : `▸ ${node.children.length}`}
          </span>
        )}
      </div>

      {/* Children - horizontal */}
      {hasChildren && expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginLeft: 4, position: 'relative', paddingLeft: 12 }}>
          {/* Connection line */}
          <div style={{ position: 'absolute', left: 0, top: 20, bottom: 20, width: 2, background: 'var(--border)', borderRadius: 1 }} />
          {node.children.map((child, i) => (
            <div key={child.user.id} style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: -12, top: 18, width: 12, height: 2, background: 'var(--border)' }} />
              <HorizontalNode node={child} currentUser={currentUser} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NetworkPage() {
  const { user } = useAuth();
  const tree = buildTree(demoUsers, null);
  const rootNode = tree[0];

  const levelStats = COMMISSION_RATES.map(rate => {
    const usersAtLevel = demoUsers.filter(u => u.level === rate.level && u.id !== 1);
    const activeAtLevel = usersAtLevel.filter(u => u.subscriptionActive);
    return {
      ...rate,
      total: usersAtLevel.length,
      active: activeAtLevel.length,
      earnings: activeAtLevel.length * rate.perPerson,
    };
  });

  const totalActive = demoUsers.filter(u => u.id !== 1 && u.subscriptionActive).length;

  return (
    <div className="page">
      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 16 }}>
        <div className="card card-padding" style={{ textAlign: 'center' }}>
          <Users size={16} color="var(--primary)" style={{ margin: '0 auto 4px' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 700 }}>{demoUsers.length - 1}</p>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>Total</p>
        </div>
        <div className="card card-padding" style={{ textAlign: 'center' }}>
          <CheckCircle size={16} color="#22c55e" style={{ margin: '0 auto 4px' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#22c55e' }}>{totalActive}</p>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>Activos</p>
        </div>
        <div className="card card-padding" style={{ textAlign: 'center' }}>
          <DollarSign size={16} color="#D4A843" style={{ margin: '0 auto 4px' }} />
          <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#D4A843' }}>S/{demoEarnings.total.toFixed(0)}</p>
          <p style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>Mes</p>
        </div>
      </div>

      {/* Horizontal Network Tree */}
      <div className="card card-padding" style={{ marginBottom: 16, overflowX: 'auto' }}>
        <h3 style={{ marginBottom: 12 }}>Árbol de Red <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 400 }}>(toca para expandir)</span></h3>
        <div style={{ minWidth: 'fit-content', padding: '4px 0' }}>
          {rootNode && <HorizontalNode node={rootNode} currentUser={user} />}
        </div>
      </div>

      {/* Level Breakdown */}
      <div className="card card-padding">
        <h3 style={{ marginBottom: 12 }}>Desglose por Nivel</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {levelStats.filter(l => l.total > 0).map(l => (
            <div key={l.level} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(43,122,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--primary)' }}>
                  N{l.level}
                </div>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Nivel {l.level} <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>({(l.rate * 100).toFixed(0)}%)</span></p>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                    {l.active}/{l.total} activos (Máx: {l.maxPeople}) · S/{l.perPerson.toFixed(2)}/persona
                  </p>
                </div>
              </div>
              <p style={{ fontWeight: 700, color: 'var(--primary)' }}>S/ {l.earnings.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
