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
    if (error.name === 'ValidationError') { // validation error
return res.status(400).json({ message: 'Invalid input.' });
    }
    res.status(500).json({ message: 'Server error during registration.'});
  }
};
