import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true, // teams cannot change ownership at this stage
  },
  pokemonBuilds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PokemonBuild',
      required: true,
    },
  ],
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    unique: true,
  },
});

export default mongoose.model('Team', TeamSchema);
