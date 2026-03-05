import { motion } from 'framer-motion';

const skillGroups = [
  {
    label: 'Frontend',
    skills: [
      { name: 'React', level: 70 },
      { name: 'HTML', level: 85 },
      { name: 'CSS', level: 80 },
      { name: 'Tailwind CSS', level: 65 },
    ],
  },
  {
    label: 'Backend',
    skills: [
      { name: 'Node.js', level: 60 },
      { name: 'Express', level: 55 },
      { name: 'Spring Boot', level: 50 },
    ],
  },
  {
    label: 'Languages & Databases',
    skills: [
      { name: 'Java', level: 75 },
      { name: 'C++', level: 70 },
      { name: 'JavaScript', level: 70 },
      { name: 'MySQL', level: 65 },
      { name: 'MongoDB', level: 55 },
    ],
  },
  {
    label: 'Tools',
    skills: [
      { name: 'Git', level: 70 },
      { name: 'GitHub', level: 70 },
    ],
  },
];

export default function Skills() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-slate-50 sm:text-3xl">
          Technical <span className="text-primary">Skills</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          A snapshot of the technologies I work with most often. Levels represent relative comfort
          and experience, and I&apos;m always improving.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.label} className="glass-panel rounded-2xl p-4">
            <h3 className="font-heading text-sm font-semibold text-slate-50 sm:text-base">
              {group.label}
            </h3>
            <div className="mt-3 space-y-3">
              {group.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between text-xs text-slate-200">
                    <span>{skill.name}</span>
                    <span className="text-slate-400">{skill.level}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800">
                    <motion.div
                      className="h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

