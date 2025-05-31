import Team from '../models/Team.js';
import PokemonBuild from '../models/PokemonBuild.js';


const createTeam = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    // Validate team size max 6 per team
    if (req.body.pokemonBuilds && req.body.pokemonBuilds.length > 6) {
      return res.status(400).json({
        success: false,
        error: 'Teams can have a maximum of 6 Pokemon',
      });
    }

   // Check if all builds exist and belong to the user
   if (req.body.pokemonBuilds && req.body.pokemonBuilds.length > 0) {
    for (let buildId of req.body.pokemonBuilds) {
      const build = await PokemonBuild.findOne({ _id: buildId, user: req.user.id });
      if (!build) {
        return res.status(404).json({
          success: false,
          error: 'One or more Pokemon builds do not exist or do not belong to you',
        });
      }
    }
  }

    // Create/save team
    const team = await Team.create(req.body);

    // return team to user
    res.status(201).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};