import mongoose from 'mongoose';
import User from '../models/User.js';
import PokemonBuild from '../models/PokemonBuild.js';
import jwt from 'jsonwebtoken';

// Test user data
export const testUsers = [
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser1',
    password: 'password123',
    passwordHash: '',
  },
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'testuser2',
    password: 'password456',
    passwordHash: '',
  }
];

// Test Pokemon build data
export const testPokemonBuilds = [
  {
    species: 'Pikachu',
    nickname: 'Sparky',
    nature: 'Timid',
    ability: 'Static',
    moves: ['Thunderbolt', 'Quick Attack', 'Iron Tail', 'Volt Switch'],
    stats: {
      hp: 35,
      attack: 55,
      defense: 40,
      specialAttack: 50,
      specialDefense: 50,
      speed: 90
    }
  },
  {
    species: 'Charizard',
    nickname: 'Flame',
    nature: 'Adamant',
    ability: 'Blaze',
    moves: ['Flamethrower', 'Dragon Claw', 'Earthquake', 'Air Slash'],
    stats: {
      hp: 78,
      attack: 84,
      defense: 78,
      specialAttack: 109,
      specialDefense: 85,
      speed: 100
    }
  }
];

// Seed the database with the test data
export const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await PokemonBuild.deleteMany({});

    // Create users
    for (const user of testUsers) {
      await User.create({
        _id: user._id,
        username: user.username,
        password: user.password
      });
    }

    // Create Pokemon builds for first user
    for (const build of testPokemonBuilds) {
      await PokemonBuild.create({
        ...build,
        user: testUsers[0]._id
      });
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Generate a valid JWT token for a test user
export const generateAuthToken = (userId = testUsers[0]._id) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Clean up test data
export const cleanupDatabase = async () => {
  try {
    await User.deleteMany({});
    await PokemonBuild.deleteMany({});
    console.log('Database cleanup completed');
  } catch (error) {
    console.error('Error cleaning up database:', error);
  }
};
