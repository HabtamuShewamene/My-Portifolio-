import { Router } from 'express';
import {
  getAnalyticsDashboard,
  getAnalyticsDevices,
  getAnalyticsLocations,
  getAnalyticsProjects,
  getAnalyticsSections,
  getAnalyticsVisitors,
  streamAnalytics,
  trackAnalytics,
  trackAnalyticsLocation,
} from '../controllers/analyticsController.js';
import { analyticsLimiter, locationLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/track', analyticsLimiter, trackAnalytics);
router.post('/location', locationLimiter, trackAnalyticsLocation);
router.get('/stream', streamAnalytics);
router.get('/visitors', getAnalyticsVisitors);
router.get('/locations', getAnalyticsLocations);
router.get('/sections', getAnalyticsSections);
router.get('/projects', getAnalyticsProjects);
router.get('/devices', getAnalyticsDevices);
router.get('/dashboard', getAnalyticsDashboard);

export default router;
