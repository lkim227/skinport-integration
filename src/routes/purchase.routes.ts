import { Router } from 'express';
import { handlePurchase } from '../controllers/purchase.controller';
import { authenticate } from '../middleware/auth.middleware';       // prod version

const router = Router();

// router.post('/', authenticate, handlePurchase);              // prod version
router.post('/', handlePurchase);                               // dev version

export { router as purchaseRoutes };
