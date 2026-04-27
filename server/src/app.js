import cors from 'cors';
import express from 'express';
import alumniProfileRoutes from './routes/alumniProfileRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import instituteAdminAlumniProfileRoutes from './routes/instituteAdminAlumniProfileRoutes.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import instituteAdminUserRoutes from './routes/instituteAdminUserRoutes.js';
import instituteRoutes from './routes/instituteRoutes.js';
import studentProfileRoutes from './routes/studentProfileRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/institutes', instituteRoutes);
app.use('/api/institute-admin/users', instituteAdminUserRoutes);
app.use('/api/student', studentProfileRoutes);
app.use('/api/alumni', alumniProfileRoutes);
app.use('/api/institute-admin/alumni-profiles', instituteAdminAlumniProfileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
