// Logging configuration
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Set the current log level (can be changed based on environment)
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'production' ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;

// Custom console wrapper
export const logger = {
  error: (...args) => {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.ERROR) {
      console.error(...args);
    }
  },
  warn: (...args) => {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.WARN) {
      console.warn(...args);
    }
  },
  info: (...args) => {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.INFO) {
      console.info(...args);
    }
  },
  log: (...args) => {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.INFO) {
      console.log(...args);
    }
  },
  debug: (...args) => {
    if (CURRENT_LOG_LEVEL >= LOG_LEVELS.DEBUG) {
      console.debug(...args);
    }
  }
};

// Suppress specific warnings
export const suppressRepairWarnings = () => {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Filter out repair.js warnings
    if (args[0] && typeof args[0] === 'string' && args[0].includes('repair.js:')) {
      return; // Suppress these warnings
    }
    originalWarn.apply(console, args);
  };
};

export default logger;