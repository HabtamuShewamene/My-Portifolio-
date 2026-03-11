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
  const scrollY = useDebouncedScroll(40);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [themePanelOpen, setThemePanelOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const isScrolled = scrollY > 18;

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

  useEffect(() => {
    if (!open) return undefined;

    const onResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="section-container pt-3 sm:pt-4">
        <motion.div
          layout
          className="pointer-events-auto relative overflow-hidden rounded-[2rem] border"
          animate={{
            y: isScrolled ? -2 : 0,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          style={{
            borderColor: isScrolled
              ? 'color-mix(in oklab, var(--accent-color) 22%, var(--theme-border-medium))'
              : 'color-mix(in oklab, var(--theme-border-medium) 82%, transparent)',
            background: isScrolled
              ? 'linear-gradient(180deg, color-mix(in oklab, var(--theme-nav) 98%, transparent), color-mix(in oklab, var(--theme-surface) 96%, transparent))'
              : 'linear-gradient(180deg, color-mix(in oklab, var(--theme-nav) 94%, transparent), color-mix(in oklab, var(--theme-background-secondary) 78%, transparent))',
            boxShadow: isScrolled
              ? '0 20px 48px color-mix(in oklab, var(--theme-background) 45%, transparent)'
              : '0 14px 32px color-mix(in oklab, var(--theme-background) 30%, transparent)',
          }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-[3px] origin-left"
            style={{
              scaleX: progress,
              background: 'linear-gradient(to right, var(--accent-color), var(--accent-secondary), var(--accent-tertiary))',
              boxShadow: '0 0 18px var(--accent-glow)',
            }}
          />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at top left, color-mix(in oklab, var(--theme-overlay) 90%, white 10%), transparent 28%), radial-gradient(circle at top right, color-mix(in oklab, var(--theme-shape-two) 52%, transparent), transparent 24%)',
            }}
          />

          <nav
            className={`relative flex items-center justify-between gap-3 px-3 sm:px-4 lg:px-5 ${
              isScrolled ? 'h-[72px]' : 'h-[82px]'
            }`}
          >
            <button
              type="button"
              className="interactive group flex min-w-0 items-center gap-3 text-left"
              onClick={() => scrollToSection('home')}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] text-sm font-bold"
                style={{
                  background: 'linear-gradient(145deg, var(--accent-color), var(--accent-secondary))',
                  color: 'var(--theme-text-on-accent)',
                  boxShadow: '0 14px 26px var(--accent-glow)',
                }}
              >
                HS
              </div>
              <div className="min-w-0 leading-tight">
                <p className="theme-text-soft text-[10px] uppercase tracking-[0.26em]">Portfolio</p>
                <p className="truncate font-heading text-sm font-semibold tracking-[0.02em] theme-text-primary sm:text-base">
                  Habtamu Shewamene
                </p>
                <p className="truncate text-xs theme-text-soft">Full Stack Developer</p>
              </div>
            </button>

            <div className="hidden flex-1 justify-center lg:flex">
              <div
                className="relative flex items-center gap-1 rounded-full border px-2 py-2"
                style={{
                  borderColor: 'color-mix(in oklab, var(--theme-border-medium) 85%, transparent)',
                  background: 'color-mix(in oklab, var(--theme-background-secondary) 76%, var(--theme-surface) 24%)',
                  boxShadow: 'inset 0 1px 0 color-mix(in oklab, var(--theme-overlay) 80%, transparent)',
                }}
              >
                {navLinks.map((link) => {
                  const active = activeSection === link.id;
                  return (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => handleNavClick(link.id)}
                      className={`interactive relative rounded-full px-4 py-2.5 text-sm font-medium ${
                        active ? 'theme-text-primary' : 'theme-text-muted'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="active-nav-pill"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              'linear-gradient(135deg, color-mix(in oklab, var(--accent-color) 18%, transparent), color-mix(in oklab, var(--accent-secondary) 12%, transparent))',
                            border: '1px solid color-mix(in oklab, var(--accent-color) 24%, transparent)',
                            boxShadow: '0 10px 24px color-mix(in oklab, var(--accent-glow) 42%, transparent)',
                          }}
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        />
                      )}
                      <span className="relative z-[1]">{link.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="hidden items-center gap-2 md:flex lg:min-w-[230px] lg:justify-end">
              <Link to="/analytics" className="theme-button-secondary rounded-full px-4 py-2 text-xs font-semibold">
                Analytics
              </Link>
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              <button
                type="button"
                className="interactive theme-icon-btn rounded-full border px-4 py-2 text-xs font-semibold"
                onClick={() => setThemePanelOpen((prev) => !prev)}
                aria-label="Theme settings"
              >
                Theme Studio
              </button>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="interactive theme-icon-btn rounded-full border px-4 py-2 text-xs font-semibold"
                aria-label="Toggle navigation menu"
              >
                {open ? 'Close' : 'Menu'}
              </button>
            </div>
          </nav>
        </motion.div>

        {themePanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto mx-auto mt-3 max-w-4xl"
          >
            <div className="theme-surface rounded-[1.5rem] border px-4 py-4 sm:px-5">
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
                <span className="ml-2 text-[11px] theme-text-soft">Active: {effectiveTheme}</span>
              </div>

              {themeMode === 'manual' && (
                <div className="mt-3 flex flex-wrap gap-2">
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

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {accentPresets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="interactive h-7 w-7 rounded-full border"
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
                  className="interactive h-8 w-12 rounded border border-[var(--theme-border)] bg-transparent p-0"
                  aria-label="Custom accent color"
                />
              </div>
            </div>
          </motion.div>
        )}

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto mt-3 md:hidden"
          >
            <div className="theme-surface rounded-[1.5rem] border px-4 py-4 shadow-lg">
              <div className="mb-4 flex items-center justify-between border-b border-[color:var(--theme-border)] pb-3">
                <div>
                  <p className="theme-text-primary font-heading text-base font-semibold">Navigate</p>
                  <p className="theme-text-soft text-xs">Move through the portfolio sections</p>
                </div>
                <Link
                  to="/analytics"
                  onClick={() => setOpen(false)}
                  className="theme-button-secondary rounded-full px-3 py-1.5 text-xs font-semibold"
                >
                  Analytics
                </Link>
              </div>

              <ul className="space-y-2 text-sm font-medium">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(link.id)}
                      className={`interactive flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left ${
                        activeSection === link.id ? 'theme-chip-active' : 'theme-chip'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">Go</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        <motion.div
          animate={{ opacity: reducedMotion ? 0 : 1 }}
          className="pointer-events-none mx-auto mt-3 h-px w-[min(88%,60rem)]"
          style={{
            background: 'linear-gradient(to right, transparent, var(--accent-soft), transparent)',
          }}
        />
      </div>
    </header>
  );
}
