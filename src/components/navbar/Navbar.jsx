import { useState } from 'react';
import { useTheme } from '../../hooks/useTheme.js';

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
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const handleNavClick = (id) => {
    scrollToSection(id);
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-800/60 bg-slate-900/75 backdrop-blur-xl">
      <nav className="section-container flex h-16 items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => scrollToSection('home')}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-secondary text-sm font-bold">
            HS
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-heading text-sm font-semibold tracking-wide">
              HATAG Tech
            </span>
            <span className="text-[11px] text-slate-400">Full Stack Developer</span>
          </div>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-6 text-sm font-medium text-slate-200">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 shadow-sm transition hover:border-primary hover:text-primary"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="mr-1 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-xs shadow-sm"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-slate-200"
            aria-label="Toggle navigation menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-800/60 bg-slate-950/95 px-4 pb-4 pt-2 md:hidden">
          <ul className="space-y-1 text-sm font-medium text-slate-100">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="block w-full rounded-md px-2 py-2 text-left transition hover:bg-slate-800/80"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

