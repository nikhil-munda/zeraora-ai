import { Request, Response } from 'express';
import Source from '../models/Source';
import {
  ingestGithubWithPython,
  ingestPdfWithPython,
  ingestWebsiteWithPython,
  ingestYoutubeWithPython,
} from '../services/pythonBridgeService';

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

export const ingestWebsite = async (req: Request, res: Response) => {
  try {
    const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';

    if (!url) {
      return res.status(400).json({ success: false, message: 'Website URL is required' });
    }

    if (!req.user || !req.user.sub) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let normalizedUrl: URL;
    try {
      normalizedUrl = new URL(url);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid website URL' });
    }

    const sourceName = normalizedUrl.toString();
    const newSource = new Source({
      name: sourceName,
      type: 'website',
      status: 'processing',
      userId: req.user.sub,
    });

    await newSource.save();

    try {
      const ingestionResult = await ingestWebsiteWithPython({
        url: sourceName,
        fileName: sourceName,
        sourceId: newSource._id.toString(),
        userId: req.user.sub,
      });

      newSource.status = 'indexed';
      await newSource.save();

      res.status(201).json({
        success: true,
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
    console.error('Error ingesting website:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error',
    });
  }
};

export const ingestGithub = async (req: Request, res: Response) => {
  try {
    const repoUrl = typeof req.body?.repoUrl === 'string' ? req.body.repoUrl.trim() : '';

    if (!repoUrl) {
      return res.status(400).json({ success: false, message: 'GitHub repository URL is required' });
    }

    if (!req.user || !req.user.sub) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let normalizedUrl: URL;
    try {
      normalizedUrl = new URL(repoUrl);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid repository URL' });
    }

    if (!normalizedUrl.hostname.includes('github.com')) {
      return res.status(400).json({ success: false, message: 'Only github.com repositories are supported' });
    }

    const sourceName = normalizedUrl.toString();
    const newSource = new Source({
      name: sourceName,
      type: 'github',
      status: 'processing',
      userId: req.user.sub,
    });

    await newSource.save();

    try {
      const ingestionResult = await ingestGithubWithPython({
        repoUrl: sourceName,
        sourceId: newSource._id.toString(),
        userId: req.user.sub,
      });

      newSource.status = 'indexed';
      await newSource.save();

      res.status(201).json({
        success: true,
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
    console.error('Error ingesting GitHub repository:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error',
    });
  }
};

export const ingestYoutube = async (req: Request, res: Response) => {
  try {
    const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';

    if (!url) {
      return res.status(400).json({ success: false, message: 'YouTube URL is required' });
    }

    if (!req.user || !req.user.sub) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let normalizedUrl: URL;
    try {
      normalizedUrl = new URL(url);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid YouTube URL' });
    }

    const host = normalizedUrl.hostname.toLowerCase();
    const isYoutubeHost = host.includes('youtube.com') || host === 'youtu.be';
    if (!isYoutubeHost) {
      return res.status(400).json({ success: false, message: 'Only YouTube URLs are supported' });
    }

    const sourceName = normalizedUrl.toString();
    const newSource = new Source({
      name: sourceName,
      type: 'youtube',
      status: 'processing',
      userId: req.user.sub,
    });

    await newSource.save();

    try {
      const ingestionResult = await ingestYoutubeWithPython({
        url: sourceName,
        sourceId: newSource._id.toString(),
        userId: req.user.sub,
      });

      newSource.status = 'indexed';
      await newSource.save();

      res.status(201).json({
        success: true,
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
    console.error('Error ingesting YouTube video:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Server error',
    });
  }
};
