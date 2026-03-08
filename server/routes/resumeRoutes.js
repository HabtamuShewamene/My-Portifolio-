import { Router } from 'express';
import {
	downloadResumeFile,
	getResumeStats,
	trackResumeDownload,
} from '../controllers/resumeController.js';

const router = Router();

router.get('/download/:format', downloadResumeFile);
router.post('/track', trackResumeDownload);
router.get('/stats', getResumeStats);

export default router;
