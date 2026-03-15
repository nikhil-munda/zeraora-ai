import { Request, Response } from 'express';
import Source from '../models/Source';
import { ingestPdfWithPython } from '../services/pythonBridgeService';

export const uploadPdf = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!req.user || !req.user.sub) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const newSource = new Source({
      name: file.originalname,
      type: 'pdf',
      status: 'processing',
      userId: req.user.sub,
    });

    await newSource.save();

    try {
      const ingestionResult = await ingestPdfWithPython({
        filePath: file.path,
        fileName: file.originalname,
        sourceId: newSource._id.toString(),
        userId: req.user.sub,
      });

      newSource.status = 'indexed';
      await newSource.save();

      res.status(201).json({
        success: true,
        filename: file.originalname,
        source: newSource,
        ingestion: ingestionResult,
      });
      return;
    } catch (error) {
      newSource.status = 'failed';
      await newSource.save();
      throw error;
    }
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error',
    });
  }
};

export const getSources = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const sources = await Source.find({ userId: req.user.sub }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, sources });
  } catch (error) {
    console.error('Error fetching sources:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
