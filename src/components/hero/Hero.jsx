import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:items-center">
      <div className="flex-1 space-y-6">
        <motion.p
          className="text-sm font-medium uppercase tracking-[0.25em] text-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Building modern digital experiences
        </motion.p>

        <motion.h1
          className="font-heading text-3xl font-semibold text-slate-50 sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          👋 Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Habtamu Shewamene
          </span>
          <br />
          <span className="text-xl font-normal text-slate-300 sm:text-2xl">
            Junior Full Stack Developer
          </span>
        </motion.h1>

        <motion.p
          className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
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
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('projects');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
          >
            View Projects
          </button>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900 px-6 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-primary hover:text-primary"
          >
            Contact Me
          </button>
        </motion.div>

        <motion.div
          className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Open to junior opportunities
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1">
            Full Stack · React · Node · Java
          </span>
        </motion.div>
      </div>

      <motion.div
        className="relative mt-4 flex flex-1 justify-center md:mt-0"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <div className="relative h-52 w-52 overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-soft sm:h-64 sm:w-64">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-secondary/40" />
          <div className="relative flex h-full flex-col items-center justify-center">
            <div className="mb-3 h-20 w-20 rounded-full bg-slate-900/80 ring-2 ring-primary/70" />
            <p className="font-heading text-base font-semibold text-slate-50">
              Habtamu Shewamene
            </p>
            <p className="text-xs text-slate-400">Junior Full Stack Developer</p>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-8 -top-6 h-24 w-24 rounded-3xl border border-sky-500/30 bg-sky-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
      </motion.div>
    </div>
  );
}

