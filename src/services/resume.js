import { trackResumeDownloadEvent } from './api.js';

const PROFILE = {
  fullName: 'Habtamu Shewamene',
  role: 'Junior Full-Stack Developer',
  email: 'habtamushewamene905@gmail.com',
  github: 'https://github.com/HATAG-TECH',
  linkedin: 'https://www.linkedin.com/in/habtamu-shewamene-25a5a63b5/',
  location: 'Addis Ababa, Ethiopia',
  phone: 'Available on request',
};

const STATIC_RESUME_PDF = '/resume.pdf';
const BASE_FILENAME = 'Habtamu-Shewamene-Resume';
const SUPPORTED_FORMATS = ['pdf', 'doc', 'txt', 'md'];

let staticPdfAvailable;

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function triggerDownloadFromUrl(url, filename) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function triggerBlobDownload(content, mimeType, filename) {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);
  triggerDownloadFromUrl(objectUrl, filename);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1800);
}

function summarySection() {
  return (
    'Passionate junior full-stack developer with expertise in building modern web applications ' +
    'using React, Node.js, Java Spring Boot, and MySQL. Strong foundation in problem-solving, ' +
    'system architecture, and clean code practices. Completed 7+ full-stack projects including ' +
    'a comprehensive Job Portal System. Actively seeking opportunities to contribute to innovative development teams.'
  );
}

function skillsSectionText() {
  return [
    'Languages: JavaScript (ES6+), HTML5, CSS3, Java, SQL, NoSQL query languages',
    'Frontend: React.js with Hooks, TailwindCSS, Bootstrap, Framer Motion, responsive design',
    'Backend: Node.js, Express, Java Spring Boot, RESTful API design, JWT authentication',
    'Databases: MySQL, XAMPP, MongoDB, schema design and optimization',
    'Tools & Methods: Git, GitHub, VS Code, IntelliJ, Agile/Scrum, Postman, UML',
  ];
}

function projectsSectionText() {
  return [
    '1) Job Portal System (Java Full Stack) - Java, Spring Boot, MySQL, XAMPP, Thymeleaf',
    '   Complete job platform with skill-based search, employer posting, and admin approval.',
    '   Achievement: Role-based access and complex database relationships.',
    '2) Crypto Tracker - React, WebSockets, Chart.js, Axios',
    '   Real-time cryptocurrency dashboard with live price updates.',
    '   Achievement: WebSocket integration and dynamic chart updates.',
    '3) Inventory Management System - Node.js, Express, MongoDB, React',
    '   Full inventory control with barcode scanning and low stock alerts.',
    '   Achievement: Barcode integration and email notification workflows.',
    '4) Helpdesk Queue System - React, Node.js, Socket.io, MongoDB',
    '   Ticket management with priority queues and real-time assignment.',
    '   Achievement: Real-time updates and fair assignment algorithm.',
    '5) Task Management System - React, DnD Kit, Express, MongoDB',
    '   Kanban task organizer with drag-and-drop collaboration.',
    '   Achievement: Complex state management and polished drag-drop UX.',
    '6) Bug Tracking System - MERN, JWT, Bootstrap',
    '   Workflow-based bug tracking with team assignment.',
    '   Achievement: Custom workflow engine and analytics dashboard.',
    '7) News App - React, News API, LocalStorage, TailwindCSS',
    '   Personalized news app with filtering and search.',
    '   Achievement: Caching system and offline support.',
  ];
}

function experienceSectionText() {
  return [
    'Junior Full-Stack Developer (Freelance) | 2024 - Present',
    '- Developed and deployed 7+ full-stack web applications.',
    '- Built RESTful APIs with authentication, validation, and rate limiting.',
    '- Implemented responsive UI and third-party integrations.',
    '',
    'Web Development Intern | 2023 - 2024',
    '- Assisted in internal tools development and team collaboration.',
    '- Applied Agile workflows and production coding practices.',
    '',
    'Self-Taught Developer | 2022 - 2023',
    '- Completed structured learning paths and shipped personal projects.',
    '- Strengthened core foundations in web engineering and architecture.',
  ];
}

function educationSectionText() {
  return [
    'Bachelor\'s in Software Engineering (in progress) | Debre Berhan University | 2023 - 2028',
    '- Built multiple full-stack projects and participated in hackathons.',
    '- Relevant coursework: Data Structures, Algorithms, Database Design.',
  ];
}

function languagesSectionText() {
  return [
    'English (Fluent)',
    'Amharic (Native)',
  ];
}

function interestsSectionText() {
  return [
    'Open Source Contribution',
    'Problem Solving',
    'Learning New Technologies',
    'System Design',
  ];
}

