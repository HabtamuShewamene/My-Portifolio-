import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fetchResumeStats } from '../../services/api.js';
import { checkStaticResumePdf, downloadResume, openResumeEmail } from '../../services/resume.js';

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

function OptionRow({ checked, label, onClick, note = '', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`theme-text-primary flex items-center gap-2 py-0.5 text-left text-sm ${className}`}
    >
      <span className={`resume-dot ${checked ? 'resume-dot-active' : ''}`} />
      <span>{label}</span>
      {note && <span className="theme-text-soft text-xs">{note}</span>}
    </button>
  );
}

export default function ResumeDownloadButton({
  label = 'Download Resume',
  className = '',
  compact = false,
  pulseOnLoad = true,
  placement = 'unknown',
  variant = 'primary',
}) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [hasPdf, setHasPdf] = useState(false);
  const [downloadCount, setDownloadCount] = useState(null);

  const [format, setFormat] = useState('pdf');
  const [template, setTemplate] = useState('modern');
  const [includeFullResume, setIncludeFullResume] = useState(true);
  const [includeSkillsMatrix, setIncludeSkillsMatrix] = useState(true);
  const [includeContactDetails, setIncludeContactDetails] = useState(false);

  useEffect(() => {
    let mounted = true;
    checkStaticResumePdf().then((available) => {
      if (mounted) setHasPdf(available);
    });
    fetchResumeStats().then((stats) => {
      if (mounted) setDownloadCount(Number(stats?.totalDownloads || 0));
    }).catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!panelOpen) return undefined;
    const onClickOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setPanelOpen(false);
      }
    };
    window.addEventListener('mousedown', onClickOutside);
    return () => window.removeEventListener('mousedown', onClickOutside);
  }, [panelOpen]);

  const doDownload = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await downloadResume({
        format,
        template,
        placement,
        include: {
          fullResume: includeFullResume,
          skillsMatrix: includeSkillsMatrix,
          contactDetails: includeContactDetails,
        },
      });
      setDownloadCount((prev) => (typeof prev === 'number' ? prev + 1 : prev));
      setPanelOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const doEmail = () => {
    openResumeEmail({
      format,
      template,
      include: {
        fullResume: includeFullResume,
        skillsMatrix: includeSkillsMatrix,
        contactDetails: includeContactDetails,
      },
    });
  };

  if (variant === 'text') {
    return (
      <button
        type="button"
        onClick={doDownload}
        disabled={isLoading}
        className={`interactive inline-flex items-center gap-1 text-xs hover:text-primary disabled:opacity-70 ${className}`}
      >
        <DownloadIcon className="h-3.5 w-3.5" />
        <span>{isLoading ? 'Preparing...' : label}</span>
      </button>
    );
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={doDownload}
        disabled={isLoading}
        className={`resume-download-btn inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-white transition disabled:opacity-70 ${className}`}
      >
        {isLoading ? (
          <>
            <span className="resume-download-spinner h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white" />
            <span>Preparing...</span>
          </>
        ) : (
          <>
            <DownloadIcon className="h-3.5 w-3.5" />
            <span>{label}</span>
          </>
        )}
      </button>
    );
  }

  const supportsPulse = pulseOnLoad && !reducedMotion;

  return (
    <div ref={rootRef} className={`relative inline-flex ${className}`}>
      <motion.button
        type="button"
        onClick={() => setPanelOpen((prev) => !prev)}
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
        className="resume-download-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-70"
      >
        <DownloadIcon />
        <span>{label}</span>
      </motion.button>

      {panelOpen && (
        <div className="resume-panel theme-surface absolute right-0 top-[calc(100%+10px)] z-30 w-[318px] rounded-2xl border shadow-xl">
          <div className="border-b px-4 py-3">
            <h3 className="theme-text-primary text-base font-semibold">Download Resume</h3>
          </div>

          <div className="space-y-4 px-4 py-3">
            <div>
              <p className="theme-text-soft mb-1.5 text-xs uppercase tracking-wide">Format:</p>
              <OptionRow className="w-full" checked={format === 'pdf'} label="PDF (Recommended)" onClick={() => setFormat('pdf')} note={!hasPdf ? '(generated fallback if missing)' : ''} />
              <OptionRow className="w-full" checked={format === 'doc'} label="DOCX" onClick={() => setFormat('doc')} />
              <OptionRow className="w-full" checked={format === 'txt'} label="TXT" onClick={() => setFormat('txt')} />
            </div>

            <div>
              <p className="theme-text-soft mb-1.5 text-xs uppercase tracking-wide">Template:</p>
              <div className="flex gap-4">
                <OptionRow checked={template === 'modern'} label="Modern" onClick={() => setTemplate('modern')} />
                <OptionRow checked={template === 'professional'} label="Professional" onClick={() => setTemplate('professional')} />
              </div>
            </div>

            <div>
              <p className="theme-text-soft mb-1.5 text-xs uppercase tracking-wide">Include:</p>
              <label className="theme-text-primary flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeFullResume} onChange={(event) => setIncludeFullResume(event.target.checked)} />
                <span>Full Resume</span>
              </label>
              <label className="theme-text-primary mt-1 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeSkillsMatrix} onChange={(event) => setIncludeSkillsMatrix(event.target.checked)} />
                <span>Skills Matrix</span>
              </label>
              <label className="theme-text-primary mt-1 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeContactDetails} onChange={(event) => setIncludeContactDetails(event.target.checked)} />
                <span>Contact Details</span>
              </label>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={doDownload}
                disabled={isLoading}
                className="resume-download-btn inline-flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-white disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <span className="resume-download-spinner h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white" />
                    <span>Preparing...</span>
                  </>
                ) : (
                  <>
                    <span>⬇️</span>
                    <span>Download</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={doEmail}
                className="theme-button-secondary inline-flex flex-1 items-center justify-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold"
              >
                <span>📧</span>
                <span>Email to me</span>
              </button>
            </div>

            <p className="theme-text-soft text-xs">
              📊 Downloaded {typeof downloadCount === 'number' ? downloadCount : '--'} times
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
