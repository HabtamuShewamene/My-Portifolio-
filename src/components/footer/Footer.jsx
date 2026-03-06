export default function Footer() {
  return (
    <footer className="theme-navbar border-t">
      <div className="section-container theme-text-soft flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
        <p>Copyright 2026 HATAG Tech - Habtamu Shewamene</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/HATAG-TECH"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Habtamu's GitHub profile"
            className="interactive hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/habtamu-shewamene-25a5a63b5/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Habtamu's LinkedIn profile"
            className="interactive hover:text-primary"
          >
            LinkedIn
          </a>
          <a
            href="mailto:habtamushewamene905@gmail.com"
            aria-label="Send email to Habtamu"
            className="interactive hover:text-primary"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
