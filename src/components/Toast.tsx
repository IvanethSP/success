import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { CheckCircle, AlertTriangle, ShoppingCart, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'cart';
}

interface ToastContextType {
  showToast: (message: string, type?: 'success' | 'warning' | 'cart') => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'warning' | 'cart' = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const icons = {
    success: <CheckCircle size={18} color="#22c55e" />,
    warning: <AlertTriangle size={18} color="#F59E0B" />,
    cart: <ShoppingCart size={18} color="#3b82f6" />,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast animate-in">
            {icons[t.type]}
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => setToasts(prev => prev.filter(p => p.id !== t.id))}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
