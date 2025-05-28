import pokemonBuild from "../models/PokemonBuild.js";

// Create a new Pokemon build
const createPokemonBuild = async (req, res, next) => {
    try {
        
    // add user to the build
    req.body.user = req.user.id; // userid added via authenticate middleware

    // Create/save build
    const build = await pokemonBuild.create(req.body);
    
    //return build  
    res.status(201).json({
      success: true,
      data: build
    });
  } catch (error) {
    next(error);
  }
};

//Get all builds for current user
const getAllPokemonBuilds = async (req, res, next) => {
    try {
        const builds = await pokemonBuild.find({ user: req.user.id });
        
        res.status(200).json({
            success: true,
            data: builds
        });
    } catch (error) {
        next(error);
    }
};

// Get single build for current user
const getSinglePokemonBuild = async (req, res, next) => {
    try {
        const build = await pokemonBuild.findById({_id: req.params.id, user: req.user.id}).populate("user");
        
        if (!build) {
            return res.status(404).json({
                success: false,
                message: "Build not found"
            });
        }
        res.status(200).json({
            success: true,
            data: build
        });
    } catch (error) {
        next(error);
    }
};


    


export {
    createPokemonBuild,
    getAllPokemonBuilds,
    getSinglePokemonBuild
};
