import { useState } from 'react';
import { products, CATEGORIES, PRODUCT_IMAGES, type Product } from '../data/products';
import { Search, X, ShoppingBag, ShoppingCart, Plus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

export default function CatalogPage() {
  const [activeBrand, setActiveBrand] = useState('FUXION');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const BRANDS = ['FUXION', 'Omnilife', 'Santa Natura', 'Herbalife'];

  const filtered = products.filter(p => {
    const matchBrand = p.brand === activeBrand;
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    return matchBrand && matchCat && matchSearch;
  });

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    addToCart({ id: product.id, name: product.name, imageColor: product.imageColor });
    setAddedIds(prev => new Set(prev).add(product.id));
    showToast(`${product.name} añadido al carrito`, 'cart');
    setTimeout(() => setAddedIds(prev => { const n = new Set(prev); n.delete(product.id); return n; }), 1500);
  };

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h1>Tienda {activeBrand}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>{filtered.length} productos disponibles</p>
        </div>
        <div className="badge badge-primary">
          <ShoppingBag size={12} /> {filtered.length}
        </div>
      </div>

      {/* Search */}
      <div className="input-wrap" style={{ marginBottom: 12 }}>
        <Search size={18} />
        <input className="input" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Brand Filters */}
      <div className="category-filters" style={{ marginBottom: 12 }}>
        {BRANDS.map(brand => (
          <button key={brand} className={`filter-pill ${activeBrand === brand ? 'active' : ''}`} onClick={() => { setActiveBrand(brand); setActiveCategory('Todos'); }}>
            {brand}
          </button>
        ))}
      </div>

      {/* Category Filters */}
      <div className="category-filters" style={{ marginBottom: 16 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`filter-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid-2">
        {filtered.map(p => (
          <div key={p.id} className="card product-card" onClick={() => setSelected(p)}>
            <div className="product-img" style={{ background: PRODUCT_IMAGES[p.id] ? '#f8f9fa' : `linear-gradient(135deg, ${p.imageColor}, ${p.imageColor}cc)`, position: 'relative' }}>
              {PRODUCT_IMAGES[p.id] ? (
                <img src={PRODUCT_IMAGES[p.id]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              ) : (
                p.name.substring(0, 2).toUpperCase()
              )}
              {/* Quick add button */}
              <button 
                className="quick-add-btn"
                onClick={(e) => handleAddToCart(p, e)}
                style={{ background: addedIds.has(p.id) ? '#22c55e' : 'rgba(255,255,255,0.9)' }}
              >
                {addedIds.has(p.id) ? <Check size={14} color="#fff" /> : <Plus size={14} color="var(--primary)" />}
              </button>
            </div>
            <div className="product-info">
              <p className="product-name">{p.name}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)' }}>S/ 35.00</span>
                <span className="badge badge-primary" style={{ fontSize: '0.6rem' }}>{p.flavor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: PRODUCT_IMAGES[selected.id] ? '#f8f9fa' : `linear-gradient(135deg, ${selected.imageColor}, ${selected.imageColor}cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.25rem', overflow: 'hidden' }}>
                  {PRODUCT_IMAGES[selected.id] ? (
                    <img src={PRODUCT_IMAGES[selected.id]} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : selected.name.substring(0, 2)}
                </div>
                <div>
                  <h2>{selected.name}</h2>
                  <span className="badge badge-gold">{selected.category}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ border: 'none', background: 'var(--bg)', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} color="var(--text-secondary)" />
              </button>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '12px 16px', background: 'var(--bg)', borderRadius: 8 }}>
              <div>
                <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>S/ 35.00</p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>S/ 29.75 para suscriptores</p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={(e) => { handleAddToCart(selected, e as any); setSelected(null); }}>
                <ShoppingCart size={14} /> Agregar
              </button>
            </div>

            <p style={{ marginBottom: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.description}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <h3 style={{ marginBottom: 6, color: 'var(--primary)' }}>🧪 Ingredientes</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.ingredients}</p>
              </div>
              <div>
                <h3 style={{ marginBottom: 6, color: 'var(--primary)' }}>✨ Beneficios</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.benefits}</p>
              </div>
              <div>
                <h3 style={{ marginBottom: 6, color: 'var(--primary)' }}>🍃 Sabor</h3>
                <span className="badge badge-primary" style={{ fontSize: '0.8125rem', padding: '6px 14px' }}>{selected.flavor}</span>
              </div>
              <div>
                <h3 style={{ marginBottom: 6, color: 'var(--primary)' }}>🏷️ Tags</h3>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selected.tags.map(t => (
                    <span key={t} className="badge badge-gold">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
