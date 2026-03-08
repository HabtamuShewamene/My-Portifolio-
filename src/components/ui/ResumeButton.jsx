import { useEffect, useRef, useState } from 'react';
import { fetchResumeStats } from '../../services/api.js';
import { downloadResume } from '../../services/resume.js';

const FORMAT_LABELS = {
  pdf: 'PDF',
  docx: 'DOCX',
  txt: 'TXT',
  md: 'MD',
};

export default function ResumeButton({
  label = 'Download Resume',
  icon = '📄',
  placement = 'unknown',
  variant = 'primary',
  className = '',
}) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [format, setFormat] = useState('pdf');
  const [includeFullResume, setIncludeFullResume] = useState(true);
  const [includeSkillsMatrix, setIncludeSkillsMatrix] = useState(true);
  const [includeContactDetails, setIncludeContactDetails] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  useEffect(() => {
    let active = true;
    fetchResumeStats()
      .then((value) => {
        if (!active) return;
        setStats(Number(value?.totalDownloads || 0));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointerDown = (event) => {
      const target = event.target;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) {
        return;
      }
      setIsOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setDragOffset({ x: 0, y: 0 });
  }, [isOpen]);

  useEffect(() => {
    const onPointerMove = (event) => {
      if (!dragStateRef.current.isDragging) return;
      setDragOffset({
        x: dragStateRef.current.originX + (event.clientX - dragStateRef.current.startX),
        y: dragStateRef.current.originY + (event.clientY - dragStateRef.current.startY),
      });
    };

    const onPointerUp = () => {
      dragStateRef.current.isDragging = false;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const hasCustomSelection = !includeFullResume || !includeSkillsMatrix || includeContactDetails;
  const effectiveFormat =
    hasCustomSelection && (format === 'pdf' || format === 'docx') ? 'txt' : format;

  const onDownload = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await downloadResume({
        format: effectiveFormat,
        placement,
        include: {
          fullResume: includeFullResume,
          skillsMatrix: includeSkillsMatrix,
          contactDetails: includeContactDetails,
        },
      });
      setStats((prev) => (typeof prev === 'number' ? prev + 1 : prev));
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonClass =
    variant === 'secondary'
      ? 'resume-btn resume-btn-secondary'
      : variant === 'tertiary'
        ? 'resume-btn resume-btn-tertiary'
        : 'resume-btn resume-btn-primary';

  return (
    <div ref={rootRef} className={`relative inline-flex ${className}`}>
      <button
        type="button"
        className={buttonClass}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span aria-hidden="true">{icon}</span>
        <span>{label}</span>
      </button>

      {isOpen && (
        <div className="resume-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close resume popup"
            className="absolute inset-0 h-full w-full"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={panelRef}
            className="resume-menu theme-surface relative w-[min(92vw,380px)] rounded-2xl p-4"
            role="dialog"
            aria-label="Resume download options"
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="resume-drag-handle theme-text-soft mb-3 flex w-full items-center justify-between rounded-lg px-2 py-1 text-xs"
              onPointerDown={(event) => {
                dragStateRef.current = {
                  isDragging: true,
                  startX: event.clientX,
                  startY: event.clientY,
                  originX: dragOffset.x,
                  originY: dragOffset.y,
                };
              }}
            >
              <span>Drag to move</span>
              <span aria-hidden="true">⠿</span>
            </button>
            <h3 className="theme-text-primary text-sm font-semibold">Download Resume</h3>

            <div className="mt-3">
              <p className="theme-text-soft text-[11px] uppercase tracking-wide">Format</p>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {Object.keys(FORMAT_LABELS).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormat(key)}
                    className={`resume-chip ${format === key ? 'resume-chip-active' : ''}`}
                  >
                    {FORMAT_LABELS[key]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <p className="theme-text-soft text-[11px] uppercase tracking-wide">Customization</p>
              <div className="mt-2 space-y-1 text-sm">
                <label className="resume-check">
                  <input
                    type="checkbox"
                    checked={includeFullResume}
                    onChange={(event) => setIncludeFullResume(event.target.checked)}
                  />
                  <span>Full resume</span>
                </label>
                <label className="resume-check">
                  <input
                    type="checkbox"
                    checked={includeSkillsMatrix}
                    onChange={(event) => setIncludeSkillsMatrix(event.target.checked)}
                  />
                  <span>Skills matrix</span>
                </label>
                <label className="resume-check">
                  <input
                    type="checkbox"
                    checked={includeContactDetails}
                    onChange={(event) => setIncludeContactDetails(event.target.checked)}
                  />
                  <span>Contact details</span>
                </label>
              </div>
              {hasCustomSelection && (format === 'pdf' || format === 'docx') && (
                <p className="theme-text-soft mt-1 text-xs">
                  Custom settings are exported as TXT for compatibility.
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                className="resume-btn resume-btn-primary w-full justify-center"
                onClick={onDownload}
                disabled={isLoading}
              >
                <span aria-hidden="true">⬇</span>
                <span>
                  {isLoading
                    ? 'Preparing...'
                    : `Download ${FORMAT_LABELS[effectiveFormat]}`}
                </span>
              </button>
            </div>

            <p className="theme-text-soft mt-3 text-xs">
              Downloaded {typeof stats === 'number' ? stats : '--'} times
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
