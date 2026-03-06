export const assistantProfile = {
  fullName: 'Habtamu Shewamene',
  role: 'Junior Full-Stack Developer',
  location: 'Addis Ababa, Ethiopia (open to remote and relocation-friendly roles)',
  email: 'habtamushewamene905@gmail.com',
  bio: 'Habtamu is a junior full-stack developer focused on practical, user-centered products. He builds clean React interfaces, reliable Node/Express APIs, and Java Spring Boot systems with strong data modeling.',
  journey: [
    'Started with programming fundamentals in Java and JavaScript.',
    'Built problem-solving depth through data structures and algorithms projects.',
    'Moved into full-stack development with React, Node.js, Express, MongoDB, and MySQL.',
    'Expanded backend depth with Java Spring Boot and role-based business workflows.',
  ],
  interests: [
    'Full-stack web application architecture',
    'Backend API design and data modeling',
    'Developer productivity and maintainable codebases',
    'Building products that solve real operational problems',
  ],
  goals: [
    'Join a collaborative engineering team as a junior full-stack developer',
    'Contribute to production systems while growing architecture and testing skills',
    'Ship high-quality features across frontend and backend',
  ],
  availability: {
    status: 'Actively looking',
    summary:
      'Available for junior full-stack developer opportunities, internships, and project collaborations.',
  },
  links: {
    github: 'https://github.com/your-username',
    portfolio: 'https://example.com',
  },
};

export const skillsDatabase = {
  languages: ['HTML', 'CSS', 'JavaScript', 'Java'],
  frameworks: ['React', 'Node.js', 'Express', 'Spring Boot'],
  databases: ['MySQL', 'MongoDB'],
  tools: ['Git', 'GitHub', 'VS Code', 'XAMPP'],
  softSkills: [
    {
      name: 'Communication',
      description: 'Explains technical decisions clearly and collaborates effectively with teammates.',
    },
    {
      name: 'Problem Solving',
      description: 'Breaks down complex problems into testable, incremental steps.',
    },
    {
      name: 'Ownership',
      description: 'Follows through from implementation to validation and iteration.',
    },
    {
      name: 'Adaptability',
      description: 'Learns new tools quickly and applies them pragmatically to project goals.',
    },
  ],
};

export const projectsKnowledge = [
  {
    id: 'crypto-tracker',
    name: 'Crypto Tracker',
    year: 2025,
    mainProject: false,
    description:
      'Real-time crypto monitoring app with market data visualization and portfolio simulation.',
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'WebSocket', 'Chart.js'],
    features: [
      'Live market stream updates',
      'Interactive trend charts',
      'Portfolio watchlist and gain/loss tracking',
      'Responsive dashboard layout',
    ],
    challenge:
      'High-frequency market updates caused rendering jitter in charts.',
    solution:
      'Applied throttling, memoization, and batching to keep updates smooth and efficient.',
    github: 'https://github.com/your-username/crypto-tracker',
    liveDemo: 'https://example.com/demo/crypto-tracker',
  },
  {
    id: 'inventory-system',
    name: 'Inventory Management System',
    year: 2025,
    mainProject: false,
    description:
      'Backend-focused stock and supplier management system for small business operations.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JavaScript'],
    features: [
      'Product stock ledger and movement history',
      'Supplier and purchase management',
      'Role-based actions for operators and admins',
      'Paginated filtering for large catalogs',
    ],
    challenge: 'Concurrent updates caused stock consistency issues.',
    solution: 'Used transaction-safe writes and conflict checks for data integrity.',
    github: 'https://github.com/your-username/inventory-management-system',
    liveDemo: 'https://example.com/demo/inventory-management',
  },
  {
    id: 'helpdesk-queue',
    name: 'Helpdesk Queue System',
    year: 2025,
    mainProject: false,
    description:
      'Full-stack support ticket platform with real-time updates and queue prioritization.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
    features: [
      'Priority-based ticket queue',
      'Real-time board updates for agents',
      'SLA timer visibility',
      'Agent assignment workflow',
    ],
    challenge: 'Race conditions appeared during rapid ticket assignment.',
    solution:
      'Introduced optimistic locking and assignment validation before writes.',
    github: 'https://github.com/your-username/helpdesk-queue-system',
    liveDemo: 'https://example.com/demo/helpdesk-queue',
  },
  {
    id: 'task-management',
    name: 'Task Management System',
    year: 2025,
    mainProject: false,
    description:
      'Kanban-style collaboration app for planning, assigning, and tracking tasks.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    features: [
      'Drag-and-drop Kanban workflow',
      'Team boards and member roles',
      'Task labels, due dates, and priorities',
      'REST API-backed task operations',
    ],
    challenge: 'Drag interactions became slow with many cards.',
    solution: 'Reduced board-level re-renders by splitting and memoizing state slices.',
    github: 'https://github.com/your-username/task-management-system',
    liveDemo: 'https://example.com/demo/task-management',
  },
  {
    id: 'bug-tracker',
    name: 'Bug Tracking System',
    year: 2025,
    mainProject: false,
    description:
      'Issue tracking system for reporting, assigning, and resolving software defects.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    features: [
      'Bug lifecycle workflow (open, in-progress, resolved)',
      'Severity and assignee filters',
      'Team issue dashboard',
      'Backend workflow guard rules',
    ],
    challenge: 'Invalid status transitions created inconsistent issue states.',
    solution: 'Implemented strict transition mapping and backend validation guards.',
    github: 'https://github.com/your-username/bug-tracking-system',
    liveDemo: 'https://example.com/demo/bug-tracker',
  },
  {
    id: 'news-app',
    name: 'News App',
    year: 2025,
    mainProject: false,
    description:
      'React-based news aggregator app with category filtering and fast article browsing.',
    technologies: ['React', 'JavaScript', 'REST API', 'CSS'],
    features: [
      'Category-based article filtering',
      'Real-time headline updates from APIs',
      'Search and quick read previews',
      'Mobile-friendly reading layout',
    ],
    challenge: 'External API responses were inconsistent across categories.',
    solution:
      'Added response normalization and graceful fallback states for missing fields.',
    github: 'https://github.com/your-username/news-app',
    liveDemo: 'https://example.com/demo/news-app',
  },
  {
    id: 'job-portal',
    name: 'Job Portal System',
    year: 2026,
    mainProject: true,
    description:
      'Primary showcase project: Java Spring Boot job platform connecting job seekers, employers, and admins.',
    technologies: ['Java', 'Spring Boot', 'MySQL', 'XAMPP'],
    features: [
      'Role-based flows for job seeker, employer, and admin',
      'Job posting and application pipeline management',
      'Admin moderation tools',
      'Secure endpoint guards and relational schema',
      'Search and filtering for jobs and applications',
    ],
    challenge: 'Complex relational workflows increased query and permission complexity.',
    solution:
      'Normalized schema, added indexed queries, and centralized role-based access checks.',
    github: 'https://github.com/your-username/job-portal-system',
    liveDemo: 'https://example.com/demo/job-portal',
  },
];

