/**
 * theme.ts
 * 
 * Design tokens for PayStash.
 * Implements the "Vault Green" aesthetic.
 */

export const COLORS = {
  primary: '#10B981',       // Vault Green
  background: '#F3F4F6',    // Light Gray Background
  text: '#111827',          // Dark Gray/Black Text
  textSecondary: '#6B7280', // Medium Gray
  error: '#EF4444',         // Red
  white: '#FFFFFF',

  // Dark Theme Tokens (as requested)
  darkBackground: '#121212',
  darkAccent: '#10B981',
  darkText: '#FFFFFF',
  darkTextSecondary: '#9CA3AF',
  darkInputBg: '#1E1E1E',

  // UI Elements
  inputBg: '#FFFFFF',
  inputBorder: '#E5E7EB',
  surface: '#FFFFFF',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};
