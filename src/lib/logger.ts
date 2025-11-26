/**
 * Simple logging utility
 * Conditionally logs based on NODE_ENV
 */

const isDevelopment = process.env.NODE_ENV !== 'production'

/**
 * Log info message (only in development)
 */
export function logInfo(...args: any[]): void {
  if (isDevelopment) {
    console.log(...args)
  }
}

/**
 * Log warning message (always shown)
 */
export function logWarn(...args: any[]): void {
  console.warn(...args)
}

/**
 * Log error message (always shown)
 */
export function logError(...args: any[]): void {
  console.error(...args)
}
