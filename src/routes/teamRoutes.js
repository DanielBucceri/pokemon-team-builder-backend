import express from 'express';
import {
  createTeam,
  getAllTeams,
  getAvailableBuildsForTeam,
  addPokemonToTeam,
  removePokemonFromTeam,
  updateTeam,
  deleteTeam,
  getTeamById,
} from '../controllers/teamController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Team routes
router.route('/teams')
  .get(getAllTeams)
  .post(createTeam);

router.route('/teams/:id')
  .put(updateTeam)
  .delete(deleteTeam);

// Only show the avlaialbe builds to front end to select from when adding to a team
router.route('/teams/:id/available-builds')
  .get(getAvailableBuildsForTeam);

// Add/remove build from a team
router.route('/teams/:id/pokemon/:buildId')
  .post(addPokemonToTeam)
  .delete(removePokemonFromTeam);

// Get specific team
router.route('/teams/:id')
  .get(getTeamById);

export default router;
