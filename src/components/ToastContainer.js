import React, { useState, useEffect, useCallback } from 'react';
import { Toast, ToastContainer as BSToastContainer } from 'react-bootstrap';
import { setToastHandler } from '../utils/toast';

const ICON_MAP = {
  success: 'bi-check-circle-fill',
  danger: 'bi-x-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, message }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  useEffect(() => {
    setToastHandler(addToast);
    return () => setToastHandler(null);
  }, [addToast]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <BSToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          bg={t.type}
          onClose={() => removeToast(t.id)}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <i className={`bi ${ICON_MAP[t.type] || 'bi-info-circle'} me-2`}></i>
            <strong className="me-auto">
              {t.type === 'success' ? '成功' : t.type === 'danger' ? '错误' : t.type === 'warning' ? '警告' : '提示'}
            </strong>
          </Toast.Header>
          <Toast.Body className={t.type === 'danger' || t.type === 'success' ? 'text-white' : ''}>
            {t.message}
          </Toast.Body>
        </Toast>
      ))}
    </BSToastContainer>
  );
}
