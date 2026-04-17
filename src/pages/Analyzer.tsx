import { useState } from 'react';
import { products } from '../data/products';
import { analyzeFoodImage, type FoodAnalysis } from '../services/geminiApi';
import { Camera, Utensils, Leaf, AlertCircle, Key, X, Sparkles, ImagePlus, Check } from 'lucide-react';

// Map AI tags to product tags for recommendations
const TAG_MAP: Record<string, string[]> = {
  'energía': ['energía', 'vitalidad', 'cafeína'],
  'vitaminas': ['vitaminas', 'diario'],
  'proteína': ['proteína', 'muscular', 'BCAA'],
  'fibra': ['fibra', 'digestión'],
  'detox': ['detox', 'limpieza', 'hígado', 'verde'],
  'inmunidad': ['inmunidad', 'defensa', 'betaglucanos'],
  'probiótico': ['probiótico', 'flora', 'digestión'],
  'anti-edad': ['anti-edad', 'colágeno', 'belleza'],
  'colágeno': ['colágeno', 'articulaciones'],
  'muscular': ['muscular', 'proteína', 'sport'],
  'termogénico': ['termogénico', 'fit', 'l-carnitina'],
  'control': ['control', 'metabolismo'],
  'metabolismo': ['metabolismo', 'termogénico'],
  'relajación': ['relajación', 'sueño', 'descanso'],
  'mental': ['mental', 'concentración'],
  'concentración': ['concentración', 'mental'],
  'vitalidad': ['vitalidad', 'energía'],
};

function getRecommendedProducts(tags: string[]) {
  const expandedTags = new Set<string>();
  tags.forEach(t => {
    expandedTags.add(t);
    (TAG_MAP[t] || []).forEach(mapped => expandedTags.add(mapped));
  });

  const scored = products.map(p => {
    let score = 0;
    p.tags.forEach(tag => {
      if (expandedTags.has(tag)) score += 2;
    });
    return { ...p, score };
  }).filter(p => p.score > 0).sort((a, b) => b.score - a.score);

  return scored.slice(0, 4);
}

