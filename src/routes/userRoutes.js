import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';

// Route for user registration
router.post('/users/register', userController.registerUser);
// Login route
router.post('/users/login', userController.loginUser);

export default router;
