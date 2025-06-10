import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import PokemonBuild from '../models/PokemonBuild.js';
import Team from '../models/Team.js';

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: 'Username or Password missing.' });
    }

    // Create a new user instance
    const user = new User({ username, password });

    // Save the user to the db
    await user.save();

    res.status(201).json({ message: 'User has been registered sucessfully!', username: user.username });
  } catch (error) {
    // Catch validation errors or duplicate username errors

    if (error.code === 11000) { // duplicate username error
      return res.status(400).json({ message: 'Username already exists.' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Invalid input.' });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Login an existing user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: 'Username or Password missing.' });
    }

    // Find user by username and include the passwordHash field which was excluded
    const user = await User.findOne({ username }).select('+passwordHash');

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Check if password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Create the JWT token after success
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Delete a user and all associated builds and teams
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Delete all pokemon builds associated with the user
    const deletedBuilds = await PokemonBuild.deleteMany({ user: userId });
    
    // Delete all teams associated with the user
    const deletedTeams = await Team.deleteMany({ user: userId });
    
    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ 
      message: 'User and all associated data deleted successfully.',
      deletedData: {
        user: user.username,
        builds: deletedBuilds.deletedCount,
        teams: deletedTeams.deletedCount
      }
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error during user deletion.' });
  }
};
