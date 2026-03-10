import { Link } from 'react-router-dom';
import { projects } from '../../data/projectsData.js';
import { useTheme } from '../../hooks/useTheme.js';

const quickLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const featuredProjects = projects.slice(0, 5);

const connectLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/HATAG-TECH',
    detail: 'Code, experiments, and public repos',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/habtamu-shewamene-25a5a63b5/',
    detail: 'Career updates and professional profile',
  },
  {
    label: 'Email',
    href: 'mailto:habtamushewamene905@gmail.com',
    detail: 'Direct contact for work and collaboration',
  },
];

export default function Footer() {
  const { effectiveTheme, toggleTheme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[color:var(--theme-border-medium)] pt-10 sm:pt-14">
      <div className="section-container pb-8">
        <div className="footer-panel rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-color), var(--accent-secondary))',
                    color: 'var(--theme-text-on-accent)',
                    boxShadow: '0 18px 30px var(--accent-glow)',
                  }}
                >
                  HS
                </div>
                <div className="space-y-2">
                  <p className="section-eyebrow">Portfolio Closing Note</p>
                  <div>
                    <h2 className="theme-text-primary font-heading text-2xl font-semibold sm:text-3xl">
                      Habtamu Shewamene
                    </h2>
                    <p className="mt-1 text-sm font-medium text-[color:var(--accent-color)] sm:text-base">
                      Full-Stack Developer
                    </p>
                  </div>
                  <p className="theme-text-muted max-w-2xl text-sm leading-7 sm:text-base">
                    Building robust web applications with modern frontend craft, practical backend
                    engineering, and a steady focus on clean code that scales.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-background-secondary)] p-5">
                  <p className="footer-heading">Quick Links</p>
                  <div className="mt-4 space-y-3 text-sm">
                    {quickLinks.map((link) => (
                      <a key={link.id} href={`/#${link.id}`} className="footer-link">
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-background-secondary)] p-5">
                  <p className="footer-heading">Project Showcase</p>
                  <div className="mt-4 space-y-3 text-sm">
                    {featuredProjects.map((project) => (
                      <a
                        key={project.id}
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="footer-link"
                      >
                        <span>{project.title}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-background-secondary)] p-5">
                  <p className="footer-heading">Connect</p>
                  <div className="mt-4 space-y-4 text-sm">
                    {connectLinks.map((link) => (
                      <div key={link.label}>
                        <a href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="footer-link">
                          <span>{link.label}</span>
                        </a>
                        <p className="theme-text-soft mt-1 text-xs leading-5">{link.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.75rem] border border-[color:var(--theme-border-medium)] bg-[color:var(--theme-background-secondary)] p-5 sm:p-6">
                <p className="footer-heading">Open For</p>
                <p className="theme-text-primary mt-4 text-lg font-semibold leading-8">
                  Junior developer roles, collaborative product work, and practical problem-solving.
                </p>
                <p className="theme-text-muted mt-3 text-sm leading-7">
                  If you need someone who cares about implementation details and product reliability,
                  start the conversation.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href="/#contact" className="theme-button-primary inline-flex rounded-full px-5 py-2.5 text-sm font-semibold">
                    Start a Conversation
                  </a>
                  <a href="mailto:habtamushewamene905@gmail.com" className="theme-button-secondary inline-flex rounded-full px-5 py-2.5 text-sm font-semibold">
                    Email Directly
                  </a>
                </div>
              </div>

              <div className="footer-quote rounded-[1.75rem] px-5 py-6 sm:px-6">
                <p className="theme-text-primary text-lg italic leading-8">
                  "Clean code, creative solutions, continuous learning."
                </p>
                <p className="theme-text-soft mt-3 text-sm">Habtamu Shewamene</p>
              </div>

              <div className="rounded-[1.75rem] border border-[color:var(--theme-border-medium)] bg-[color:var(--theme-background-secondary)] p-5">
                <p className="footer-heading">Developer Extras</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <Link to="/analytics" className="theme-button-secondary inline-flex rounded-full px-4 py-2 font-semibold">
                    Analytics Dashboard
                  </Link>
                  <button type="button" onClick={toggleTheme} className="theme-button-secondary inline-flex rounded-full px-4 py-2 font-semibold">
                    Theme: {effectiveTheme}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="theme-button-secondary inline-flex rounded-full px-4 py-2 font-semibold"
                  >
                    Back to Top
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-[color:var(--theme-border-medium)] pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="theme-text-soft">
              Copyright {year} Habtamu Shewamene. Built with React, Node.js, and deliberate attention to detail.
            </p>
            <p className="theme-text-soft">Last updated: March 2026 · v3.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
