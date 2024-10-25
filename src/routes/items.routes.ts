import { Router } from 'express';
import { getItems } from '../controllers/items.controller';

const router = Router();

router.get('/', getItems);

export { router as itemsRoutes };
