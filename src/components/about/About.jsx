import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <h2 className="font-heading text-2xl font-semibold text-slate-50 sm:text-3xl">
          About <span className="text-primary">Habtamu</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
          I&apos;m a junior full stack developer who enjoys learning by building. My journey started
          with programming fundamentals and data structures, and has grown into building real-world
          applications across the stack. I care about writing clean, readable code and delivering
          useful products.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
          I&apos;m especially interested in problem solving, backend systems, and how good UX and
          strong engineering come together to create modern digital experiences.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: 'Learning Journey',
            body: 'From C++ and data structures to full stack Java, React, and Node.js.',
          },
          {
            title: 'Real Projects',
            body: 'Inventory systems, helpdesk queues, bug trackers, and job portals.',
          },
          {
            title: 'Career Goals',
            body: 'Join a team as a junior developer, keep shipping projects, and grow into a strong full stack engineer.',
          },
        ].map((card) => (
          <motion.div
            key={card.title}
            className="glass-panel rounded-xl p-4"
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <h3 className="font-heading text-sm font-semibold text-slate-50 sm:text-base">
              {card.title}
            </h3>
            <p className="mt-2 text-xs text-slate-300 sm:text-sm">{card.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

