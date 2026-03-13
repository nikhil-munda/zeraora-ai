import 'dotenv/config';
import connectDB from './config/db';
import app from './app';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function main(): Promise<void> {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
