// src/utils/logger.js
import { getSessionId } from './sessionId'; // Assuming this function retrieves the session ID

const LOG_LEVELS = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  DEBUG: 'debug',
};

/**
 * Logs messages to the server.
 * @param {string} level - The log level (info, warn, error, debug).
 * @param {string} message - The log message.
 */
export function logToServer(level, message) {
  const sessionId = getSessionId();
  const logData = {
    level,
    message,
    sessionId,
    timestamp: new Date().toISOString(),
  };

  // Send log to the server
  fetch(`${process.env.VUE_APP_API_URL}/log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logData),
  }).catch((error) => {
    console.error('Failed to send log to server:', error);
  });
}

/**
 * Convenience function to log an info-level message.
 * @param {string} message - The message to log.
 */
export function logInfo(message) {
  logToServer(LOG_LEVELS.INFO, message);
}

/**
 * Convenience function to log a warning-level message.
 * @param {string} message - The message to log.
 */
export function logWarn(message) {
  logToServer(LOG_LEVELS.WARN, message);
}

/**
 * Convenience function to log an error-level message.
 * @param {string} message - The message to log.
 */
export function logError(message) {
  logToServer(LOG_LEVELS.ERROR, message);
}

/**
 * Convenience function to log a debug-level message.
 * @param {string} message - The message to log.
 */
export function logDebug(message) {
  logToServer(LOG_LEVELS.DEBUG, message);
}
