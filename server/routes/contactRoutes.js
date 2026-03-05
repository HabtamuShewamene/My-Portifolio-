import { Router } from 'express';
import { submitContact } from '../controllers/contactController.js';
import { validateBody } from '../middleware/validate.js';
import { contactRequestSchema } from '../models/schemas.js';
import { contactLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/', contactLimiter, validateBody(contactRequestSchema), submitContact);

export default router;
