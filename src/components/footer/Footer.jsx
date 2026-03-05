export default function Footer() {
  return (
    <footer className="border-t border-slate-800/60 bg-slate-950/80">
      <div className="section-container flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-400 sm:flex-row">
        <p>© 2026 HATAG Tech · Habtamu Shewamene</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/your-linkedin"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary"
          >
            LinkedIn
          </a>
          <a
            href="mailto:your-email@example.com"
            className="hover:text-primary"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}

