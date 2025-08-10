import React, { createContext, useContext, useState, useCallback } from 'react';

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback for components that don't have ToastProvider
    return {
      toast: ({ title, description, variant }: Omit<Toast, 'id'>) => {
        if (variant === 'destructive') {
          alert(`Error: ${title}\n${description}`);
        } else if (variant === 'success') {
          alert(`Success: ${title}\n${description}`);
        } else {
          alert(`${title}\n${description}`);
        }
      }
    };
  }
  return context;
};

const ToastContainer: React.FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300
            ${toast.variant === 'destructive' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : toast.variant === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-white border-gray-200 text-gray-900'
            }
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {toast.title && (
                <h4 className="font-semibold mb-1">{toast.title}</h4>
              )}
              {toast.description && (
                <p className="text-sm">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};