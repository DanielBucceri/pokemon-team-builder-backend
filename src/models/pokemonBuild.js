import mongoose from 'mongoose';

const PokemonBuildSchema = new mongoose.Schema({
  // Reference to the User who owns this build
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // The generation (version) of the Pokemon (1 - 9)
  generation: {
    type: Number,
    required: [true, 'Generation is required'],
    min: [1, 'Generation must be between 1 and 9'],
    max: [9, 'Generation must be between 1 and 9'],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PokemonBuild', PokemonBuildSchema);
