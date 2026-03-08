import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme.js';
import { useDebouncedScroll } from '../../hooks/useDebouncedScroll.js';

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ThemeToggle({ isDark, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label="Toggle theme"
      className="interactive theme-toggle relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border transition"
      whileTap={{ scale: 0.92 }}
    >
      <motion.span
        className="absolute h-5 w-5 rounded-full bg-amber-400"
        animate={isDark ? { scale: 0.7, x: 2, y: -2 } : { scale: 1, x: 0, y: 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="absolute h-5 w-5 rounded-full"
        style={{ background: 'var(--theme-surface)' }}
        animate={isDark ? { x: 4, y: -3, opacity: 1 } : { x: 14, y: -12, opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}

function ThemeModeButton({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`interactive rounded-full border px-3 py-1 text-[11px] transition ${
        active ? 'theme-chip-active' : 'theme-chip'
      }`}
    >
      {label}
    </button>
  );
}

export default function Navbar() {
  const {
    themeMode,
    setThemeMode,
    manualTheme,
    setManualTheme,
    effectiveTheme,
    toggleTheme,
    accentColor,
    setAccentColor,
    accentPresets,
    isDark,
  } = useTheme();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [themePanelOpen, setThemePanelOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  useDebouncedScroll(40);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.25 });

  useEffect(() => {
    const sections = navLinks.map((link) => document.getElementById(link.id)).filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (inView[0]?.target?.id) setActiveSection(inView[0].target.id);
      },
      { threshold: [0.35, 0.5, 0.7], rootMargin: '-18% 0px -45% 0px' },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <header className="theme-navbar fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl transition-colors duration-500">
      <motion.div
        className="absolute inset-x-0 top-0 h-[3px] origin-left"
        style={{
          scaleX: progress,
          background: 'linear-gradient(to right, var(--accent-color), #7c3aed)',
          boxShadow: '0 0 18px var(--accent-glow)',
        }}
      />

      <nav className="section-container flex h-16 items-center justify-between">
        <button
          type="button"
          className="interactive flex items-center gap-2"
          onClick={() => scrollToSection('home')}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
            style={{
              background: 'linear-gradient(140deg, var(--accent-color), #8b5cf6)',
              color: '#f8fafc',
              boxShadow: '0 0 18px var(--accent-glow)',
            }}
          >
            HS
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-sm font-semibold tracking-wide theme-text-primary">HATAG Tech</span>
            <span className="text-[11px] theme-text-soft">Full Stack Developer</span>
          </div>
        </button>

        <div className="hidden items-center gap-5 md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium theme-text-muted">
            {navLinks.map((link) => (
              <li key={link.id} className="relative">
                <button
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`interactive relative transition-opacity hover:opacity-90 ${
                    activeSection === link.id ? 'theme-text-accent' : ''
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.span
                      layoutId="active-nav"
                      className="absolute -bottom-1 left-0 h-[2px] w-full rounded"
                      style={{ background: 'var(--accent-color)' }}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          <Link to="/analytics" className="theme-button-secondary rounded-full px-3 py-1.5 text-xs">
            Analytics
          </Link>
          <button
            type="button"
            className="interactive theme-icon-btn rounded-full border px-2.5 py-2 text-xs"
            onClick={() => setThemePanelOpen((prev) => !prev)}
            aria-label="Theme settings"
          >
            Theme
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="interactive theme-icon-btn rounded-md border px-2.5 py-2 text-xs"
            aria-label="Toggle navigation menu"
          >
            {open ? 'X' : 'Menu'}
          </button>
        </div>
      </nav>

      {themePanelOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="theme-surface section-container mb-3 rounded-2xl border px-4 py-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <ThemeModeButton
              label="System"
              active={themeMode === 'system'}
              onClick={() => setThemeMode('system')}
            />
            <ThemeModeButton
              label="Time"
              active={themeMode === 'time'}
              onClick={() => setThemeMode('time')}
            />
            <ThemeModeButton
              label="Manual"
              active={themeMode === 'manual'}
              onClick={() => setThemeMode('manual')}
            />
            <span className="ml-2 text-[11px] theme-text-soft">
              Active: {effectiveTheme}
            </span>
          </div>

          {themeMode === 'manual' && (
            <div className="mt-2 flex gap-2">
              <ThemeModeButton
                label="Dark"
                active={manualTheme === 'dark'}
                onClick={() => setManualTheme('dark')}
              />
              <ThemeModeButton
                label="Light"
                active={manualTheme === 'light'}
                onClick={() => setManualTheme('light')}
              />
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {accentPresets.map((color) => (
              <button
                key={color}
                type="button"
                className="interactive h-6 w-6 rounded-full border"
                style={{
                  backgroundColor: color,
                  borderColor: accentColor === color ? 'var(--theme-text)' : 'var(--theme-border)',
                }}
                onClick={() => setAccentColor(color)}
                aria-label={`Set accent ${color}`}
              />
            ))}
            <input
              type="color"
              value={accentColor}
              onChange={(event) => setAccentColor(event.target.value)}
              className="interactive h-7 w-10 rounded border border-[var(--theme-border)] bg-transparent p-0"
              aria-label="Custom accent color"
            />
          </div>
        </motion.div>
      )}

      <motion.div
        animate={{ opacity: reducedMotion ? 0 : 1 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, var(--accent-soft), transparent)',
        }}
      />

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="theme-navbar border-t px-4 pb-4 pt-2 shadow-lg md:hidden"
        >
          <ul className="space-y-1 text-sm font-medium theme-text-muted">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full rounded-md px-2 py-2 text-left transition ${
                    activeSection === link.id ? 'theme-text-accent' : ''
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
            <li>
              <Link
                to="/analytics"
                onClick={() => setOpen(false)}
                className="theme-text-accent block w-full rounded-md px-2 py-2 text-left"
              >
                Analytics Dashboard
              </Link>
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
}
