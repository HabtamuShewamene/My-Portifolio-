import { Router } from 'express';
import { postChatMessage } from '../controllers/chatController.js';
import { validateBody } from '../middleware/validate.js';
import { chatRequestSchema } from '../models/schemas.js';
import { chatLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.post('/', chatLimiter, validateBody(chatRequestSchema), postChatMessage);

export default router;
