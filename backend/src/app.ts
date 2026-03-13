import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app: Application = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err: Error & { statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[Error] ${statusCode} — ${message}`);
  res.status(statusCode).json({ message });
});

export default app;
