import { motion } from 'framer-motion';

const steps = [
  {
    title: 'Programming Fundamentals',
    period: 'Step 1',
    description: 'Started with core programming concepts using C++ and Java.',
  },
  {
    title: 'Data Structures & Algorithms',
    period: 'Step 2',
    description: 'Implemented queues, stacks, linked lists, and more in real exercises.',
  },
  {
    title: 'Building Real Projects',
    period: 'Step 3',
    description:
      'Created systems like inventory management, helpdesk queues, bug trackers, and news apps.',
  },
  {
    title: 'Full Stack Development',
    period: 'Step 4',
    description:
      'Learning React, Node.js, Express, and Java Spring Boot to build full stack applications.',
  },
];

export default function Timeline() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-semibold text-slate-50 sm:text-3xl">
          Experience & <span className="text-primary">Learning Path</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-300">
          A timeline of how I&apos;ve been growing as a developer – focusing on fundamentals first,
          then applying them to real projects.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-slate-700/60 sm:left-1/2" />

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={step.title}
                className="relative flex items-start gap-4 sm:gap-8"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div
                  className={`mt-2 hidden h-3 w-3 rounded-full bg-primary ring-4 ring-sky-500/30 sm:block ${
                    isLeft ? 'sm:order-1 sm:ml-[calc(50%-0.375rem)]' : 'sm:order-2 sm:ml-[calc(50%-0.375rem)]'
                  }`}
                />

                <div className="sm:w-1/2" />

                <div
                  className={`glass-panel w-full rounded-xl p-4 sm:w-1/2 ${
                    isLeft ? 'sm:order-1' : 'sm:order-3'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {step.period}
                  </p>
                  <h3 className="mt-1 font-heading text-sm font-semibold text-slate-50 sm:text-base">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 sm:text-sm">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

