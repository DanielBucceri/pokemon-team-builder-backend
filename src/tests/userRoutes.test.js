import request from 'supertest';
import { app } from '../server.js';
import mongoose from 'mongoose';

// Mock the database connection
beforeAll(async () => {
  // If there's no connection, create a mock one
  if (mongoose.connection.readyState === 0) {
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    await mongoose.connect(MONGO_URI);
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Routes', () => {
  describe('POST /users/login', () => {
    it('should return 401 when user does not exist', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          username: 'nonexistentuser',
          password: 'fakepassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid username or password.');
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          username: 'testuser'
          // no password
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username and password are required.');
    });

    it('should return 400 when sending empty body', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username and password are required.');
    });
  });
});
