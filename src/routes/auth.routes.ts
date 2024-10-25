import { Router } from 'express';
import { handleChangePassword, login } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.put('password', handleChangePassword);

export { router as authRoutes };