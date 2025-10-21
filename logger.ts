// backend/src/utils/logger.ts
/**
 * Simple colored logger utility
 * Supports info, warn, error, and debug
 */

enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

function log(level: LogLevel, ...args: any[]) {
  const timestamp = new Date().toISOString();
  const color =
    level === LogLevel.ERROR
      ? "\x1b[31m"
      : level === LogLevel.WARN
      ? "\x1b[33m"
      : level === LogLevel.DEBUG
      ? "\x1b[36m"
      : "\x1b[32m";

  console.log(`${color}[${timestamp}] [${level}]`, ...args, "\x1b[0m");
}

const logger = {
  info: (...args: any[]) => log(LogLevel.INFO, ...args),
  warn: (...args: any[]) => log(LogLevel.WARN, ...args),
  error: (...args: any[]) => log(LogLevel.ERROR, ...args),
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== "production") log(LogLevel.DEBUG, ...args);
  },
};

export default logger;
