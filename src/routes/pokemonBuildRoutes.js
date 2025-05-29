import express from 'express';
import authenticate from '../middleware/authenticate.js';
import {
  createPokemonBuild,
  getAllPokemonBuilds,
  getSinglePokemonBuild,
  updatePokemonBuild,
  deletePokemonBuild,
} from '../controllers/pokemonBuildController.js';

const router = express.Router();

// authentication on all build routes
router.use(authenticate);

// Routes
router.route('/builds')
  .post(createPokemonBuild)
  .get(getAllPokemonBuilds);

router.route('/builds/:id')
  .get(getSinglePokemonBuild)
  .put(updatePokemonBuild)
  .delete(deletePokemonBuild);

export default router;
