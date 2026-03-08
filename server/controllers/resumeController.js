import { store } from '../models/jsonStore.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { access, constants as fsConstants, open } from 'node:fs/promises';
import { createReadStream } from 'node:fs';

const ALLOWED_FORMATS = new Set(['pdf', 'docx', 'txt', 'md']);
const ALLOWED_PLACEMENTS = new Set(['hero', 'about', 'contact', 'unknown']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESUME_ROOT = path.resolve(__dirname, '../../public/resumes');

const RESUME_FILES = {
  pdf: {
    relativePath: 'pdf/habtamu-shewamene-resume.pdf',
    filename: 'habtamu-shewamene-resume.pdf',
    mimeType: 'application/pdf',
  },
  docx: {
    relativePath: 'docx/habtamu-shewamene-resume.docx',
    filename: 'habtamu-shewamene-resume.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  txt: {
    relativePath: 'txt/habtamu-shewamene-resume.txt',
    filename: 'habtamu-shewamene-resume.txt',
    mimeType: 'text/plain; charset=utf-8',
  },
  md: {
    relativePath: 'md/habtamu-shewamene-resume.md',
    filename: 'habtamu-shewamene-resume.md',
    mimeType: 'text/markdown; charset=utf-8',
  },
};

async function assertFileSignature(filePath, format) {
  const handle = await open(filePath, 'r');
  try {
    const header = Buffer.alloc(8);
    const { bytesRead } = await handle.read(header, 0, 8, 0);
    if (bytesRead < 4) {
      throw new Error('File appears to be empty or truncated.');
    }

    if (format === 'pdf') {
      const signature = header.subarray(0, 4).toString('utf8');
      if (signature !== '%PDF') {
        throw new Error('Invalid PDF file signature.');
      }
    }

    if (format === 'docx') {
      const isZipContainer =
        header[0] === 0x50 && header[1] === 0x4b && header[2] === 0x03 && header[3] === 0x04;
      if (!isZipContainer) {
        throw new Error('Invalid DOCX container signature.');
      }
    }
  } finally {
    await handle.close();
  }
}

function normalizeSafe(value) {
  return String(value || '').trim().toLowerCase();
}

export async function trackResumeDownload(req, res, next) {
  try {
    const format = normalizeSafe(req.body?.format);
    const placement = normalizeSafe(req.body?.placement || 'unknown');
    const source = normalizeSafe(req.body?.source || 'unknown');

    if (!ALLOWED_FORMATS.has(format)) {
      return res.status(400).json({ ok: false, message: 'Invalid resume format.' });
    }

    if (!ALLOWED_PLACEMENTS.has(placement)) {
      return res.status(400).json({ ok: false, message: 'Invalid resume placement.' });
    }

    const summary = await store.trackResumeDownload({
      format,
      placement,
      source,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
    });

    return res.status(201).json({ ok: true, data: summary });
  } catch (error) {
    return next(error);
  }
}

export async function getResumeStats(req, res, next) {
  try {
    const stats = await store.getResumeStats();
    return res.json({ ok: true, data: stats });
  } catch (error) {
    return next(error);
  }
}

export async function downloadResumeFile(req, res, next) {
  try {
    const format = normalizeSafe(req.params?.format);
    if (!ALLOWED_FORMATS.has(format)) {
      return res.status(400).json({ ok: false, message: 'Unsupported resume format.' });
    }

    const fileConfig = RESUME_FILES[format];
    const absolutePath = path.resolve(RESUME_ROOT, fileConfig.relativePath);

    if (!absolutePath.startsWith(RESUME_ROOT)) {
      return res.status(400).json({ ok: false, message: 'Invalid file path requested.' });
    }

    try {
      await access(absolutePath, fsConstants.R_OK);
      await assertFileSignature(absolutePath, format);
    } catch (error) {
      if (error?.code === 'ENOENT') {
        return res.status(404).json({
          ok: false,
          message: `Resume file not found for ${format.toUpperCase()}.`,
        });
      }
      return res.status(500).json({
        ok: false,
        message: 'Resume file failed integrity checks. Please upload a fresh file.',
      });
    }

    res.setHeader('Content-Type', fileConfig.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileConfig.filename}"`);

    const stream = createReadStream(absolutePath);
    stream.on('error', (error) => next(error));
    stream.pipe(res);
    return undefined;
  } catch (error) {
    return next(error);
  }
}