export default function AnalyzerPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };

  const saveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setShowKeyInput(false);
  };

  const analyze = async () => {
    if (!imageUrl) return;

    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeFoodImage(imageUrl, apiKey);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'Error al analizar la imagen');
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setImageUrl(null);
    setResult(null);
    setError(null);
  };

  const recProducts = result?.recommended_tags
    ? getRecommendedProducts(result.recommended_tags)
    : [];

  const logFood = () => {
    if (!result) return;
    const today = new Date().toISOString().split('T')[0];
    const key = `fuxi_custom_foods_${today}`;
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push({
        id: Date.now().toString(),
        name: result.description,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fats: result.fats,
      });
      localStorage.setItem(key, JSON.stringify(existing));
      alert('¡Comida registrada exitosamente en tu balance diario!');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h1>Análisis de Comida</h1>
        <button
          className="btn btn-sm btn-ghost"
          onClick={() => setShowKeyInput(!showKeyInput)}
          title="Configurar API Key"
          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <Key size={14} />
          {apiKey ? '✓ API' : 'API Key'}
        </button>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Sparkles size={14} color="var(--primary)" />
        Analiza tu comida con IA y recibe recomendaciones FUXION
      </p>

      {/* API Key Input */}
      {showKeyInput && (
        <div className="card card-padding animate-in" style={{ marginBottom: 16, background: 'rgba(43,122,61,0.04)', border: '1px solid rgba(43,122,61,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ fontSize: '0.875rem' }}>🔑 Google Gemini API Key</h3>
            <button className="btn btn-sm btn-ghost" onClick={() => setShowKeyInput(false)}><X size={14} /></button>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.5 }}>
            Obtén tu API key gratis en{' '}
            <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              aistudio.google.com/apikey
            </a>
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              style={{ flex: 1, paddingLeft: 12 }}
            />
            <button className="btn btn-primary" onClick={saveApiKey} disabled={!apiKey}>
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Upload Zone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label htmlFor="food-upload" style={{ height: '100%' }}>
          <div className={`upload-zone ${imageUrl ? 'has-image' : ''}`} style={{ height: '100%', padding: '24px 12px' }}>
            {imageUrl ? (
              <img src={imageUrl} alt="Comida" className="upload-preview" />
            ) : (
              <>
                <Camera size={32} color="var(--text-muted)" style={{ marginBottom: 8 }} />
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Tu foto</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Desde cámara</p>
              </>
            )}
          </div>
        </label>
        
        <button 
          className="upload-zone" 
          style={{ height: '100%', borderStyle: 'solid', borderColor: 'rgba(43,122,61,0.2)', background: 'rgba(43,122,61,0.05)', padding: '24px 12px' }}
          onClick={() => {
            setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80');
            setResult(null);
            setError(null);
          }}
        >
          <ImagePlus size={32} color="var(--primary)" style={{ marginBottom: 8 }} />
          <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--primary)' }}>Foto de Muestra</p>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Para probar la IA</p>
        </button>
      </div>

      <input id="food-upload" type="file" accept="image/*" capture="environment" onChange={handleImageUpload} style={{ display: 'none' }} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, marginBottom: 20 }}>
        {imageUrl && !result && (
          <button className="btn btn-primary btn-full" onClick={analyze} disabled={analyzing}>
            {analyzing ? (
              <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Analizando con IA...</>
            ) : (
              <><Sparkles size={16} /> Analizar Comida</>
            )}
          </button>
        )}
        {imageUrl && (
          <button className="btn btn-ghost" onClick={reset}>Nueva foto</button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="card card-padding animate-in" style={{ marginBottom: 16, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} color="#ef4444" />
            <p style={{ fontSize: '0.8125rem', color: '#ef4444' }}>{error}</p>
          </div>
          {error.includes('API Key') && (
            <button className="btn btn-sm btn-ghost" style={{ marginTop: 8 }} onClick={() => setShowKeyInput(true)}>
              <Key size={14} /> Configurar API Key
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Description */}
          <div className="card card-padding">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Utensils size={18} color="var(--primary)" />
              <h3>Plato Identificado</h3>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>{result.description}</p>

            {/* Food items */}
            {result.food_items && result.food_items.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
                {result.food_items.map((item, i) => (
                  <span key={i} style={{
                    fontSize: '0.6875rem', padding: '3px 8px', borderRadius: 12,
                    background: 'rgba(43,122,61,0.08)', color: 'var(--primary)', fontWeight: 500,
                  }}>{item}</span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Puntuación de salud:</span>
              <div style={{ display: 'flex', gap: 2 }}>
                {[...Array(10)].map((_, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: i < result.health_score
                      ? result.health_score >= 7 ? '#22c55e' : result.health_score >= 4 ? '#f59e0b' : '#ef4444'
                      : 'var(--gray-200)',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: result.health_score >= 7 ? '#22c55e' : result.health_score >= 4 ? '#f59e0b' : '#ef4444' }}>
                {result.health_score}/10
              </span>
            </div>
          </div>

          {/* Macros */}
          <div className="card card-padding">
            <h3 style={{ marginBottom: 12 }}>Desglose Nutricional</h3>
            <div className="macro-bar">
              <div className="macro-item" style={{ background: 'rgba(239,68,68,0.08)' }}>
                <p className="macro-value" style={{ color: '#ef4444' }}>{result.calories}</p>
                <p className="macro-label">Calorías</p>
              </div>
              <div className="macro-item" style={{ background: 'rgba(59,130,246,0.08)' }}>
                <p className="macro-value" style={{ color: '#3b82f6' }}>{result.protein}g</p>
                <p className="macro-label">Proteína</p>
              </div>
              <div className="macro-item" style={{ background: 'rgba(245,158,11,0.08)' }}>
                <p className="macro-value" style={{ color: '#f59e0b' }}>{result.carbs}g</p>
                <p className="macro-label">Carbos</p>
              </div>
              <div className="macro-item" style={{ background: 'rgba(168,85,247,0.08)' }}>
                <p className="macro-value" style={{ color: '#8b5cf6' }}>{result.fats}g</p>
                <p className="macro-label">Grasas</p>
              </div>
            </div>
              <div className="macro-item" style={{ marginTop: 8, background: 'rgba(34,197,94,0.08)' }}>
                <p className="macro-value" style={{ color: '#22c55e' }}>{result.fiber}g</p>
                <p className="macro-label">Fibra</p>
              </div>
            </div>
            
            <button className="btn btn-primary btn-full" style={{ marginBottom: 16 }} onClick={logFood}>
              <Check size={18} /> Añadir a mi Consumo Diario
            </button>

            {/* AI Suggestion */}
          {result.suggestions && (
            <div className="card card-padding" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles size={16} color="#6366f1" />
                <h3 style={{ fontSize: '0.875rem', color: '#6366f1' }}>Consejo IA</h3>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {result.suggestions}
              </p>
            </div>
          )}

          {/* Recommendations */}
          {recProducts.length > 0 && (
            <div className="card card-padding">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Leaf size={18} color="var(--primary)" />
                <h3>Productos FUXION Recomendados</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recProducts.map(p => (
                  <div key={p.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 10, borderRadius: 8, background: 'var(--bg)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: `linear-gradient(135deg, ${p.imageColor}, ${p.imageColor}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                      {p.name.substring(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{p.name}</p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{p.category} · {p.flavor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      {!result && !imageUrl && (
        <div className="card card-padding" style={{ marginTop: 8 }}>
          <h3 style={{ marginBottom: 8 }}>💡 Tips para mejores resultados</h3>
          <ul style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6, lineHeight: 1.5 }}>
            <li>Fotografía desde arriba para captar todos los alimentos</li>
            <li>Usa buena iluminación natural</li>
            <li>Muestra el plato completo sin obstrucciones</li>
            <li>Formatos aceptados: JPG, PNG, WebP</li>
          </ul>
          {!apiKey && (
            <div style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p style={{ fontSize: '0.75rem', color: '#D97706', lineHeight: 1.5 }}>
                ⚠️ Necesitas una <strong>API Key de Google Gemini</strong> (gratis) para el análisis real.
                <button className="btn btn-sm btn-ghost" style={{ marginLeft: 8, color: 'var(--primary)' }} onClick={() => setShowKeyInput(true)}>
                  Configurar ahora →
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
