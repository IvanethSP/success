import { useState } from 'react';
import { healthyRestaurants } from '../data/restaurants';
import { MapPin, Search, Star, ExternalLink, Navigation } from 'lucide-react';

export default function RestaurantsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = healthyRestaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page" style={{ paddingBottom: 80 }}>
      <div style={{ marginBottom: 20 }}>
        <h1>Restaurantes Saludables</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Opciones fit y saludables cerca de ti</p>
      </div>

      <div className="search-bar" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)' }}>
        <Search size={20} color="var(--text-muted)" style={{ marginRight: 10 }} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o tipo..." 
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: 'var(--text)' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.length > 0 ? filtered.map(r => (
          <div key={r.id} className="card animate-in" style={{
            display: 'flex', gap: 14, padding: 14, cursor: 'pointer', transition: 'transform 0.2s', backgroundColor: 'var(--bg-card)'
          }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, background: r.imageColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '2rem' }}>🥗</span>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{r.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(250, 204, 21, 0.15)', padding: '2px 6px', borderRadius: 6 }}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D97706' }}>{r.rating}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 6 }}>{r.type}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {r.tags.map(t => (
                    <span key={t} style={{ fontSize: '0.625rem', background: 'var(--bg)', padding: '2px 8px', borderRadius: 10, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                  <Navigation size={12} />
                  <span style={{ fontSize: '0.75rem' }}>A {r.distance} de ti</span>
                </div>
                
                <a 
                  href={r.mapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-sm btn-ghost" 
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', fontSize: '0.75rem', color: 'var(--primary)', background: 'rgba(43, 122, 61, 0.1)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MapPin size={12} /> Ir
                  <ExternalLink size={10} style={{ marginLeft: 2 }} />
                </a>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Search size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
            <p>No se encontraron restaurantes que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
