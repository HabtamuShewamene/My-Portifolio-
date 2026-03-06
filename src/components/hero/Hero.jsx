import { motion, useReducedMotion } from 'framer-motion';
import MagneticButton from '../ui/MagneticButton.jsx';
import HeroBackground from './HeroBackground.jsx';
import { useTypewriter } from '../../hooks/useTypewriter.js';

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const role = useTypewriter([
    'Full Stack Developer',
    'React Frontend Engineer',
    'Node.js Backend Builder',
    'Problem Solver',
  ]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="theme-surface relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
      <HeroBackground />
      <div className="relative z-[1] flex flex-col gap-10 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <motion.p
            className="theme-text-accent text-sm font-medium uppercase tracking-[0.25em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Building modern digital experiences
          </motion.p>

          <motion.h1
            className="theme-text-primary font-heading text-3xl font-semibold sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Habtamu Shewamene
            </span>
            <br />
            <span className="theme-text-muted inline-flex min-h-8 items-center text-xl font-normal sm:text-2xl">
              {role}
              <span className="ml-1 h-6 w-[2px] animate-pulse bg-primary/80" />
            </span>
          </motion.h1>

          <motion.p
            className="theme-text-muted max-w-xl text-sm leading-relaxed sm:text-base"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            I enjoy turning complex problems into simple, scalable solutions. I&apos;m focused on
            building real-world full stack applications using modern technologies and clean code
            practices.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <MagneticButton
              onClick={() => scrollTo('projects')}
              className="theme-button-primary interactive inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition"
            >
              View Projects
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollTo('contact')}
              className="theme-button-secondary interactive inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition"
            >
              Contact Me
            </MagneticButton>
          </motion.div>

          <motion.div
            className="theme-text-soft mt-2 flex flex-wrap gap-3 text-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="theme-chip inline-flex items-center rounded-full px-3 py-1">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Open to junior opportunities
            </span>
            <span className="theme-chip inline-flex items-center rounded-full px-3 py-1">
              Full Stack - React - Node - Java
            </span>
          </motion.div>
        </div>

        <motion.div
          className="relative mt-4 flex flex-1 justify-center md:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <motion.div
            className="theme-surface group relative h-56 w-56 overflow-hidden rounded-3xl sm:h-72 sm:w-72"
            whileHover={reducedMotion ? undefined : { scale: 1.04, rotate: -2, rotateY: 9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-soft)] via-transparent to-violet-500/40"
              whileHover={reducedMotion ? undefined : { scale: 1.12, rotate: 4 }}
              transition={{ duration: 0.5 }}
            />
            <img
              src="/profile-photo.jpg"
              alt="Habtamu Shewamene profile photo"
              className="relative h-full w-full object-cover object-center"
              loading="eager"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/60 to-transparent p-4">
              <p className="font-heading text-sm font-semibold text-white">Habtamu Shewamene</p>
              <p className="text-xs text-slate-200">{role || 'Full Stack Developer'}</p>
            </div>
            <motion.div
              className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-sky-500/30 blur-2xl"
              animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.div>

          <div className="pointer-events-none absolute -right-8 -top-6 h-24 w-24 rounded-3xl border border-sky-500/30 bg-sky-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
