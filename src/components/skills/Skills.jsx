import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const skillGroups = [
  {
    label: 'Frontend',
    skills: [
      { name: 'React', level: 70, icon: 'RE' },
      { name: 'HTML', level: 85, icon: 'HT' },
      { name: 'CSS', level: 80, icon: 'CS' },
      { name: 'Tailwind CSS', level: 65, icon: 'TW' },
    ],
  },
  {
    label: 'Backend',
    skills: [
      { name: 'Node.js', level: 60, icon: 'ND' },
      { name: 'Express', level: 55, icon: 'EX' },
      { name: 'Spring Boot', level: 50, icon: 'SB' },
    ],
  },
  {
    label: 'Languages and Databases',
    skills: [
      { name: 'Java', level: 75, icon: 'JV' },
      { name: 'C++', level: 70, icon: 'C+' },
      { name: 'JavaScript', level: 70, icon: 'JS' },
      { name: 'MySQL', level: 65, icon: 'MY' },
      { name: 'MongoDB', level: 55, icon: 'MG' },
    ],
  },
  {
    label: 'Tools',
    skills: [
      { name: 'Git', level: 70, icon: 'GT' },
      { name: 'GitHub', level: 70, icon: 'GH' },
    ],
  },
];

function SkillChip({ skill }) {
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      className="theme-surface interactive rounded-xl p-3"
      onMouseMove={(event) => {
        if (reducedMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setOffset({
          x: ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 14,
          y: ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 14,
        });
      }}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={
        reducedMotion
          ? undefined
          : { x: offset.x, y: offset.y, rotate: offset.x * 0.2 }
      }
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      style={{ willChange: 'transform' }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold text-slate-100"
          style={{ background: 'linear-gradient(140deg, var(--accent-soft), rgba(139, 92, 246, 0.35))' }}
          whileHover={reducedMotion ? undefined : { scale: 1.08, rotate: 4 }}
        >
          {skill.icon}
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="theme-text-muted flex items-center justify-between text-xs">
            <span className="truncate">{skill.name}</span>
            <span className="theme-text-soft">{skill.level}%</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-[color:var(--theme-border)]">
            <motion.div
              className="h-1.5 rounded-full"
              style={{ background: 'linear-gradient(to right, var(--accent-color), #8b5cf6)' }}
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="theme-text-primary font-heading text-2xl font-semibold sm:text-3xl">
          Technical <span className="theme-text-accent">Skills</span>
        </h2>
        <p className="theme-text-muted mt-2 max-w-xl text-sm">
          A snapshot of the technologies I work with most often. Levels represent relative comfort
          and experience, and I&apos;m always improving.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {skillGroups.map((group, groupIndex) => (
          <motion.div
            key={group.label}
            className="glass-panel rounded-2xl p-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: groupIndex * 0.06 }}
          >
            <h3 className="theme-text-primary font-heading text-sm font-semibold sm:text-base">
              {group.label}
            </h3>
            <div className="mt-3 grid gap-3">
              {group.skills.map((skill) => (
                <SkillChip key={skill.name} skill={skill} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
