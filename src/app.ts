import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/routes.js';
import gasStationsRoutes from './modules/gas-stations/routes.js';
import profileRoutes from './modules/profile/routes.js';
import { startGasStationsJob } from './jobs/gas_station_job.js';

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/gas-stations', gasStationsRoutes);
app.use('/profile', profileRoutes);

// Jobs
startGasStationsJob();

// 404 handler
app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});