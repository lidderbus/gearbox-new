/* styles/global.css */
body {
  background-color: var(--app-bg-color, #f0f7f0);
  color: var(--app-text-color, #263238);
  transition: background-color 0.3s ease, color 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  border-width: 1px;
  transition: box-shadow 0.2s ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.08);
}

.card-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  font-weight: 500;
}

.btn {
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.btn:focus, .form-control:focus, .form-select:focus {
  box-shadow: 0 0 0 3px var(--app-focus-ring-color, rgba(46, 125, 50, 0.3));
}

.form-label {
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.table th {
  font-weight: 500;
}

.nav-tabs .nav-link {
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  font-weight: 700;
}

h2 {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

/* App header styling */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--app-border-color, #d0e0d0);
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--app-border-color, #d0e0d0);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logout-button {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  border-radius: 4px;
  padding: 0.3rem 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-button:hover {
  background-color: #dc3545;
  color: white;
}

/* Footer styling */
.app-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--app-border-color, #d0e0d0);
  text-align: center;
  font-size: 0.875rem;
  color: var(--app-muted-color, #546e7a);
}

/* Dark theme specific adjustments */
.dark .btn-outline-primary {
  color: #38b2ac;
  border-color: #38b2ac;
}

.dark .btn-outline-primary:hover {
  background-color: #38b2ac;
  color: #1a202c;
}

.dark .btn-primary {
  background-color: #38b2ac;
  border-color: #38b2ac;
}

.dark .btn-primary:hover {
  background-color: #319795;
  border-color: #319795;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-controls {
    width: 100%;
    justify-content: flex-end;
  }
}

/* Animation for loading spinner */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--app-primary-color, #2e7d32);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

/* Error message styling */
.error-message {
  padding: 1rem;
  border-radius: 8px;
  background-color: #f8d7da;
  color: #721c24;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
}

.warning-message {
  padding: 1rem;
  border-radius: 8px;
  background-color: #fff3cd;
  color: #856404;
  margin-bottom: 1rem;
  border: 1px solid #ffeeba;
}

.success-message {
  padding: 1rem;
  border-radius: 8px;
  background-color: #d4edda;
  color: #155724;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
}

/* Ensure tables are responsive */
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}