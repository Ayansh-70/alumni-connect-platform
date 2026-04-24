import cors from 'cors';
import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import healthRoutes from './routes/healthRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/health', healthRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
