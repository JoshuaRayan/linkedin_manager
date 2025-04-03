import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import campaignRoutes from './routes/campaignRoutes';
import messageRoutes from './routes/messageRoutes';
// import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: 'https://nodejs-frontend-alpha.vercel.app/',  // Allow frontend access
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/campaigns', campaignRoutes);
app.use('/api/personalized-message', messageRoutes);
console.log('API routes initialized');

// app.use(errorHandler);

export default app;
