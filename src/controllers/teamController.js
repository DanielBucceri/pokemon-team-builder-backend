import Team from '../models/Team.js';
import PokemonBuild from '../models/PokemonBuild.js';
import { validateTeamSize, validateBuildsOwnership } from '../../utils/utils.js';

const createTeam = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    // Validate team size max 6 per team
    if (validateTeamSize(req.body.pokemonBuilds)) {
      return res.status(400).json({
        success: false,
        error: 'Teams can have a maximum of 6 Pokemon',
      });
    }

    // Check if all builds exist and belong to the user
    if (!(await validateBuildsOwnership(req.body.pokemonBuilds, req.user.id))) {
      return res.status(404).json({
        success: false,
        error: 'One or more Pokemon builds do not exist or do not belong to user',
      });
    }

    // Create/save and return team
    const team = await Team.create(req.body);
    const populatedTeam = await Team.findById(team._id)
      .populate('pokemonBuilds', 'species nickname stats');
    res.status(201).json({
      success: true,
      data: populatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

// get all teams to populate front end
const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find({ user: req.user.id })
      .populate('pokemonBuilds', 'species nickname stats');

    res.status(200).json({
      success: true,
      data: teams,
    });
  } catch (error) {
    next(error);
  }
};

// Endpoint to display only builds that arent already in the team when selecting pokeon to add
const getAvailableBuildsForTeam = async (req, res, next) => {
  try {
    // Get the team
    const team = await Team.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    // Match all builds belonging to the user that arent already in the team
    const availableBuilds = await PokemonBuild.find({
      user: req.user.id,
      _id: { $nin: team.pokemonBuilds },
    });

    res.status(200).json({
      success: true,
      data: availableBuilds,
    });
  } catch (error) {
    next(error);
  }
};

// Add a Pokemon build to a team
const addPokemonToTeam = async (req, res, next) => {
  try {
    // Find the team and check ownership
    const team = await Team.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found or does not belong to the user',
      });
    }

    // Validate if team already has 6 Pokemon
    if (team.pokemonBuilds.length >= 6) {
      return res.status(400).json({
        success: false,
        error: 'Teams can have a maximum of 6 Pokemon',
      });
    }

    // Get the build ID from params
    const { buildId } = req.params;

    // Check if the build already exists in the team
    if (team.pokemonBuilds.includes(buildId)) {
      return res.status(400).json({
        success: false,
        error: 'This Pokemon build is already in the team',
      });
    }

    // Add the build to the team using $push and return the populated document
    const updatedTeam = await Team.findByIdAndUpdate(
      team._id,
      { $push: { pokemonBuilds: buildId } },
      { new: true },
    ).populate('pokemonBuilds', 'species nickname stats');

    res.status(200).json({
      success: true,
      data: updatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

const removePokemonFromTeam = async (req, res, next) => {
  try {
    // Find the team and check ownership
    const team = await Team.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    const { buildId } = req.params;

    // Remove the build from the team using $pull and return the populated document
    const updatedTeam = await Team.findByIdAndUpdate(
      team._id,
      { $pull: { pokemonBuilds: buildId } },
      { new: true },
    ).populate('pokemonBuilds', 'species nickname stats');

    res.status(200).json({
      success: true,
      data: updatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

const updateTeam = async (req, res, next) => {
  try {
    // Validate team size max 6 per team if adding pokemonBuilds
    if (validateTeamSize(req.body.pokemonBuilds)) {
      return res.status(400).json({
        success: false,
        error: 'Teams can have a maximum of 6 Pokemon',
      });
    }

    // Check if all builds exist and belong to the user
    if (!(await validateBuildsOwnership(req.body.pokemonBuilds, req.user.id))) {
      return res.status(404).json({
        success: false,
        error: 'One or more Pokemon builds do not exist or do not belong to the user',
      });
    }

    const team = await Team.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true },
    ).populate('pokemonBuilds', 'species nickname stats');

    res.status(200).json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    const team = await Team.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: `Team ${team.name} deleted successfully`,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findOne({ _id: req.params.id, user: req.user.id })
      .populate('pokemonBuilds', 'species nickname stats');
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }
    res.status(200).json({ success: true, data: team });
  } catch (error) {
    next(error);
  }
};

export {
  createTeam,
  getAllTeams,
  getAvailableBuildsForTeam,
  addPokemonToTeam,
  removePokemonFromTeam,
  updateTeam,
  deleteTeam,
  getTeamById,
};
