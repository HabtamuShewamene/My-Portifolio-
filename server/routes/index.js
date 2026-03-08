import { Router } from 'express';
import projectRoutes from './projectRoutes.js';
import contactRoutes from './contactRoutes.js';
import chatRoutes from './chatRoutes.js';
import statsRoutes from './statsRoutes.js';
import visitorRoutes from './visitorRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

router.use('/projects', projectRoutes);
router.use('/contact', contactRoutes);
router.use('/chat', chatRoutes);
router.use('/stats', statsRoutes);
router.use('/visitor', visitorRoutes);
router.use('/resume', resumeRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
