import { Router } from 'express';
import { getVisitor } from '../controllers/visitorController.js';

const router = Router();

router.get('/', getVisitor);

export default router;
