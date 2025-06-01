/* eslint-disable no-restricted-syntax */
import PokemonBuild from '../src/models/PokemonBuild.js';

function validateTeamSize(pokemonBuilds) {
  return Array.isArray(pokemonBuilds) && pokemonBuilds.length > 6;
}

async function validateBuildsOwnership(pokemonBuilds, userId) {
  if (!Array.isArray(pokemonBuilds) || pokemonBuilds.length === 0) return true;
  for (const buildId of pokemonBuilds) {
    const build = await PokemonBuild.findOne({ _id: buildId, user: userId });
    if (!build) return false;
  }
  return true;
}

export { validateTeamSize, validateBuildsOwnership };
