import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { checkStaticResumePdf, downloadResume } from '../../services/resume.js';

function DownloadIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}

function CaretIcon({ className = 'h-3.5 w-3.5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

const FORMAT_OPTIONS = [
  { key: 'pdf', label: 'PDF' },
  { key: 'doc', label: 'DOC' },
  { key: 'txt', label: 'TXT' },
  { key: 'md', label: 'MD' },
];

export default function ResumeDownloadButton({
  label = 'Download Resume',
  className = '',
  compact = false,
  pulseOnLoad = true,
  placement = 'unknown',
  variant = 'primary',
}) {
  const reducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasPdf, setHasPdf] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    checkStaticResumePdf().then((available) => {
      if (mounted) setHasPdf(available);
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onClickOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', onClickOutside);
    return () => window.removeEventListener('mousedown', onClickOutside);
  }, [menuOpen]);

  const preferredFormat = useMemo(() => (hasPdf ? 'pdf' : 'doc'), [hasPdf]);

  const handleDownload = async (format = preferredFormat) => {
    if (isLoading) return;
    setIsLoading(true);
    setMenuOpen(false);
    try {
      await downloadResume({ format, placement });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'text') {
    return (
      <button
        type="button"
        onClick={() => handleDownload(preferredFormat)}
        disabled={isLoading}
        className={`interactive inline-flex items-center gap-1 text-xs hover:text-primary disabled:opacity-70 ${className}`}
      >
        <DownloadIcon className="h-3.5 w-3.5" />
        <span>{isLoading ? 'Preparing...' : label}</span>
      </button>
    );
  }

  const sizeClass = compact ? 'px-3 py-2 text-xs' : 'px-5 py-2.5 text-sm';
  const supportsPulse = !compact && pulseOnLoad && !reducedMotion;

  return (
    <div ref={rootRef} className={`relative inline-flex ${className}`}>
      <motion.button
        type="button"
        onClick={() => handleDownload(preferredFormat)}
        disabled={isLoading}
        initial={supportsPulse ? { scale: 0.98, opacity: 0.92 } : false}
        animate={
          supportsPulse
            ? {
                scale: [1, 1.02, 1],
                boxShadow: [
                  '0 0 0 rgba(59,130,246,0.0)',
                  '0 0 26px rgba(99,102,241,0.34)',
                  '0 0 0 rgba(59,130,246,0.0)',
                ],
              }
            : {}
        }
        transition={supportsPulse ? { duration: 1.6, repeat: 1, ease: 'easeOut' } : {}}
        whileHover={reducedMotion ? {} : { scale: 1.05 }}
        className={`resume-download-btn inline-flex items-center gap-2 rounded-l-full font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${sizeClass}`}
        aria-label={label}
      >
        {isLoading ? (
          <>
            <span className="resume-download-spinner h-4 w-4 rounded-full border-2 border-white/30 border-t-white" />
            <span>Preparing...</span>
          </>
        ) : (
          <>
            <DownloadIcon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
            <span>{label}</span>
          </>
        )}
      </motion.button>

      <button
        type="button"
        disabled={isLoading}
        onClick={() => setMenuOpen((prev) => !prev)}
        className={`resume-download-btn rounded-r-full border-l border-white/25 px-2 text-white disabled:opacity-70 ${compact ? 'py-2' : 'py-2.5'}`}
        aria-label="Choose resume format"
      >
        <CaretIcon />
      </button>

      {menuOpen && (
        <div className="theme-surface absolute right-0 top-[calc(100%+8px)] z-20 min-w-[132px] rounded-xl border p-1.5 shadow-xl">
          {FORMAT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => handleDownload(option.key)}
              className="theme-text-primary flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition hover:bg-white/10"
            >
              <span>{option.label}</span>
              {option.key === 'pdf' && !hasPdf && (
                <span className="text-[10px] opacity-70">fallback</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
