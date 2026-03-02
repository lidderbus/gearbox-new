// Global toast notification utility
// Replaces alert() with non-blocking toast messages

let toastCallback = null;

export const setToastHandler = (handler) => {
  toastCallback = handler;
};

export const toast = {
  success: (message) => {
    if (toastCallback) toastCallback({ type: 'success', message });
  },
  error: (message) => {
    if (toastCallback) toastCallback({ type: 'danger', message });
  },
  warning: (message) => {
    if (toastCallback) toastCallback({ type: 'warning', message });
  },
  info: (message) => {
    if (toastCallback) toastCallback({ type: 'info', message });
  },
};