export const experienceTimeline = [
  {
    role: 'Junior Full-Stack Developer (Portfolio Projects)',
    company: 'Self-directed / Independent',
    period: '2025 - Present',
    responsibilities: [
      'Designed and built full-stack projects using React, Node.js, Express, Java Spring Boot, and SQL/NoSQL databases.',
      'Implemented role-based workflows, REST APIs, and responsive frontends.',
      'Focused on practical architecture, clean folder structure, and maintainable code.',
    ],
    achievements: [
      'Delivered 7 portfolio projects across frontend, backend, and Java full-stack domains.',
      'Built a flagship Job Portal System demonstrating backend architecture depth.',
    ],
  },
  {
    role: 'Computer Science Student Developer',
    company: 'Academic + Personal Learning Track',
    period: '2023 - 2025',
    responsibilities: [
      'Built programming fundamentals in JavaScript and Java.',
      'Practiced data structures and algorithmic thinking through project-driven learning.',
      'Transitioned from foundations to production-style full-stack apps.',
    ],
    achievements: [
      'Established a consistent development workflow with Git/GitHub and VS Code.',
      'Built confidence shipping complete end-to-end applications.',
    ],
  },
];

export const assistantFaqs = {
  name: [
    'What is your name?',
    'Who is Habtamu?',
    'Tell me about Habtamu',
  ],
  skills: [
    'What skills does he have?',
    'Does he know React?',
    'What technologies does he use?',
  ],
  projects: [
    'What projects has he built?',
    'What is his best project?',
    'Tell me about the Job Portal System',
  ],
  availability: [
    'Is he available for work?',
    'Can he join a team now?',
  ],
  contact: [
    'How can I contact him?',
    'Can I see his GitHub?',
  ],
};

export const assistantCodeSnippets = {
  react: {
    title: 'React component pattern',
    language: 'jsx',
    code: `function ProjectCard({ project }) {
  return (
    <article className="rounded-xl border p-4 shadow-sm">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <ul>
        {project.technologies.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </article>
  );
}`,
  },
  node: {
    title: 'Express route controller pattern',
    language: 'javascript',
    code: `router.get('/projects', async (req, res, next) => {
  try {
    const projects = await projectService.list(req.query);
    return res.status(200).json({ data: projects });
  } catch (error) {
    return next(error);
  }
});`,
  },
  java: {
    title: 'Spring Boot role-protected endpoint',
    language: 'java',
    code: `@PreAuthorize("hasAnyRole('ADMIN','EMPLOYER')")
@PostMapping("/jobs")
public ResponseEntity<JobDto> createJob(@RequestBody JobDto payload) {
  JobDto created = jobService.create(payload);
  return ResponseEntity.status(HttpStatus.CREATED).body(created);
}`,
  },
};

export const quickActionPrompts = [
  { id: 'about', label: 'Tell me about Habtamu', prompt: 'Tell me about Habtamu' },
  { id: 'projects', label: 'Show projects', prompt: 'What projects has he built?' },
  { id: 'skills', label: 'Skills & technologies', prompt: 'What are his skills?' },
  { id: 'experience', label: 'Experience', prompt: 'What is his experience timeline?' },
  { id: 'contact', label: 'Contact info', prompt: 'How can I contact him?' },
];
