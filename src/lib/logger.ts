// Lightweight logger wrapper with levels and NODE_ENV gating
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDev = process.env.NODE_ENV === 'development';

function shouldLog(level: LogLevel) {
  if (isDev) return true;
  // In production only warn and error
  return level === 'warn' || level === 'error';
}

export const log = {
  debug: (...args: any[]) => {
    if (shouldLog('debug')) console.debug(...args);
  },
  info: (...args: any[]) => {
    if (shouldLog('info')) console.info(...args);
  },
  warn: (...args: any[]) => {
    if (shouldLog('warn')) console.warn(...args);
  },
  error: (...args: any[]) => {
    if (shouldLog('error')) console.error(...args);
  }
};

export default log;
