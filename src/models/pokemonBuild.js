import mongoose from "mongoose";

const PokemonBuildSchema = new mongoose.Schema({
  // Reference to the User who owns this build
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // The generation version of the Pokemon (1 - 9)
  generation: {
    type: Number,
    required: true,
    min: 1,
    max: 9,
  },
  nickname: {
    type: String,
    trim: true,
  },
  // The species name of the Pokemon
  species: {
    type: String,
    required: true,
    trim: true,
  },
  nature: {
    type: String,
    required: true,
    trim: true,
  },
  // held item (optional)
  item: {
    type: String,
    trim: true,
    default: "",
  },
  // array of moves the Pokemon knows
  moves: {
    type: [String],
    validate: [
      {
        validator: function (arr) {
          return arr.length <= 4;
        },
        message: "A build can have at most 4 moves.",
      },
    ],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("PokemonBuild", PokemonBuildSchema);