import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AlumniConnect API is healthy',
    data: {
      service: 'server',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
