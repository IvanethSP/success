import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, CheckCircle, Package } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, total, itemCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [ordered, setOrdered] = useState(false);
  const [orders, setOrders] = useState<{ date: string; items: number; total: number }[]>(() => {
    const saved = localStorage.getItem('fuxi_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const SUBSCRIBER_DISCOUNT = 0.15;
  const discount = total * SUBSCRIBER_DISCOUNT;
  const finalTotal = total - discount;

  const handleOrder = () => {
    const order = {
      date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: itemCount,
      total: finalTotal,
    };
    const newOrders = [order, ...orders];
    setOrders(newOrders);
    localStorage.setItem('fuxi_orders', JSON.stringify(newOrders));
    clearCart();
    setOrdered(true);
    showToast('¡Pedido confirmado! 🎉', 'success');
  };

  if (ordered) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
        <div className="animate-in">
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle size={40} color="#22c55e" />
          </div>
          <h1>¡Pedido Confirmado!</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '8px 0 24px', maxWidth: 280 }}>
            Tu pedido ha sido procesado exitosamente. Recibirás tus productos FUXION pronto.
          </p>
          <button className="btn btn-primary" onClick={() => { setOrdered(false); navigate('/catalog'); }}>
            <ShoppingBag size={16} /> Seguir Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button className="btn btn-sm btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1>Mi Carrito</h1>
        {itemCount > 0 && <span className="badge badge-primary">{itemCount}</span>}
      </div>

      {items.length === 0 ? (
        <div>
          <div className="empty-state">
            <ShoppingBag size={48} />
            <h3 style={{ marginTop: 8 }}>Tu carrito está vacío</h3>
            <p style={{ margin: '8px 0 16px' }}>Explora nuestro catálogo y agrega productos</p>
            <button className="btn btn-primary" onClick={() => navigate('/catalog')}>
              Ver Catálogo
            </button>
          </div>

          {/* Order History */}
          {orders.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: '0.875rem', marginBottom: 12 }}>Pedidos anteriores</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {orders.map((o, i) => (
                  <div key={i} className="card card-padding" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(43,122,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={18} color="var(--primary)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{o.items} productos</p>
                      <p style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{o.date}</p>
                    </div>
                    <p style={{ fontWeight: 700, color: 'var(--primary)' }}>S/ {o.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {items.map(item => (
              <div key={item.productId} className="card card-padding" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                  background: `linear-gradient(135deg, ${item.imageColor}, ${item.imageColor}cc)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: '0.75rem',
                }}>
                  {item.name.substring(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>S/ {item.price.toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
                <button className="qty-btn" onClick={() => removeFromCart(item.productId)} style={{ color: '#ef4444' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card card-padding" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>Subtotal ({itemCount} productos)</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#22c55e' }}>
                <span>Descuento suscriptor (-15%)</span>
                <span>-S/ {discount.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>S/ {finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-full btn-lg" onClick={handleOrder}>
            <CheckCircle size={18} /> Confirmar Pedido
          </button>

          <button className="btn btn-ghost btn-full" onClick={clearCart} style={{ marginTop: 8, color: 'var(--text-secondary)' }}>
            Vaciar carrito
          </button>
        </>
      )}
    </div>
  );
}
