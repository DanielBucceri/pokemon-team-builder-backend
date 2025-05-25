import express from 'express';
const router = express.Router();
import userController from '../controllers/userController.js';

// Route for user registration
router.post('/users/register', userController.registerUser);

export default router;
