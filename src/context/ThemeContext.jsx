import { createContext, useEffect, useMemo, useState } from 'react';
import {
  ACCENT_PRESETS,
  THEME_CONFIG,
  THEME_STORAGE_KEYS,
  resolveTimeTheme,
} from '../theme/themeConfig.js';

function hexToRgb(hex) {
  const normalized = hex.replace('#', '').trim();
  const fullHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized;
  const int = Number.parseInt(fullHex, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function withAlpha(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getSystemTheme() {
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState('system');
  const [manualTheme, setManualTheme] = useState('dark');
  const [systemTheme, setSystemTheme] = useState('dark');
  const [timeTheme, setTimeTheme] = useState(resolveTimeTheme());
  const [accentColor, setAccentColor] = useState(THEME_CONFIG.dark.accent);

  useEffect(() => {
    const storedMode = window.localStorage.getItem(THEME_STORAGE_KEYS.mode);
    const storedManual = window.localStorage.getItem(THEME_STORAGE_KEYS.manualTheme);
    const storedAccent = window.localStorage.getItem(THEME_STORAGE_KEYS.accent);

    if (storedMode === 'manual' || storedMode === 'system' || storedMode === 'time') {
      setThemeMode(storedMode);
    }
    if (storedManual === 'dark' || storedManual === 'light') {
      setManualTheme(storedManual);
    }
    if (storedAccent) {
      setAccentColor(storedAccent);
    } else {
      const seedTheme = resolveTimeTheme();
      setAccentColor(THEME_CONFIG[seedTheme].accent);
    }

    setSystemTheme(getSystemTheme());
    setTimeTheme(resolveTimeTheme());
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) return undefined;
    const handleChange = () => setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTimeTheme(resolveTimeTheme());
    }, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const effectiveTheme = useMemo(() => {
    if (themeMode === 'manual') return manualTheme;
    if (themeMode === 'time') return timeTheme;
    return systemTheme;
  }, [manualTheme, systemTheme, themeMode, timeTheme]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEYS.mode, themeMode);
    window.localStorage.setItem(THEME_STORAGE_KEYS.manualTheme, manualTheme);
    window.localStorage.setItem(THEME_STORAGE_KEYS.accent, accentColor);
  }, [accentColor, manualTheme, themeMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    const themeTokens = THEME_CONFIG[effectiveTheme];
    const accent = accentColor || themeTokens.accent;
    const accentGlow = withAlpha(accent, effectiveTheme === 'dark' ? 0.52 : 0.26);

    root.dataset.theme = effectiveTheme;
    root.dataset.themeMode = themeMode;
    root.classList.toggle('dark', effectiveTheme === 'dark');
    root.style.setProperty('--theme-background', themeTokens.background);
    root.style.setProperty('--theme-surface', themeTokens.surface);
    root.style.setProperty('--theme-shadow', themeTokens.surfaceShadow);
    root.style.setProperty('--theme-text', themeTokens.text);
    root.style.setProperty('--theme-text-muted', themeTokens.textMuted);
    root.style.setProperty('--theme-text-soft', themeTokens.textSoft);
    root.style.setProperty('--theme-border', themeTokens.border);
    root.style.setProperty('--theme-backdrop', themeTokens.backdrop);
    root.style.setProperty('--accent-color', accent);
    root.style.setProperty('--accent-glow', accentGlow);
    root.style.setProperty('--accent-soft', withAlpha(accent, effectiveTheme === 'dark' ? 0.2 : 0.14));
    root.style.setProperty('--accent-strong', withAlpha(accent, effectiveTheme === 'dark' ? 0.9 : 1));
  }, [accentColor, effectiveTheme, themeMode]);

  const toggleTheme = () => {
    const next = effectiveTheme === 'dark' ? 'light' : 'dark';
    setThemeMode('manual');
    setManualTheme(next);
  };

  const contextValue = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      manualTheme,
      setManualTheme,
      effectiveTheme,
      toggleTheme,
      accentColor,
      setAccentColor,
      accentPresets: ACCENT_PRESETS,
      isDark: effectiveTheme === 'dark',
    }),
    [accentColor, effectiveTheme, manualTheme, themeMode],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
