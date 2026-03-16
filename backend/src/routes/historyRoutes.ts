import { Router } from 'express';
import { getHistory, getHistoryItem, deleteHistoryItem } from '../controllers/historyController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getHistory);
router.get('/:id', getHistoryItem);
router.delete('/:id', deleteHistoryItem);

export default router;
