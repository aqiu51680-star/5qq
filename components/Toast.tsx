import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const bgColor = toast.type === 'success' ? 'bg-green-50 border-green-200' : 
                  toast.type === 'error' ? 'bg-red-50 border-red-200' : 
                  'bg-blue-50 border-blue-200';
  
  const textColor = toast.type === 'success' ? 'text-green-700' : 
                    toast.type === 'error' ? 'text-red-700' : 
                    'text-blue-700';
  
  const iconColor = toast.type === 'success' ? 'text-green-500' : 
                    toast.type === 'error' ? 'text-red-500' : 
                    'text-blue-500';

  return (
    <div className={`${bgColor} border rounded-lg shadow-lg p-4 flex items-center gap-3 animate-in slide-in-from-top`}>
      {toast.type === 'success' && <CheckCircle className={`${iconColor} flex-shrink-0`} size={20} />}
      {toast.type === 'error' && <AlertCircle className={`${iconColor} flex-shrink-0`} size={20} />}
      <span className={`${textColor} font-medium flex-1`}>{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
