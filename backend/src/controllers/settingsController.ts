import { Request, Response } from 'express';
import Settings from '../models/Settings';

export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let settings = await Settings.findOne({ userId });

    if (!settings) {
      // Create default settings if they don't exist
      settings = new Settings({ userId });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { model, temperature, top_k, allowed_sources, show_sources } = req.body;

    const settings = await Settings.findOneAndUpdate(
      { userId },
      { $set: { model, temperature, top_k, allowed_sources, show_sources } },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
};
