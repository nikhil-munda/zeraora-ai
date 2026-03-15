import { Request, Response } from 'express';
import { generateGroundedAnswer } from '../services/groqChatService';
import { retrieveContextWithPython } from '../services/pythonBridgeService';

function uniqueSources(matches: Awaited<ReturnType<typeof retrieveContextWithPython>>) {
  const seen = new Set<string>();
  return matches
    .filter((match) => {
      const key = `${match.source_id}:${match.file_name}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .map((match) => ({
      sourceId: match.source_id,
      fileName: match.file_name,
      score: Number(match.score.toFixed(3)),
    }));
}

export async function askQuestion(req: Request, res: Response): Promise<void> {
  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

    if (!req.user?.sub) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!message) {
      res.status(400).json({ success: false, message: 'Message is required' });
      return;
    }

    const matches = await retrieveContextWithPython({
      query: message,
      userId: req.user.sub,
      limit: 5,
    });

    if (matches.length === 0) {
      res.status(200).json({
        success: true,
        answer: 'I could not find any indexed content in your knowledge base for that question yet. Upload a PDF and wait for indexing to complete.',
        sources: [],
      });
      return;
    }

    const completion = await generateGroundedAnswer({
      message,
      contextMatches: matches,
    });

    res.status(200).json({
      success: true,
      answer: completion.answer,
      sources: uniqueSources(matches),
    });
  } catch (error) {
    console.error('Error answering chat request:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to answer question',
    });
  }
}