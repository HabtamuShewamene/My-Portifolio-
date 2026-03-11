import { projects } from '../../data/projectsData.js';

const quickLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const featuredProjects = projects.slice(0, 4);

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
  const year = new Date().getFullYear();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative mt-16 sm:mt-24">
      <div className="border-y border-[color:var(--theme-border-medium)] bg-[color:var(--theme-background-secondary)]/70">
        <div className="section-container py-12 sm:py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="section-eyebrow">Portfolio Closing Note</p>
                <div className="space-y-3">
                  <h2 className="theme-text-primary font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                    Let&apos;s build something useful, reliable, and well-crafted.
                  </h2>
                  <p className="theme-text-muted max-w-2xl text-base leading-8 sm:text-lg">
                    I&apos;m Habtamu Shewamene, a full-stack developer focused on practical frontend
                    experiences, dependable backend systems, and code that stays maintainable after launch.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="theme-button-primary inline-flex rounded-full px-6 py-3 text-sm font-semibold"
                >
                  Start a Conversation
                </button>
                <a
                  href="mailto:habtamushewamene905@gmail.com"
                  className="theme-button-secondary inline-flex rounded-full px-6 py-3 text-sm font-semibold"
                >
                  habtamushewamene905@gmail.com
                </a>
              </div>

              <div className="footer-quote max-w-2xl rounded-[1.5rem] px-6 py-6">
                <p className="theme-text-primary text-xl italic leading-9">
                  "Clean code, creative solutions, continuous learning."
                </p>
                <p className="theme-text-soft mt-3 text-sm">Habtamu Shewamene</p>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <div>
                <p className="footer-heading">Navigate</p>
                <div className="mt-5 space-y-4 text-base">
                  {quickLinks.map((link) => (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => scrollToSection(link.id)}
                      className="footer-link bg-transparent text-left"
                    >
                      <span>{link.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="footer-heading">Selected Work</p>
                <div className="mt-5 space-y-4 text-base">
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

              <div>
                <p className="footer-heading">Connect</p>
                <div className="mt-5 space-y-5 text-base">
                  {connectLinks.map((link) => (
                    <div key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                        className="footer-link"
                      >
                        <span>{link.label}</span>
                      </a>
                      <p className="theme-text-soft mt-1 text-sm leading-6">{link.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container flex flex-col gap-4 py-5 text-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="theme-text-soft">Copyright {year} Habtamu Shewamene.</p>
          <p className="theme-text-soft">Built with React and Node.js.</p>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <p className="theme-text-soft">Last updated: March 2026</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="footer-link bg-transparent text-sm"
          >
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}
