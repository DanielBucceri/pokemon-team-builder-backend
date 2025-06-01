import request from 'supertest';
import { app } from '../server.js';
import { setupDatabase, dropDatabase } from './testUtils.js';

// Setup and drop database utils
beforeAll(setupDatabase);
afterAll(dropDatabase);

describe('POST /users/login', () => {
  it('should return 401 when user does not exist', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        username: 'nonexistentuser',
        password: 'fakepassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid username or password.');
  });

  it('should return 400 when password is missing', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        username: 'testuser',
        // no password
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username or Password missing.');
  });

  it('should return 400 when sending empty body', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username or Password missing.');
  });
});
