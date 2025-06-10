import express from 'express';
import { registerUser, loginUser, deleteUser } from '../controllers/userController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Route for user registration
router.post('/users/register', registerUser);
// Login route
router.post('/users/login', loginUser);
// Delete user and all associated data
router.delete('/users/:id', authenticate, deleteUser);

export default router;
