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
  // array of pokemon types
  pokemonTypes: {
    type: [String],
    validate: [
      {
        validator(arr) {
          return arr.length <= 2;
        },
        message: 'A Pokemon can have at most 2 types.',
      },
    ],
    default: [],
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
  // optional move types corresponding to moves
  moveTypes: {
    type: [String],
    validate: [
      {
        validator(arr) {
          return arr.length <= 4;
        },
        message: 'A build can have at most 4 move types.',
      },
    ],
    default: [],
  },
  // Base stats for the Pokemon
  stats: {
    hp: { type: Number, required: [true, 'hp is required'] },
    attack: { type: Number, required: [true, 'attack is required'] },
    defense: { type: Number, required: [true, 'defense is required'] },
    specialAttack: { type: Number, required: [true, 'specialAttack is required'] },
    specialDefense: { type: Number, required: [true, 'specialDefense is required'] },
    speed: { type: Number, required: [true, 'speed is required'] },
  },
  notes: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PokemonBuild', PokemonBuildSchema);
