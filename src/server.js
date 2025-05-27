import express from 'express';
const app = express();
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

app.use(express.json()); // middleware

// Use user routes
app.use(userRoutes);

app.get("/", (req, res) => {

    res.json({
        message: "Pokemon Team Builder API Root"
    });
});

let PORT = process.env.PORT || 3000; 

//epxort the configured server
export { app, PORT };
