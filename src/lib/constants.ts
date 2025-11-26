/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values
 */

// ============================================================================
// Time Constants (milliseconds)
// ============================================================================

/** 1 second in milliseconds */
export const ONE_SECOND_MS = 1000

/** 1 hour in milliseconds - used for token expiration checks */
export const ONE_HOUR_MS = 60 * 60 * 1000 // 3600000

// ============================================================================
// API Retry Configuration
// ============================================================================

/** Maximum number of retry attempts for API requests */
export const API_MAX_RETRIES = 3

/** Maximum number of retry attempts for photo downloads */
export const PHOTO_MAX_RETRIES = 3

/**
 * Calculate exponential backoff delay
 * @param attempt - Current attempt number (0-based)
 * @returns Delay in milliseconds (1s, 2s, 4s, ...)
 */
export function calculateRetryDelay(attempt: number): number {
  return Math.pow(2, attempt) * ONE_SECOND_MS
}
