import request from 'supertest';
import { app } from '../server.js';
import { setupDatabase, dropDatabase } from './testUtils.js';
import { generateAuthToken } from './seed.js';

// Setup and drop database - utils
beforeAll(setupDatabase);
afterAll(dropDatabase);

// Test authentication requirements
describe('Authentication', () => {
  it('should return 401 when no token is provided', async () => {
    const response = await request(app)
      .get('/builds');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access denied. No token provided.');
  });

  it('should return 401 when invalid token format is provided', async () => {
    const response = await request(app)
      .get('/builds')
      .set('Authorization', 'InvalidFormat');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Access denied. No token provided.');
  });

  it('should return 401 when invalid token is provided', async () => {
    const response = await request(app)
      .get('/builds')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid token.');
  });
});

// Test with valid authentication
describe('CRUD Operations', () => {
  let validToken;
  let testBuildId;

  beforeAll(() => {
    // Create a valid token for testing
    validToken = generateAuthToken('6489a9c1e80e5737d8722106');
  });

  it('should create a new Pokemon build when authenticated', async () => {
    const newBuild = {
      nickname: 'Test Build',
      species: 'Pikachu',
      moves: ['Thunderbolt', 'Quick Attack', 'Iron Tail', 'Volt Tackle'],
      nature: 'Timid',
      ability: 'Static',
      item: 'Light Ball',
      stats: {
        hp: 45,
        attack: 80,
        defense: 50,
        specialAttack: 75,
        specialDefense: 60,
        speed: 120,
      },
    };

    const response = await request(app)
      .post('/builds')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBuild);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.nickname).toBe('Test Build');
    expect(response.body.data.species).toBe('Pikachu');
    // To be used in alter tests
    testBuildId = response.body.data._id;
  });

  it('should return all Pokemon builds when authenticated', async () => {
    const response = await request(app)
      .get('/builds')
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get a single Pokemon build by ID when authenticated', async () => {
    const response = await request(app)
      .get(`/builds/${testBuildId}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id', testBuildId);
    expect(response.body.data.nickname).toBe('Test Build');
    expect(response.body.data.species).toBe('Pikachu');
  });

  it('should return 404 when build does not exist', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011';

    const response = await request(app)
      .get(`/builds/${nonExistentId}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Build not found');
  });

  it('should return 404 when build belongs to another user', async () => {
    const differentUserToken = generateAuthToken('6489a9c1e80e5737d8722107');
    
    const response = await request(app)
      .get(`/builds/${testBuildId}`)
      .set('Authorization', `Bearer ${differentUserToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Build not found');
  });

  it('should update a Pokemon build when authenticated', async () => {
    expect(testBuildId).toBeDefined();

    const updatedBuild = {
      nickname: 'Updated Test Build',
    };

    const response = await request(app)
      .put(`/builds/${testBuildId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(updatedBuild);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.nickname).toBe('Updated Test Build');
    expect(response.body.data.species).toBe('Pikachu');
  });

  it('should return 404 when trying to update a non-existent build', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011';

    const updatedBuild = {
      nickname: 'This Will Fail',
    };

    const response = await request(app)
      .put(`/builds/${nonExistentId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(updatedBuild);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Build not found or unauthorized');
  });

  it('should return 404 when trying to update a build belonging to another user', async () => {
    expect(testBuildId).toBeDefined();
    
    const differentUserToken = generateAuthToken('6489a9c1e80e5737d8722107');

    const updatedBuild = {
      nickname: 'This Will Fail',
    };

    const response = await request(app)
      .put(`/builds/${testBuildId}`)
      .set('Authorization', `Bearer ${differentUserToken}`)
      .send(updatedBuild);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Build not found or unauthorized');
  });

  it('should delete a Pokemon build when authenticated', async () => {
    expect(testBuildId).toBeDefined();

    const response = await request(app)
      .delete(`/builds/${testBuildId}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Build deleted successfully');

    // Verify the build no longer exists
    const verifyResponse = await request(app)
      .get(`/builds/${testBuildId}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(verifyResponse.status).toBe(404);
  });

  it('should return 404 when trying to delete a non-existent build', async () => {
    const nonExistentId = '507f1f77bcf86cd799439011';

    const response = await request(app)
      .delete(`/builds/${nonExistentId}`)
      .set('Authorization', `Bearer ${validToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Build not found or unauthorized');
  });
});
