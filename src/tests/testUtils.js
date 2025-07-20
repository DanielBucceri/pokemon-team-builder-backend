import mongoose from 'mongoose';
import { seedDatabase, cleanupDatabase } from './seed.js';

// Connect to MongoDB if not already connected
export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(MONGO_URI);
    console.log('Test database connected');
  }
};

// Disconnect from MongoDB
export const disconnectFromDatabase = async () => {
  await mongoose.connection.close();
  console.log('Test database disconnected');
};

// Setup test database with seed data
export const setupTestDatabase = async () => {
  await connectToDatabase();
  await seedDatabase();
};

// Cleanup test database and disconnect
export const teardownTestDatabase = async () => {
  await cleanupDatabase();
  await disconnectFromDatabase();
};

// Call these in the test files to connect and disconnect from the database
export const setupDatabase = async () => {
  await connectToDatabase();
};

export const dropDatabase = async () => {
  await disconnectFromDatabase();
};

// For tests that need seeded data we can use these
export const setupDatabaseWithSeed = async () => {
  await connectToDatabase();
  await seedDatabase();
};

export const dropDatabaseWithCleanup = async () => {
  await cleanupDatabase();
  await disconnectFromDatabase();
};
