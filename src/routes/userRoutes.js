import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Route for user registration
router.post('/users/register', registerUser);
// Login route
router.post('/users/login', loginUser);

export default router;
