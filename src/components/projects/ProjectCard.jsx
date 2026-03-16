import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useTilt } from '../../hooks/useTilt.js';

function formatDate(value) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function ComplexityMeter({ value }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={`complexity-${index}`}
          className="h-1.5 w-6 rounded-full"
          style={{
            background:
              index < value
                ? 'linear-gradient(to right, var(--accent-color), #8b5cf6)'
                : 'color-mix(in oklab, var(--theme-border) 85%, transparent)',
          }}
        />
      ))}
    </div>
  );
}

export default function ProjectCard({
  project,
  onOpen,
  onTechExplore,
  githubStats,
  compared,
  onCompareToggle,
  onShare,
  onTrackProjectView,
  onTrackProjectClick,
}) {
  const reducedMotion = useReducedMotion();
  const { tilt, onMouseMove, onMouseLeave } = useTilt(9);
  const snippetPreview = project.codeSnippets?.[0]?.code || '';
  const hasLiveDemo = Boolean(project.demo && project.demo.startsWith('http') && !project.demo.includes('example.com'));
  const rootRef = useRef(null);

  useEffect(() => {
    if (!onTrackProjectView || !rootRef.current) return undefined;
    let seen = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!seen && entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            seen = true;
            onTrackProjectView(project.id);
            observer.disconnect();
          }
        });
      },
      { threshold: [0.4] },
    );

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [onTrackProjectView, project.id]);

  const handleClick = () => {
    if (onOpen) onOpen(project);
  };

  return (
    <motion.article
      ref={rootRef}
      className="glass-panel interactive group flex h-full cursor-pointer flex-col justify-between rounded-2xl p-5 outline-none transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary/70"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <div>
        <motion.div
          className="relative mb-4 overflow-hidden rounded-xl border border-[var(--theme-border)]"
          whileHover={reducedMotion ? undefined : { rotate: -0.8 }}
          transition={{ duration: 0.35 }}
        >
          <motion.img
            src={project.screenshot}
            alt={`${project.title} preview`}
            className="h-32 w-full object-cover"
            onError={(event) => {
              const image = event.currentTarget;
              if (image.dataset.fallbackApplied === 'true') return;
              image.dataset.fallbackApplied = 'true';
              // Use a conceptually appropriate fallback for Bug Tracking System
              if (project.id === 'bug-tracker') {
                image.src = '/bug-tracker.jpg';
              } else {
                image.src = '/admin.jpg';
              }
            }}
            whileHover={reducedMotion ? undefined : { scale: 1.08, rotate: 0.5 }}
            transition={{ duration: 0.35 }}
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 text-xs text-white">
            Live demo preview
          </div>
        </motion.div>

        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="theme-text-primary font-heading text-base font-semibold sm:text-lg">
            {project.title}
          </h3>
          <span className="theme-text-soft text-[11px]">{formatDate(project.date)}</span>
        </div>

        <p className="theme-text-muted text-xs leading-relaxed sm:text-sm">{project.description}</p>

        <div className="mt-3">
          <p className="theme-text-soft mb-1 text-[11px]">Complexity</p>
          <ComplexityMeter value={project.complexity || 1} />
        </div>

        <div className="mt-3">
          <p className="theme-text-soft mb-1 text-[11px]">Tech Stack Explorer</p>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <motion.button
                key={tech}
                type="button"
                className="theme-chip rounded-full px-2.5 py-1 text-[10px] font-medium"
                whileHover={reducedMotion ? undefined : { y: -2, scale: 1.03 }}
                onClick={(event) => {
                  event.stopPropagation();
                  onTechExplore?.(tech);
                }}
              >
                {tech}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="theme-chip rounded-lg p-2 text-[10px]">
            <p>Stars</p>
            <p className="theme-text-primary mt-0.5 text-xs font-semibold">{githubStats?.stars ?? '--'}</p>
          </div>
          <div className="theme-chip rounded-lg p-2 text-[10px]">
            <p>Forks</p>
            <p className="theme-text-primary mt-0.5 text-xs font-semibold">{githubStats?.forks ?? '--'}</p>
          </div>
          <div className="theme-chip rounded-lg p-2 text-[10px]">
            <p>Last Commit</p>
            <p className="theme-text-primary mt-0.5 text-xs font-semibold">
              {githubStats?.lastCommit ? formatDate(githubStats.lastCommit) : '--'}
            </p>
          </div>
        </div>

        {snippetPreview && (
          <motion.pre
            className="theme-chip mt-3 max-h-0 overflow-hidden whitespace-pre-wrap rounded-lg p-0 text-[10px] leading-relaxed opacity-0 group-hover:max-h-28 group-hover:p-2 group-hover:opacity-100"
            transition={{ duration: 0.25 }}
          >
            {snippetPreview}
          </motion.pre>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex gap-2 text-xs font-medium">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="theme-button-secondary interactive inline-flex flex-1 items-center justify-center rounded-full px-3 py-1.5 transition"
            onClick={(event) => {
              event.stopPropagation();
              onTrackProjectClick?.(project.id, 'github');
            }}
          >
            GitHub
          </a>
          <a
            href={hasLiveDemo ? project.demo : '#'}
            target="_blank"
            rel="noreferrer"
            className={`theme-button-primary interactive inline-flex flex-1 items-center justify-center rounded-full px-3 py-1.5 transition ${hasLiveDemo ? '' : 'pointer-events-none opacity-60'}`}
            onClick={(event) => {
              event.stopPropagation();
              if (hasLiveDemo) onTrackProjectClick?.(project.id, 'demo');
              if (!hasLiveDemo) event.preventDefault();
            }}
          >
            {hasLiveDemo ? 'Demo' : 'No Demo'}
          </a>
          <button
            type="button"
            className="theme-button-secondary interactive inline-flex items-center justify-center rounded-full px-3 py-1.5"
            onClick={(event) => {
              event.stopPropagation();
              onShare?.(project);
            }}
          >
            Share
          </button>
        </div>

        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            className="theme-chip rounded-full px-3 py-1"
            onClick={(event) => {
              event.stopPropagation();
              onCompareToggle?.(project.id);
            }}
          >
            {compared ? 'In Compare' : 'Compare'}
          </button>
          <button
            type="button"
            className="theme-button-primary rounded-full px-3 py-1"
            onClick={(event) => {
              event.stopPropagation();
              onOpen?.(project);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </motion.article>
  );
}
