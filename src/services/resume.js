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

function skillsMatrixRows() {
  return [
    ['JavaScript', 'Advanced', 'Frontend + Backend'],
    ['React', 'Advanced', 'Hooks, State, Routing'],
    ['Node.js / Express', 'Intermediate', 'REST APIs, validation, security'],
    ['Java / Spring Boot', 'Intermediate', 'Role-based backend applications'],
    ['MySQL / MongoDB', 'Intermediate', 'Schema design and query optimization'],
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

function normalizeInclude(include = {}) {
  return {
    fullResume: include.fullResume !== false,
    skillsMatrix: include.skillsMatrix !== false,
    contactDetails: include.contactDetails === true,
  };
}

function matrixAsText() {
  const rows = skillsMatrixRows();
  return [
    'Skill | Level | Focus',
    '---------------------------------------------',
    ...rows.map((row) => `${row[0]} | ${row[1]} | ${row[2]}`),
  ];
}

function matrixAsMarkdown() {
  const rows = skillsMatrixRows();
  return [
    '| Skill | Level | Focus |',
    '| --- | --- | --- |',
    ...rows.map((row) => `| ${row[0]} | ${row[1]} | ${row[2]} |`),
  ];
}

function buildResumeText(include) {
  const options = normalizeInclude(include);
  const lines = [
    PROFILE.fullName,
    PROFILE.role,
  ];

  if (options.contactDetails) {
    lines.push(`${PROFILE.location} | ${PROFILE.email} | ${PROFILE.phone}`);
    lines.push(`GitHub: ${PROFILE.github}`);
    lines.push(`LinkedIn: ${PROFILE.linkedin}`);
  }

  lines.push('');
  lines.push('PROFESSIONAL SUMMARY');
  lines.push(summarySection());

  if (options.skillsMatrix) {
    lines.push('');
    lines.push('SKILLS MATRIX');
    lines.push(...matrixAsText());
  }

  if (options.fullResume) {
    lines.push('');
    lines.push('TECHNICAL SKILLS');
    lines.push(...skillsSectionText());
    lines.push('');
    lines.push('PROJECTS');
    lines.push(...projectsSectionText());
    lines.push('');
    lines.push('EXPERIENCE');
    lines.push(...experienceSectionText());
    lines.push('');
    lines.push('EDUCATION');
    lines.push(...educationSectionText());
    lines.push('');
    lines.push('LANGUAGES');
    lines.push(...languagesSectionText());
    lines.push('');
    lines.push('INTERESTS');
    lines.push(...interestsSectionText());
  }

  return lines.join('\n');
}

function buildResumeMarkdown(include) {
  const options = normalizeInclude(include);
  const lines = [
    `# ${PROFILE.fullName}`,
    `**${PROFILE.role}**`,
    '',
  ];

  if (options.contactDetails) {
    lines.push(`- Location: ${PROFILE.location}`);
    lines.push(`- Email: ${PROFILE.email}`);
    lines.push(`- Phone: ${PROFILE.phone}`);
    lines.push(`- GitHub: ${PROFILE.github}`);
    lines.push(`- LinkedIn: ${PROFILE.linkedin}`);
    lines.push('');
  }

  lines.push('## Professional Summary');
  lines.push(summarySection());
  lines.push('');

  if (options.skillsMatrix) {
    lines.push('## Skills Matrix');
    lines.push(...matrixAsMarkdown());
    lines.push('');
  }

  if (options.fullResume) {
    lines.push('## Technical Skills');
    lines.push(...skillsSectionText().map((line) => `- ${line}`));
    lines.push('');
    lines.push('## Projects');
    lines.push(...projectsSectionText().map((line) => `- ${line}`));
    lines.push('');
    lines.push('## Experience');
    lines.push(...experienceSectionText().map((line) => `- ${line}`));
    lines.push('');
    lines.push('## Education');
    lines.push(...educationSectionText().map((line) => `- ${line}`));
    lines.push('');
    lines.push('## Languages');
    lines.push(...languagesSectionText().map((line) => `- ${line}`));
    lines.push('');
    lines.push('## Interests');
    lines.push(...interestsSectionText().map((line) => `- ${line}`));
  }

  return lines.join('\n');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function buildResumeDocHtml(template = 'modern', include) {
  const options = normalizeInclude(include);
  const isModern = template === 'modern';
  const styles = isModern
    ? `
      body { font-family: 'Segoe UI', Arial, sans-serif; margin: 26px; color: #0f172a; line-height: 1.45; }
      h1 { margin: 0 0 4px; font-size: 30px; color: #1d4ed8; }
      h2 { margin-top: 20px; margin-bottom: 8px; font-size: 17px; border-left: 4px solid #8b5cf6; padding-left: 8px; }
      p, li, td, th { font-size: 11.5pt; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      th, td { border: 1px solid #dbeafe; padding: 6px 8px; text-align: left; }
      th { background: #eff6ff; }`
    : `
      body { font-family: Calibri, Arial, sans-serif; margin: 28px; color: #111827; line-height: 1.45; }
      h1 { margin: 0 0 6px; font-size: 28px; }
      h2 { margin-top: 20px; margin-bottom: 8px; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
      p, li, td, th { font-size: 12pt; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      th, td { border: 1px solid #e5e7eb; padding: 6px 8px; text-align: left; }`;

  const contactHtml = options.contactDetails
    ? `<p>${escapeHtml(`${PROFILE.location} | ${PROFILE.email} | ${PROFILE.phone}`)}</p>
       <p>GitHub: ${escapeHtml(PROFILE.github)}<br/>LinkedIn: ${escapeHtml(PROFILE.linkedin)}</p>`
    : '';

  const matrixHtml = options.skillsMatrix
    ? `
      <h2>Skills Matrix</h2>
      <table>
        <thead><tr><th>Skill</th><th>Level</th><th>Focus</th></tr></thead>
        <tbody>
          ${skillsMatrixRows().map((row) => `<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td></tr>`).join('')}
        </tbody>
      </table>`
    : '';

  const fullResumeHtml = options.fullResume
    ? `
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
      <ul>${interestsSectionText().map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`
    : '';

  return `
<html>
<head>
  <meta charset="utf-8" />
  <title>${PROFILE.fullName} Resume</title>
  <style>${styles}</style>
</head>
<body>
  <h1>${escapeHtml(PROFILE.fullName)}</h1>
  <p><strong>${escapeHtml(PROFILE.role)}</strong></p>
  ${contactHtml}

  <h2>Professional Summary</h2>
  <p>${escapeHtml(summarySection())}</p>

  ${matrixHtml}
  ${fullResumeHtml}
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

export function openResumeEmail(options = {}) {
  const format = String(options.format || 'pdf').toUpperCase();
  const template = String(options.template || 'modern');
  const include = normalizeInclude(options.include);
  const params = new URLSearchParams({
    subject: 'Resume Request - Habtamu Shewamene',
    body:
      `Hi Habtamu,\n\n` +
      `I downloaded your resume from the portfolio and wanted to connect.\n\n` +
      `Selection:\n` +
      `- Format: ${format}\n` +
      `- Template: ${template}\n` +
      `- Full Resume: ${include.fullResume ? 'Yes' : 'No'}\n` +
      `- Skills Matrix: ${include.skillsMatrix ? 'Yes' : 'No'}\n` +
      `- Contact Details Included: ${include.contactDetails ? 'Yes' : 'No'}\n\n` +
      `Best regards,`,
  });

  window.location.href = `mailto:${PROFILE.email}?${params.toString()}`;
}

export async function downloadResume({
  format = 'pdf',
  placement = 'unknown',
  template = 'modern',
  include = {},
  source = 'panel',
} = {}) {
  const normalizedFormat = String(format || 'pdf').toLowerCase();
  if (!SUPPORTED_FORMATS.includes(normalizedFormat)) {
    throw new Error('Unsupported resume format.');
  }

  const includeOptions = normalizeInclude(include);
  await wait(420);

  let trackedFormat = normalizedFormat;
  let trackedSource = source;

  if (normalizedFormat === 'pdf') {
    const available = await hasStaticPdf();
    if (available && includeOptions.fullResume && includeOptions.skillsMatrix) {
      trackedSource = 'static';
      triggerDownloadFromUrl(STATIC_RESUME_PDF, `${BASE_FILENAME}.pdf`);
    } else {
      trackedFormat = 'doc';
      triggerBlobDownload(
        buildResumeDocHtml(template, includeOptions),
        'application/msword',
        `${BASE_FILENAME}.docx`,
      );
    }
  } else if (normalizedFormat === 'doc') {
    triggerBlobDownload(
      buildResumeDocHtml(template, includeOptions),
      'application/msword',
      `${BASE_FILENAME}.docx`,
    );
  } else if (normalizedFormat === 'txt') {
    triggerBlobDownload(
      buildResumeText(includeOptions),
      'text/plain;charset=utf-8',
      `${BASE_FILENAME}.txt`,
    );
  } else if (normalizedFormat === 'md') {
    triggerBlobDownload(
      buildResumeMarkdown(includeOptions),
      'text/markdown;charset=utf-8',
      `${BASE_FILENAME}.md`,
    );
  }

  try {
    await trackResumeDownloadEvent({
      format: trackedFormat,
      placement,
      source: `${trackedSource}:${template}`,
    });
  } catch {
    // Non-blocking analytics call.
  }

  return { format: trackedFormat };
}
