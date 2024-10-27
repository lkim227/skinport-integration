import { Router } from 'express';
import { handlePurchase } from '../controllers/purchase.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, handlePurchase);

export { router as purchaseRoutes };
