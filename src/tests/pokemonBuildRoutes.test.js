import request from 'supertest';
import { app } from '../server.js';
import { setupDatabase, dropDatabase } from './testUtils.js';
import jwt from 'jsonwebtoken';

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
      validToken = jwt.sign({ id: '6489a9c1e80e5737d8722106' }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
          speed: 120
        }
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
  });
