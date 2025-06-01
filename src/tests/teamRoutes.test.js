import request from 'supertest';
import { app } from '../server.js';
import { setupDatabase, dropDatabase } from './testUtils.js';
import jwt from 'jsonwebtoken';

beforeAll(setupDatabase);
afterAll(dropDatabase);

describe('Authentication', () => {
    it('should return 401 when no token is provided', async () => {
      const response = await request(app)
        .get('/teams');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should return 401 when invalid token format is provided', async () => {
      const response = await request(app)
        .get('/teams')
        .set('Authorization', 'InvalidFormat');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should return 401 when invalid token is provided', async () => {
      const response = await request(app)
        .get('/teams')
        .set('Authorization', 'Bearer invalidtoken');
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid token.');
    });
});

describe('CRUD Operations', () => {
    let validToken;
    beforeAll(() => {
      validToken = jwt.sign({ id: '6489a9c1e80e5737d8722106' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    it('should get all teams for authenticated user', async () => {
      const response = await request(app)
        .get('/teams')
        .set('Authorization', `Bearer ${validToken}`);
      // The response should be 200 and data should be an array even if empty
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    // Team Creation Tests
    let testTeamId;
    let testBuildId;

    it('should create a new Pokemon build first (for team tests)', async () => {
      const newBuild = {
        nickname: 'Team Test Build',
        species: 'Charizard',
        moves: ['Flamethrower', 'Dragon Claw', 'Air Slash', 'Solar Beam'],
        nature: 'Timid',
        ability: 'Blaze',
        item: 'Charizardite Y',
        stats: {
          hp: 78,
          attack: 84,
          defense: 78,
          specialAttack: 109,
          specialDefense: 85,
          speed: 100
        }
      };

      const response = await request(app)
        .post('/builds')
        .set('Authorization', `Bearer ${validToken}`)
        .send(newBuild);

      expect(response.status).toBe(201);
      //save the build id for later tests
      testBuildId = response.body.data._id;
    });

    it('should create a new team with valid data', async () => {
      const newTeam = {
        name: 'Test Fire Team',
        description: 'A team for testing',
        pokemonBuilds: [testBuildId]
      };

      const response = await request(app)
        .post('/teams')
        .set('Authorization', `Bearer ${validToken}`)
        .send(newTeam);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Fire Team');
      //save the team id for later tests
      testTeamId = response.body.data._id;
    });

    it('should reject team creation with more than 6 Pokemon', async () => {
      // Create an array of 7 identical build IDs
      const excessiveBuilds = Array(7).fill(testBuildId);
      
      const newTeam = {
        name: 'Oversized Team',
        description: 'A team with too many Pokemon',
        pokemonBuilds: excessiveBuilds
      };

      const response = await request(app)
        .post('/teams')
        .set('Authorization', `Bearer ${validToken}`)
        .send(newTeam);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Teams can have a maximum of 6 Pokemon');
    });


//   The API doesn't have a GET single team endpoint as its not needed at this stage

    it('should update a team', async () => {
      const updatedTeam = {
        name: 'Updated Test Team',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/teams/${testTeamId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updatedTeam);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Test Team');
    });

    // Team Member Management
    it('should get builds owned by user but not in the specified team', async () => {
      //ensure previous test build is in the team
      await request(app)
        .post(`/teams/${testTeamId}/pokemon/${testBuildId}`)
        .set('Authorization', `Bearer ${validToken}`);
      
      //create a second build that won't be in the team
      const secondBuild = {
        nickname: 'Not In Team Build',
        species: 'Blastoise',
        moves: ['Hydro Pump', 'Ice Beam', 'Earthquake', 'Flash Cannon'],
        nature: 'Bold',
        ability: 'Torrent',
        item: 'Leftovers',
        stats: {
          hp: 79,
          attack: 83,
          defense: 100,
          specialAttack: 85,
          specialDefense: 105,
          speed: 78
        }
      };

      const buildResponse = await request(app)
        .post('/builds')
        .set('Authorization', `Bearer ${validToken}`)
        .send(secondBuild);
      
      const secondBuildId = buildResponse.body.data._id;

      //check the available builds
      const response = await request(app)
        .get(`/teams/${testTeamId}/available-builds`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      //find the second build in the available builds
      const foundSecondBuild = response.body.data.some(build => build._id === secondBuildId);
      expect(foundSecondBuild).toBe(true);
      
      //make sure the first build is not returned in the available builds since it is already in the team
      const foundFirstBuild = response.body.data.some(build => build._id === testBuildId);
      expect(foundFirstBuild).toBe(false);
    });

    it('should add a Pokemon to a team', async () => {
      // Remove the build if it's already in the team from previous tests
      await request(app)
        .delete(`/teams/${testTeamId}/pokemon/${testBuildId}`)
        .set('Authorization', `Bearer ${validToken}`);

      // Add it back
      const response = await request(app)
        .post(`/teams/${testTeamId}/pokemon/${testBuildId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should remove a Pokemon from a team', async () => {
      const response = await request(app)
        .delete(`/teams/${testTeamId}/pokemon/${testBuildId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should delete a team', async () => {
      const response = await request(app)
        .delete(`/teams/${testTeamId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
    // check if team was removed and doesnt exist anymore
    const deletedTeamResponse = await request(app)
      .get(`/teams/${testTeamId}`)
      .set('Authorization', `Bearer ${validToken}`);
    
    expect(deletedTeamResponse.status).toBe(404);
    expect(deletedTeamResponse.body.success).toBe(false);
    expect(deletedTeamResponse.body.message).toBe('Team not found');
    });
});