import { Router } from 'express';
import {
  getAnalyticsDashboard,
  getAnalyticsDevices,
  getAnalyticsLocations,
  getAnalyticsProjects,
  getAnalyticsSections,
  getAnalyticsVisitors,
  trackAnalytics,
} from '../controllers/analyticsController.js';
import { analyticsLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/track', analyticsLimiter, trackAnalytics);
router.get('/visitors', getAnalyticsVisitors);
router.get('/locations', getAnalyticsLocations);
router.get('/sections', getAnalyticsSections);
router.get('/projects', getAnalyticsProjects);
router.get('/devices', getAnalyticsDevices);
router.get('/dashboard', getAnalyticsDashboard);

export default router;
