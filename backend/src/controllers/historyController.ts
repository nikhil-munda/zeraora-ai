import { Request, Response } from 'express';
import History from '../models/History';

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const history = await History.find({ userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

export const getHistoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const historyItem = await History.findOne({ _id: id, userId });
    
    if (!historyItem) {
      res.status(404).json({ message: 'History item not found' });
      return;
    }

    res.json(historyItem);
  } catch (error) {
    console.error('Error fetching history item:', error);
    res.status(500).json({ message: 'Failed to fetch history item' });
  }
};

export const deleteHistoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const deletedItem = await History.findOneAndDelete({ _id: id, userId });

    if (!deletedItem) {
      res.status(404).json({ message: 'History item not found or unauthorized' });
      return;
    }

    res.json({ message: 'History item deleted successfully' });
  } catch (error) {
    console.error('Error deleting history item:', error);
    res.status(500).json({ message: 'Failed to delete history item' });
  }
};
