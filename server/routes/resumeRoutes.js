import { Router } from 'express';
import { getResumeStats, trackResumeDownload } from '../controllers/resumeController.js';

const router = Router();

router.post('/track', trackResumeDownload);
router.get('/stats', getResumeStats);

export default router;
