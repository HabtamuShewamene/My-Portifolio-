import { trackResumeDownloadEvent } from './api.js';

const BASE_FILENAME = 'habtamu-shewamene-resume';
const SUPPORTED_FORMATS = ['pdf', 'docx', 'txt', 'md'];

const RESUME_FILES = {
  pdf: {
    filename: `${BASE_FILENAME}.pdf`,
  },
  docx: {
    filename: `${BASE_FILENAME}.docx`,
  },
  txt: {
    filename: `${BASE_FILENAME}.txt`,
  },
  md: {
    filename: `${BASE_FILENAME}.md`,
  },
};

function triggerDownloadFromUrl(url, filename) {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export async function downloadResume({
  format = 'pdf',
  placement = 'unknown',
} = {}) {
  const normalizedFormat = String(format || 'pdf').toLowerCase();
  if (!SUPPORTED_FORMATS.includes(normalizedFormat)) {
    throw new Error('Unsupported resume format.');
  }

  const file = RESUME_FILES[normalizedFormat];
  const source = 'api-file';
  const downloadUrl = `/api/resume/download/${normalizedFormat}`;
  triggerDownloadFromUrl(downloadUrl, file.filename);

  try {
    await trackResumeDownloadEvent({
      format: normalizedFormat,
      placement,
      source,
    });
  } catch {
    // Non-blocking analytics call.
  }

  return { format: normalizedFormat, source };
}
