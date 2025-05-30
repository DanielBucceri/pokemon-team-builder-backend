import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/userRoutes.js';
import pokemonBuildRoutes from './routes/pokemonBuildRoutes.js';
import authenticate from './middleware/authenticate.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use(userRoutes);
app.use(pokemonBuildRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Pokemon Team Builder API Root',
  });
});


const PORT = process.env.PORT || 3000;

export { app, PORT };
