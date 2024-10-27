import { Router } from 'express';
import { handleChangePassword, login } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.put('/password', authenticate, handleChangePassword);

export { router as authRoutes };