import PokemonBuild from '../models/PokemonBuild.js';

// Create a new Pokemon build
const createPokemonBuild = async (req, res, next) => {
  try {
    // add user to the build
    req.body.user = req.user.id; // userid added via authenticate middleware

    // Create/save build
    const build = await PokemonBuild.create(req.body);

    // return build
    res.status(201).json({
      success: true,
      data: build,
    });
  } catch (error) {
    next(error);
  }
};

// Get all builds for current user
const getAllPokemonBuilds = async (req, res, next) => {
  try {
    const builds = await PokemonBuild.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: builds,
    });
  } catch (error) {
    next(error);
  }
};

// Get single build for current user
const getSinglePokemonBuild = async (req, res, next) => {
  try {
    const build = await PokemonBuild.findOne({ _id: req.params.id, user: req.user.id });

    if (!build) {
      return res.status(404).json({
        success: false,
        message: 'Build not found',
      });
    }
    res.status(200).json({
      success: true,
      data: build,
    });
  } catch (error) {
    next(error);
  }
};
// Update a pokemon build
const updatePokemonBuild = async (req, res, next) => {
  try {
    const build = await PokemonBuild.findOne({ _id: req.params.id, user: req.user.id });

    if (!build) {
      return res.status(404).json({
        success: false,
        message: 'Build not found or unauthorized',
      });
    }

    // Update the build
    const updatedBuild = await PokemonBuild.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    res.status(200).json({
      success: true,
      data: updatedBuild,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a pokemon build
const deletePokemonBuild = async (req, res, next) => {
  try {
    // Find the build and check if it belongs to user
    const build = await PokemonBuild.findOne({ _id: req.params.id, user: req.user.id });

    if (!build) {
      return res.status(404).json({
        success: false,
        message: 'Build not found or unauthorized',
      });
    }

    // Delete the build
    await PokemonBuild.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Build deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export {
  createPokemonBuild,
  getAllPokemonBuilds,
  getSinglePokemonBuild,
  updatePokemonBuild,
  deletePokemonBuild,
};
