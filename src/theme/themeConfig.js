export const THEME_STORAGE_KEYS = {
  mode: 'hatag-theme-mode',
  manualTheme: 'hatag-theme-manual',
  accent: 'hatag-theme-accent',
};

export const ACCENT_PRESETS = [
  '#3b82f6',
  '#8b5cf6',
  '#22c55e',
  '#f97316',
  '#ec4899',
];

export const THEME_CONFIG = {
  dark: {
    id: 'dark',
    background: 'radial-gradient(circle at top right, #0a1929, #0f172a)',
    surface: 'rgba(30, 41, 59, 0.7)',
    surfaceShadow: '0 24px 50px rgba(2, 6, 23, 0.45)',
    text: '#f8fafc',
    textMuted: 'rgba(248, 250, 252, 0.76)',
    textSoft: 'rgba(248, 250, 252, 0.58)',
    border: 'rgba(255, 255, 255, 0.1)',
    backdrop: 'rgba(2, 6, 23, 0.72)',
    accent: '#3b82f6',
  },
  light: {
    id: 'light',
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
    surface: 'rgba(255, 255, 255, 0.92)',
    surfaceShadow: '0 18px 40px rgba(15, 23, 42, 0.11)',
    text: '#0f172a',
    textMuted: 'rgba(15, 23, 42, 0.78)',
    textSoft: 'rgba(15, 23, 42, 0.58)',
    border: 'rgba(0, 0, 0, 0.1)',
    backdrop: 'rgba(15, 23, 42, 0.38)',
    accent: '#8b5cf6',
  },
};

export function resolveTimeTheme(date = new Date()) {
  const hour = date.getHours();
  return hour >= 6 && hour < 18 ? 'light' : 'dark';
}
