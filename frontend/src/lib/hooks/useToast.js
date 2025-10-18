import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const newToast = { message, type, id: Date.now() }; 
    setToasts((prevToasts) => [...prevToasts, newToast]); 
    setTimeout(() => hideToast(newToast.id), 3000); 
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id)); 
  }, []);

  return { toasts, showToast, hideToast };
};