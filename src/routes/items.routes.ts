import { Router } from 'express';
import { getItems } from '../controllers/items.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getItems);

export { router as itemsRoutes };
