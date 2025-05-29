import mongoose from 'mongoose';

const PokemonBuildSchema = new mongoose.Schema({
  // Reference to the User who owns this build
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  nickname: {
    type: String,
    trim: true,
  },
  // The species name of the Pokemon
  species: {
    type: String,
    required: [true, 'Species is required'],
    trim: true,
  },
  nature: {
    type: String,
    required: false,
    trim: true,
  },
  // held item (optional)
  item: {
    type: String,
    trim: true,
    default: '',
  },
  ability: {
    type: String,
    trim: true,
  },
  // array of moves the Pokemon knows
  moves: {
    type: [String],
    validate: [
      {
        validator(arr) {
          return arr.length <= 4;
        },
        message: 'A build can have at most 4 moves.',
      },
    ],
    required: [true, 'Moves are required'],
  },
  // Base stats for the Pokemon
  stats: {
    hp: { type: Number, default: 0 },
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    specialAttack: { type: Number, default: 0 },
    specialDefense: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PokemonBuild', PokemonBuildSchema);
