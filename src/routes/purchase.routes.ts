import { Router } from 'express';
import { handlePurchase } from '../controllers/purchase.controller';

const router = Router();

router.post('/', handlePurchase);

export { router as purchaseRoutes };
