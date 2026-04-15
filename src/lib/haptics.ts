/**
 * Haptic Feedback Utilities
 * Provides tactile feedback on supported devices (iOS Safari, Android Chrome)
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

interface HapticPatterns {
  light: number[];
  medium: number[];
  heavy: number[];
  selection: number[];
  success: number[];
  warning: number[];
  error: number[];
}

const patterns: HapticPatterns = {
  light: [10],
  medium: [20],
  heavy: [30],
  selection: [5],
  success: [10, 50, 10],
  warning: [20, 100, 20],
  error: [30, 50, 30, 50, 30],
};

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  return typeof window !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Trigger haptic feedback
 * @param style - The type of haptic feedback
 */
export function haptic(style: HapticStyle = 'light'): void {
  if (!isHapticSupported()) return;

  try {
    navigator.vibrate(patterns[style]);
  } catch {
    // Silently fail if vibration is not allowed
  }
}

/**
 * Haptic feedback for button press
 */
export function hapticButton(): void {
  haptic('light');
}

/**
 * Haptic feedback for selection change
 */
export function hapticSelection(): void {
  haptic('selection');
}

/**
 * Haptic feedback for success action
 */
export function hapticSuccess(): void {
  haptic('success');
}

/**
 * Haptic feedback for warning
 */
export function hapticWarning(): void {
  haptic('warning');
}

/**
 * Haptic feedback for error
 */
export function hapticError(): void {
  haptic('error');
}

/**
 * Haptic feedback for death tracking (heavy impact)
 */
export function hapticDeath(): void {
  haptic('heavy');
}

/**
 * Haptic feedback for drink tracking
 */
export function hapticDrink(): void {
  haptic('medium');
}

/**
 * Haptic feedback for round win
 */
export function hapticWin(): void {
  if (!isHapticSupported()) return;
  // Victory pattern: short-short-long
  navigator.vibrate([20, 50, 20, 50, 100]);
}

/**
 * Haptic feedback for round loss
 */
export function hapticLoss(): void {
  if (!isHapticSupported()) return;
  // Loss pattern: long descending
  navigator.vibrate([100, 50, 50]);
}

/**
 * Haptic feedback for game end
 */
export function hapticGameEnd(): void {
  if (!isHapticSupported()) return;
  // Celebration pattern
  navigator.vibrate([50, 30, 50, 30, 50, 30, 100]);
}
