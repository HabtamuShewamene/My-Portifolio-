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

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

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
        className="theme-surface relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-5 text-sm"
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
          <p className="theme-text-accent text-xs font-semibold uppercase tracking-wide">
            Case Study
          </p>
          <h3 className="theme-text-primary font-heading text-xl font-semibold">
            {project.title}
          </h3>
          <p className="theme-text-muted mt-2 text-xs sm:text-sm">
            {project.description}
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {project.techStack?.map((tech) => (
            <span
              key={tech}
              className="theme-chip rounded-full px-3 py-1 text-[11px] font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="theme-text-soft font-heading text-xs font-semibold uppercase tracking-wide">
              Key Features
            </h4>
            <ul className="theme-text-muted mt-2 list-disc space-y-1 pl-4 text-xs sm:text-sm">
              {(project.features || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="theme-text-soft font-heading text-xs font-semibold uppercase tracking-wide">
              Challenges Solved
            </h4>
            <ul className="theme-text-muted mt-2 list-disc space-y-1 pl-4 text-xs sm:text-sm">
              {(project.challenges || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
            href={project.demo || '#'}
            target="_blank"
            rel="noreferrer"
            className="theme-button-primary inline-flex items-center justify-center rounded-full px-4 py-2"
          >
            Live Demo
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

