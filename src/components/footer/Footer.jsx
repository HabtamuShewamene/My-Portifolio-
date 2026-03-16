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

const footerGroups = [
  {
    title: 'Product',
    links: quickLinks
      .filter((link) => ['about', 'projects', 'skills', 'experience'].includes(link.id))
      .map((link) => ({ label: link.label, type: 'section', href: link.id })),
  },
  {
    title: 'Resources',
    links: [
      { label: 'Resume', type: 'external', href: '/resumes/pdf/habtamu-shewamene-resume.pdf' },
      ...featuredProjects.slice(0, 3).map((project) => ({
        label: project.title,
        type: 'external',
        href: project.github,
      })),
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', type: 'section', href: 'contact' },
      { label: 'LinkedIn', type: 'external', href: 'https://www.linkedin.com/in/habtamu-shewamene-25a5a63b5/' },
      { label: 'GitHub', type: 'external', href: 'https://github.com/habtamushewamene' },
      { label: 'Email (habtamushewamene905@gmail.com)', type: 'external', href: 'mailto:habtamushewamene905@gmail.com' },
      { label: 'Call (+251987246404)', type: 'external', href: 'tel:+251987246404' },
      { label: 'SMS (+251987246404)', type: 'external', href: 'sms:+251987246404' },
      { label: 'WhatsApp (+251987246404)', type: 'external', href: 'https://wa.me/251987246404' },
    ],
  },
];

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/habtamu-shewamene-25a5a63b5/',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3Zm7 0h3.84v1.64h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.66 4.8 6.12V21h-4v-5.56c0-1.33-.03-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94V21h-4Z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/habtamushewamene',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58l-.02-2.02c-3.34.73-4.04-1.41-4.04-1.41-.55-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.72.08-.72 1.2.09 1.84 1.23 1.84 1.23 1.08 1.83 2.82 1.3 3.5 1 .11-.77.42-1.3.77-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 0 1 6.03 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.8 5.64-5.48 5.94.43.37.82 1.1.82 2.23l-.01 3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:habtamushewamene905@gmail.com',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5Zm2 .53v.22l7 4.84 7-4.84v-.22a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5Zm14 2.65-6.43 4.45a1 1 0 0 1-1.14 0L5 8.68v9.82c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5Z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/251987246404',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0 11.97 11.97 0 0 0 1.6 17.8L0 24l6.35-1.67a12 12 0 0 0 5.71 1.45h.01A11.94 11.94 0 0 0 24 11.85a11.86 11.86 0 0 0-3.48-8.37Zm-8.45 18.3h-.01a9.99 9.99 0 0 1-5.09-1.39l-.36-.21-3.77.99 1-3.68-.23-.38a9.94 9.94 0 0 1 1.54-12.1A9.9 9.9 0 0 1 12.06 2c2.65 0 5.14 1.03 7.01 2.9A9.86 9.86 0 0 1 22 11.86c0 5.47-4.46 9.92-9.93 9.92Zm5.45-7.45c-.3-.15-1.8-.89-2.08-.99-.28-.1-.49-.15-.69.15-.2.3-.79.99-.96 1.19-.18.2-.35.23-.65.08-.3-.15-1.28-.47-2.43-1.5-.9-.8-1.5-1.79-1.67-2.09-.18-.3-.02-.46.13-.61.13-.12.3-.31.45-.46.15-.15.2-.25.3-.42.1-.18.05-.32-.02-.46-.08-.15-.69-1.66-.95-2.27-.25-.6-.5-.52-.69-.53h-.59c-.2 0-.52.08-.79.38-.28.3-1.04 1.02-1.04 2.49s1.06 2.89 1.2 3.09c.15.2 2.09 3.18 5.06 4.46.71.31 1.26.49 1.69.63.71.23 1.35.2 1.85.12.57-.09 1.8-.74 2.05-1.46.25-.72.25-1.34.18-1.46-.08-.12-.28-.2-.59-.35Z" />
      </svg>
    ),
  },
];

function FooterLink({ item, onSectionClick }) {
  if (item.type === 'section') {
    return (
      <button
        type="button"
        onClick={() => onSectionClick(item.href)}
        className="footer-link footer-link--compact bg-transparent text-left"
      >
        {item.label}
      </button>
    );
  }

  return (
    <a
      href={item.href}
      target={item.href.startsWith('http') ? '_blank' : undefined}
      rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
      className="footer-link footer-link--compact"
    >
      {item.label}
    </a>
  );
}

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
      <div className="section-container">
        <div className="footer-card rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-14">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="footer-mark flex h-11 w-11 items-center justify-center rounded-2xl font-heading text-sm font-bold">
                  HS
                </div>
                <div>
                  <p className="theme-text-primary font-heading text-lg font-semibold">Habtamu Shewamene</p>
                  <p className="theme-text-soft text-sm">Full Stack Developer Portfolio</p>
                </div>
              </div>

              <p className="theme-text-muted max-w-xl text-sm leading-7 sm:text-base">
                Building practical digital products with modern frontend systems, dependable backend
                architecture, and a clean user experience that fits the rest of the portfolio.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="footer-social"
                    aria-label={link.label}
                    title={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <p className="footer-heading">{group.title}</p>
                  <div className="mt-4 space-y-3.5 text-sm">
                    {group.links.map((item) => (
                      <FooterLink
                        key={`${group.title}-${item.label}`}
                        item={item}
                        onSectionClick={scrollToSection}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="footer-divider mt-8 pt-5">
            <div className="flex flex-col gap-4 text-sm lg:flex-row lg:items-center lg:justify-between">
              <p className="theme-text-soft">© {year} Habtamu Shewamene. All rights reserved.</p>
              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="footer-link footer-link--compact bg-transparent text-sm"
                >
                  Contact
                </button>
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="footer-link footer-link--compact bg-transparent text-sm"
                >
                  Back to Top
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
