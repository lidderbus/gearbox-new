// src/hooks/useInIframe.js
// Detect if the app is running inside an iframe (e.g., embedded in ERP dashboard)

export function useInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export default useInIframe;