function buildResumeText() {
  const lines = [
    PROFILE.fullName,
    PROFILE.role,
    `${PROFILE.location} | ${PROFILE.email} | ${PROFILE.phone}`,
    `GitHub: ${PROFILE.github}`,
    `LinkedIn: ${PROFILE.linkedin}`,
    '',
    'PROFESSIONAL SUMMARY',
    summarySection(),
    '',
    'TECHNICAL SKILLS',
    ...skillsSectionText(),
    '',
    'PROJECTS',
    ...projectsSectionText(),
    '',
    'EXPERIENCE',
    ...experienceSectionText(),
    '',
    'EDUCATION',
    ...educationSectionText(),
    '',
    'LANGUAGES',
    ...languagesSectionText(),
    '',
    'INTERESTS',
    ...interestsSectionText(),
  ];

  return lines.join('\n');
}

function buildResumeMarkdown() {
  return [
    `# ${PROFILE.fullName}`,
    `**${PROFILE.role}**`,
    '',
    `- Location: ${PROFILE.location}`,
    `- Email: ${PROFILE.email}`,
    `- Phone: ${PROFILE.phone}`,
    `- GitHub: ${PROFILE.github}`,
    `- LinkedIn: ${PROFILE.linkedin}`,
    '',
    '## Professional Summary',
    summarySection(),
    '',
    '## Technical Skills',
    ...skillsSectionText().map((line) => `- ${line}`),
    '',
    '## Projects',
    ...projectsSectionText().map((line) => `- ${line}`),
    '',
    '## Experience',
    ...experienceSectionText().map((line) => `- ${line}`),
    '',
    '## Education',
    ...educationSectionText().map((line) => `- ${line}`),
    '',
    '## Languages',
    ...languagesSectionText().map((line) => `- ${line}`),
    '',
    '## Interests',
    ...interestsSectionText().map((line) => `- ${line}`),
    '',
  ].join('\n');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function buildResumeDocHtml() {
  return `
<html>
<head>
  <meta charset="utf-8" />
  <title>${PROFILE.fullName} Resume</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; margin: 28px; color: #111827; line-height: 1.45; }
    h1 { margin: 0 0 6px; font-size: 28px; }
    h2 { margin-top: 20px; margin-bottom: 8px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    p, li { font-size: 12pt; }
    ul { margin-top: 4px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(PROFILE.fullName)}</h1>
  <p><strong>${escapeHtml(PROFILE.role)}</strong></p>
  <p>${escapeHtml(`${PROFILE.location} | ${PROFILE.email} | ${PROFILE.phone}`)}</p>
  <p>GitHub: ${escapeHtml(PROFILE.github)}<br/>LinkedIn: ${escapeHtml(PROFILE.linkedin)}</p>

  <h2>Professional Summary</h2>
  <p>${escapeHtml(summarySection())}</p>

  <h2>Technical Skills</h2>
  <ul>${skillsSectionText().map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>

  <h2>Projects</h2>
  <ul>${projectsSectionText().map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>

  <h2>Experience</h2>
  <ul>${experienceSectionText().map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>

  <h2>Education</h2>
  <ul>${educationSectionText().map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>

  <h2>Languages</h2>
  <ul>${languagesSectionText().map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>

  <h2>Interests</h2>
  <ul>${interestsSectionText().map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>
</body>
</html>`.trim();
}

async function hasStaticPdf() {
  if (typeof staticPdfAvailable === 'boolean') return staticPdfAvailable;
  try {
    const response = await fetch(STATIC_RESUME_PDF, { method: 'HEAD', cache: 'no-store' });
    staticPdfAvailable = response.ok;
  } catch {
    staticPdfAvailable = false;
  }
  return staticPdfAvailable;
}

export async function checkStaticResumePdf() {
  return hasStaticPdf();
}

export function getSupportedResumeFormats() {
  return [...SUPPORTED_FORMATS];
}

export async function downloadResume({ format = 'pdf', placement = 'unknown' } = {}) {
  const normalizedFormat = String(format || 'pdf').toLowerCase();
  if (!SUPPORTED_FORMATS.includes(normalizedFormat)) {
    throw new Error('Unsupported resume format.');
  }

  await wait(420);

  let source = 'generated';
  let trackedFormat = normalizedFormat;

  if (normalizedFormat === 'pdf') {
    const available = await hasStaticPdf();
    if (available) {
      source = 'static';
      triggerDownloadFromUrl(STATIC_RESUME_PDF, `${BASE_FILENAME}.pdf`);
    } else {
      trackedFormat = 'doc';
      triggerBlobDownload(buildResumeDocHtml(), 'application/msword', `${BASE_FILENAME}.doc`);
    }
  } else if (normalizedFormat === 'doc') {
    triggerBlobDownload(buildResumeDocHtml(), 'application/msword', `${BASE_FILENAME}.doc`);
  } else if (normalizedFormat === 'txt') {
    triggerBlobDownload(buildResumeText(), 'text/plain;charset=utf-8', `${BASE_FILENAME}.txt`);
  } else if (normalizedFormat === 'md') {
    triggerBlobDownload(buildResumeMarkdown(), 'text/markdown;charset=utf-8', `${BASE_FILENAME}.md`);
  }

  try {
    await trackResumeDownloadEvent({
      format: trackedFormat,
      placement,
      source,
    });
  } catch {
    // Non-blocking analytics call.
  }

  return {
    format: trackedFormat,
    source,
  };
}
