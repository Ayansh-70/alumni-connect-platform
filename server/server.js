// 1. Load environment variables FIRST
import 'dotenv/config'; 

// 2. Import DNS
import dns from 'dns';

// 3. Now Node actually knows that NODE_ENV is 'development'!
if (process.env.NODE_ENV === 'development') {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { validateEnv } from './src/config/envValidator.js';

dotenv.config();

// Validate critical environment variables before starting
validateEnv();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
