// Session timeout utilities

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // Show warning 5 minutes before expiry

let timeoutTimer: NodeJS.Timeout | null = null;
let warningTimer: NodeJS.Timeout | null = null;
let expiryTime: number | null = null;

export const startSessionTimer = (onTimeout: () => void, onWarning?: () => void) => {
  // Clear any existing timers
  clearSessionTimer();

  // Set expiry time
  expiryTime = Date.now() + SESSION_TIMEOUT;

  // Set warning timer (5 minutes before expiry)
  if (onWarning) {
    warningTimer = setTimeout(() => {
      onWarning();
    }, SESSION_TIMEOUT - WARNING_TIME);
  }

  // Set timeout timer
  timeoutTimer = setTimeout(() => {
    onTimeout();
  }, SESSION_TIMEOUT);
};

export const clearSessionTimer = () => {
  if (timeoutTimer) {
    clearTimeout(timeoutTimer);
    timeoutTimer = null;
  }
  if (warningTimer) {
    clearTimeout(warningTimer);
    warningTimer = null;
  }
  expiryTime = null;
};

export const resetSessionTimer = (onTimeout: () => void, onWarning?: () => void) => {
  startSessionTimer(onTimeout, onWarning);
};

export const getTimeRemaining = (): number => {
  if (!expiryTime) return 0;
  return Math.max(0, expiryTime - Date.now());
};

export const isSessionExpired = (): boolean => {
  return getTimeRemaining() === 0;
};

