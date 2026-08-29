import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [activeNotification, setActiveNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success', duration = 2500) => {
    setActiveNotification({ id: Date.now(), message, type, duration });
  }, []);

  const clearNotification = useCallback(() => {
    setActiveNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ activeNotification, showNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
