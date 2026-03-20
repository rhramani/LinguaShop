import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import translateRoutes from './routes/translate.js';
import settingsRoutes from './routes/settings.js';
import usageRoutes from './routes/usage.js';
import scripttagRoutes from './routes/scripttag.js';
import billingRoutes from './routes/billing.js';
import webhooksRoutes from './routes/webhooks.js';
import { sessionAuth } from './middleware/sessionAuth.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import { usageResetJob } from './jobs/usageReset.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: process.env.APP_URL,
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    rateLimitMiddleware(req, res, next);
  } else {
    next();
  }
});

app.use('/auth', authRoutes);
app.use('/api/translate', sessionAuth, translateRoutes);
app.use('/api/settings', sessionAuth, settingsRoutes);
app.use('/api/usage', sessionAuth, usageRoutes);
app.use('/api/widget', sessionAuth, scripttagRoutes);
app.use('/api/billing', sessionAuth, billingRoutes);
app.use('/webhooks', webhooksRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), demo: process.env.DEMO_MODE === 'true' });
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/widget', express.static(path.join(__dirname, '../widget/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.code === 'LIMIT_EXCEEDED') {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
    });
  }
  
  if (err.message?.includes('500000')) {
    return res.status(402).json({
      error: 'Usage limit exceeded',
      message: 'Monthly translation limit reached. Please upgrade your plan.',
    });
  }
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const connectDB = async () => {
  const demoMode = process.env.DEMO_MODE === 'true';
  
  if (demoMode) {
    console.log('Running in DEMO MODE - using mock data');
    return;
  }
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
};

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  
  usageResetJob.start();
  
  server.listen(PORT, () => {
    console.log(`LinguaShop server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      process.exit(0);
    });
  });
});

export default app;
