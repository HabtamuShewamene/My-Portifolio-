import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ACCENT_PRESETS,
  THEME_CONFIG,
  THEME_STORAGE_KEYS,
  resolveTimeTheme,
} from '../theme/themeConfig.js';
import { ThemeContext } from './themeContextObject.js';

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

function readStoredThemeMode() {
  const storedMode = window.localStorage.getItem(THEME_STORAGE_KEYS.mode);
  return storedMode === 'manual' || storedMode === 'system' || storedMode === 'time'
    ? storedMode
    : 'system';
}

function readStoredManualTheme() {
  const storedManual = window.localStorage.getItem(THEME_STORAGE_KEYS.manualTheme);
  return storedManual === 'dark' || storedManual === 'light' ? storedManual : 'dark';
}

function readStoredAccent() {
  const storedAccent = window.localStorage.getItem(THEME_STORAGE_KEYS.accent);
  if (storedAccent) return storedAccent;
  const seedTheme = resolveTimeTheme();
  return THEME_CONFIG[seedTheme].accent;
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(readStoredThemeMode);
  const [manualTheme, setManualTheme] = useState(readStoredManualTheme);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const [timeTheme, setTimeTheme] = useState(resolveTimeTheme);
  const [accentColor, setAccentColor] = useState(readStoredAccent);

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
    const accentGlow = withAlpha(accent, effectiveTheme === 'dark' ? 0.25 : 0.15);

    root.dataset.theme = effectiveTheme;
    root.dataset.themeMode = themeMode;
    root.classList.toggle('dark', effectiveTheme === 'dark');
    root.style.setProperty('--theme-background', themeTokens.background);
    root.style.setProperty('--theme-background-secondary', themeTokens.backgroundSecondary);
    root.style.setProperty('--theme-background-tertiary', themeTokens.backgroundTertiary);
    root.style.setProperty('--theme-surface', themeTokens.surface);
    root.style.setProperty('--theme-surface-elevated', themeTokens.surfaceElevated);
    root.style.setProperty('--theme-shadow', themeTokens.surfaceShadow);
    root.style.setProperty('--theme-text', themeTokens.text);
    root.style.setProperty('--theme-text-muted', themeTokens.textMuted);
    root.style.setProperty('--theme-text-soft', themeTokens.textSoft);
    root.style.setProperty('--theme-text-on-accent', themeTokens.textOnAccent);
    root.style.setProperty('--theme-border', themeTokens.border);
    root.style.setProperty('--theme-border-medium', themeTokens.borderMedium);
    root.style.setProperty('--theme-border-strong', themeTokens.borderStrong);
    root.style.setProperty('--theme-backdrop', themeTokens.backdrop);
    root.style.setProperty('--accent-color', accent);
    root.style.setProperty('--accent-secondary', themeTokens.accentSecondary);
    root.style.setProperty('--accent-tertiary', themeTokens.accentTertiary);
    root.style.setProperty('--accent-glow', accentGlow);
    root.style.setProperty('--accent-soft', withAlpha(accent, effectiveTheme === 'dark' ? 0.16 : 0.1));
    root.style.setProperty('--accent-strong', withAlpha(accent, effectiveTheme === 'dark' ? 0.92 : 1));
    root.style.setProperty('--theme-success', themeTokens.success);
    root.style.setProperty('--theme-warning', themeTokens.warning);
    root.style.setProperty('--theme-error', themeTokens.error);
    root.style.setProperty('--theme-info', themeTokens.info);
    root.style.setProperty('--theme-glow-primary', themeTokens.glowPrimary);
    root.style.setProperty('--theme-glow-secondary', themeTokens.glowSecondary);
    root.style.setProperty('--theme-overlay', themeTokens.overlay);
    root.style.setProperty('--theme-grid-major', themeTokens.gridMajor);
    root.style.setProperty('--theme-grid-minor', themeTokens.gridMinor);
    root.style.setProperty('--theme-noise', themeTokens.noise);
    root.style.setProperty('--theme-shape-one', themeTokens.shapeOne);
    root.style.setProperty('--theme-shape-two', themeTokens.shapeTwo);
    root.style.setProperty('--theme-shape-three', themeTokens.shapeThree);
    root.style.setProperty('--theme-nav', themeTokens.nav);
    root.style.setProperty('--theme-quote', themeTokens.quote);
  }, [accentColor, effectiveTheme, themeMode]);

  const toggleTheme = useCallback(() => {
    const next = effectiveTheme === 'dark' ? 'light' : 'dark';
    setThemeMode('manual');
    setManualTheme(next);
  }, [effectiveTheme]);

  const contextValue = {
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
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
