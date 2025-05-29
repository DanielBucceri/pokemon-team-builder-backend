import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Route for user registration
router.post('/users/register', userController.registerUser);
// Login route
router.post('/users/login', userController.loginUser);

export default router;
