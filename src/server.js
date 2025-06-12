import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import pokemonBuildRoutes from './routes/pokemonBuildRoutes.js';
import teamRoutes from './routes/teamRoutes.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

mongoose.connection.on('error', err => {
  console.error(err);
});

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use(userRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Pokemon Team Builder API',
  });
});

app.use(pokemonBuildRoutes);
app.use(teamRoutes);

// 404 handler for routes that don't exist
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route does not exist'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;

export { app, PORT };
