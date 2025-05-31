import express from 'express';
import { 
  createTeam,
  getAllTeams,
  getAvailableBuildsForTeam,
  addPokemonToTeam,
  removePokemonFromTeam,
  updateTeam,
  deleteTeam
} from '../controllers/teamController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Protect all routes
router.use(authenticate);

// Team routes
router.route('/')
  .get(getAllTeams)
  .post(createTeam);

router.route('/:id')
  .put(updateTeam)
  .delete(deleteTeam);

// Only show the avlaialbe builds to front end to select from when adding to a team
router.route('/:id/available-builds')
  .get(getAvailableBuildsForTeam);

// Add/remove build from a team
router.route('/:id/pokemon/:buildId')
  .post(addPokemonToTeam)
  .delete(removePokemonFromTeam);

export default router;
