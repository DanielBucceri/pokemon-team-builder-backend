import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  generation: {
    type: Number,
    required: [true, "Generation is required"],
    min: [1, "Generation must be between 1 and 9"],
    max: [9, "Generation must be between 1 and 9"],
    immutable: true,
  },    
  pokemonBuilds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PokemonBuild",
      required: true,
    },
  ],
  name: {
    type: String,
    required: [true, "Team name is required"],
    trim: true,
    unique: true,
  }
});



export default mongoose.model("Team", TeamSchema);
