import { Router } from 'express';
import { getItems } from '../controllers/items.controller';
// import { authenticate } from '../middleware/auth.middleware';    // prod version

const router = Router();

router.get('/', getItems);                          // dev version
// router.get('/', authenticate, getItems);         // product version

export { router as itemsRoutes };
