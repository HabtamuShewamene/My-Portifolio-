import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProjectCard({ project, onOpen }) {
  const { title, description, techStack, github, demo } = project;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { currentTarget, clientX, clientY } = event;
    const rect = currentTarget.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * 6;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = () => {
    if (onOpen) onOpen(project);
  };

  return (
    <motion.article
      className="glass-panel flex h-full cursor-pointer flex-col justify-between rounded-2xl p-5 outline-none transition-shadow hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary/70"
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6, scale: 1.01 }}
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
        <h3 className="font-heading text-base font-semibold text-slate-50 sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-300 sm:text-sm">
          {description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-medium text-slate-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2 text-xs font-medium">
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 px-3 py-1.5 text-slate-100 transition hover:border-primary hover:text-primary"
          onClick={(event) => event.stopPropagation()}
        >
          View GitHub
        </a>
        <a
          href={demo || '#'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center rounded-full bg-primary/90 px-3 py-1.5 text-slate-950 transition hover:bg-primary"
          onClick={(event) => event.stopPropagation()}
        >
          Live Demo
        </a>
      </div>
    </motion.article>
  );
}

