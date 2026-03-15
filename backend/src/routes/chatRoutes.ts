import { Router } from 'express';
import { askQuestion } from '../controllers/chatController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.post('/', askQuestion);

export default router;