import { useState } from 'react';
import { motion } from 'framer-motion';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, backdropFilter: 'blur(8px)' },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: 40, scale: 0.95, filter: 'blur(6px)' },
};

function ArchitectureDiagram({ layers = [] }) {
  return (
    <div className="theme-chip rounded-xl p-3">
      <p className="theme-text-soft mb-2 text-xs font-semibold uppercase">Architecture Diagram</p>
      <div className="space-y-2">
        {layers.map((layer, index) => (
          <div key={layer.name} className="relative rounded-lg border border-[var(--theme-border)] px-3 py-2 text-xs">
            <p className="theme-text-primary font-semibold">{layer.name}</p>
            <p className="theme-text-muted mt-0.5">{layer.role}</p>
            {index < layers.length - 1 && (
              <div className="absolute -bottom-2 left-1/2 h-2 w-px -translate-x-1/2 bg-[var(--theme-border)]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricBars({ metrics = [] }) {
  return (
    <div className="theme-chip rounded-xl p-3">
      <p className="theme-text-soft mb-2 text-xs font-semibold uppercase">Performance Metrics</p>
      <div className="space-y-2">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="mb-1 flex justify-between text-[11px]">
              <span>{metric.label}</span>
              <span>{metric.value}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[color:var(--theme-border)]">
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${metric.value}%`,
                  background: 'linear-gradient(to right, var(--accent-color), #8b5cf6)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectModal({ project, onClose, onTechExplore, onShare }) {
  const [snippetIndex, setSnippetIndex] = useState(0);
  if (!project) return null;

  const snippets = project.codeSnippets || [];
  const activeSnippet = snippets[snippetIndex];
  const hasLiveDemo = Boolean(project.demo?.startsWith('http') && !project.demo.includes('example.com'));
  const canEmbedDemo = hasLiveDemo;

  return (
    <motion.div
      className="theme-modal-backdrop fixed inset-0 z-50 flex items-end justify-center px-3 py-4 sm:items-center sm:px-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="theme-surface relative max-h-[88vh] w-full max-w-4xl overflow-y-auto rounded-3xl p-5 text-sm"
        variants={modalVariants}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} details`}
      >
        <button
          type="button"
          onClick={onClose}
          className="theme-button-secondary absolute right-4 top-4 rounded-full px-2 py-1 text-xs"
        >
          Close
        </button>

        <div className="mb-4">
          <p className="theme-text-accent text-xs font-semibold uppercase tracking-wide">Case Study</p>
          <h3 className="theme-text-primary font-heading text-xl font-semibold">{project.title}</h3>
          <p className="theme-text-muted mt-2 text-xs sm:text-sm">{project.description}</p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {project.techStack?.map((tech) => (
            <button
              key={tech}
              type="button"
              className="theme-chip rounded-full px-3 py-1 text-[11px] font-medium"
              onClick={() => onTechExplore?.(tech)}
            >
              {tech}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ArchitectureDiagram layers={project.architecture} />

          <div className="theme-chip rounded-xl p-3">
            <p className="theme-text-soft mb-2 text-xs font-semibold uppercase">Key Features</p>
            <ul className="space-y-1.5 text-xs">
              {(project.features || []).map((item) => (
                <li key={item.title} className="flex items-start gap-2">
                  <span className="theme-chip-active mt-0.5 inline-flex rounded px-1.5 py-0.5 text-[10px]">
                    {item.icon}
                  </span>
                  <span>
                    <span className="theme-text-primary font-medium">{item.title}:</span>{' '}
                    <span className="theme-text-muted">{item.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="theme-chip rounded-xl p-3 lg:col-span-2">
            <p className="theme-text-soft mb-2 text-xs font-semibold uppercase">
              Challenges and Solutions
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(project.challenges || []).map((item) => (
                <div key={item.challenge} className="rounded-lg border border-[var(--theme-border)] p-2">
                  <p className="theme-text-primary text-xs font-semibold">Challenge</p>
                  <p className="theme-text-muted text-xs">{item.challenge}</p>
                  <p className="theme-text-primary mt-1 text-xs font-semibold">Solution</p>
                  <p className="theme-text-muted text-xs">{item.solution}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="theme-chip rounded-xl p-3 lg:col-span-2">
            <p className="theme-text-soft mb-2 text-xs font-semibold uppercase">Code Snippet Viewer</p>
            <div className="mb-2 flex flex-wrap gap-2">
              {snippets.map((snippet, index) => (
                <button
                  key={snippet.label}
                  type="button"
                  onClick={() => setSnippetIndex(index)}
                  className={`rounded-full px-3 py-1 text-[11px] ${
                    index === snippetIndex ? 'theme-chip-active' : 'theme-chip'
                  }`}
                >
                  {snippet.label}
                </button>
              ))}
            </div>
            {activeSnippet && (
              <pre className="theme-surface overflow-auto rounded-lg p-3 text-[11px]">
                <code>{activeSnippet.code}</code>
              </pre>
            )}
          </div>

          <MetricBars metrics={project.metrics || []} />

          <div className="theme-chip rounded-xl p-3">
            <p className="theme-text-soft mb-2 text-xs font-semibold uppercase">Live Demo Embed</p>
            {canEmbedDemo ? (
              <iframe
                src={project.demo}
                title={`${project.title} demo`}
                className="h-48 w-full rounded-lg border border-[var(--theme-border)]"
                loading="lazy"
              />
            ) : (
              <p className="theme-text-muted text-xs">Demo embed unavailable for this project.</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="theme-button-secondary inline-flex items-center justify-center rounded-full px-4 py-2"
          >
            View GitHub
          </a>
          <a
            href={hasLiveDemo ? project.demo : '#'}
            target="_blank"
            rel="noreferrer"
            className={`theme-button-primary inline-flex items-center justify-center rounded-full px-4 py-2 ${hasLiveDemo ? '' : 'pointer-events-none opacity-60'}`}
            onClick={(event) => {
              if (!hasLiveDemo) event.preventDefault();
            }}
          >
            {hasLiveDemo ? 'Live Demo' : 'No Live Demo'}
          </a>
          <button
            type="button"
            onClick={() => onShare?.(project)}
            className="theme-button-secondary rounded-full px-4 py-2"
          >
            Share Project
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
