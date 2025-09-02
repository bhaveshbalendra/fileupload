/**
 * Logger utility that only logs in development mode
 * This prevents console.log statements from appearing in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Log messages only in development mode
 * @param {...any} args - Arguments to pass to console.log
 */
export const devLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

/**
 * Log errors only in development mode
 * @param {...any} args - Arguments to pass to console.error
 */
export const devError = (...args: any[]) => {
  if (isDevelopment) {
    console.error(...args);
  }
};

/**
 * Log warnings only in development mode
 * @param {...any} args - Arguments to pass to console.warn
 */
export const devWarn = (...args: any[]) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

export default {
  log: devLog,
  error: devError,
  warn: devWarn
};