import express from 'express';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import pokemonBuildRoutes from './routes/pokemonBuildRoutes.js';
import authenticate from './middleware/authenticate.js';

dotenv.config();

const app = express();
app.use(express.json()); // middleware

// routes
app.use(userRoutes);
app.use(pokemonBuildRoutes);

app.get("/", (req, res) => {

    res.json({
        message: "Pokemon Team Builder API Root"
    });
});

let PORT = process.env.PORT || 3000; 

export { app, PORT };
