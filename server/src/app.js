import cors from 'cors';
import express from 'express';
import alumniProfileRoutes from './routes/alumniProfileRoutes.js';
import alumniConnectionRoutes from './routes/alumniConnectionRoutes.js';
import alumniGuidanceRequestRoutes from './routes/alumniGuidanceRequestRoutes.js';
import alumniOpportunityRoutes from './routes/alumniOpportunityRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';
import instituteAdminAlumniProfileRoutes from './routes/instituteAdminAlumniProfileRoutes.js';
import instituteAdminOpportunityRoutes from './routes/instituteAdminOpportunityRoutes.js';
import authRoutes from './routes/authRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import instituteAdminUserRoutes from './routes/instituteAdminUserRoutes.js';
import instituteRoutes from './routes/instituteRoutes.js';
import studentAlumniRoutes from './routes/studentAlumniRoutes.js';
import studentConnectionRoutes from './routes/studentConnectionRoutes.js';
import studentGuidanceRequestRoutes from './routes/studentGuidanceRequestRoutes.js';
import studentOpportunityRoutes from './routes/studentOpportunityRoutes.js';
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
app.use('/api/student/alumni', studentAlumniRoutes);
app.use('/api/student/connections', studentConnectionRoutes);
app.use('/api/student/guidance-requests', studentGuidanceRequestRoutes);
app.use('/api/student/opportunities', studentOpportunityRoutes);
app.use('/api/alumni', alumniProfileRoutes);
app.use('/api/alumni/connections', alumniConnectionRoutes);
app.use('/api/alumni/guidance-requests', alumniGuidanceRequestRoutes);
app.use('/api/alumni/opportunities', alumniOpportunityRoutes);
app.use('/api/institute-admin/alumni-profiles', instituteAdminAlumniProfileRoutes);
app.use('/api/institute-admin/opportunities', instituteAdminOpportunityRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
