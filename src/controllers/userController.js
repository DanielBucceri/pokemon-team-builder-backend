import User from '../models/User.js';

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

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
    res.status(500).json({ message: 'Server error during registration.'});
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username and include the passwordHash field which was excluded
    const user = await User.findOne({ username }).select('+passwordHash');
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Check if password correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    res.status(200).json({ 
      message: 'Login successful!',
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
