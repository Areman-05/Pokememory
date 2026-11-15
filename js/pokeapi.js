import { POKE_MAX_ID, POKEAPI_SPRITE } from './constants.js';

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const uniqueIds = (count) => {
  const ids = new Set();
  while (ids.size < count) {
    ids.add(randomInt(1, POKE_MAX_ID));
  }
  return [...ids];
};

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const getSpriteUrl = (pokemonId) => `${POKEAPI_SPRITE}/${pokemonId}.png`;

/**
 * Devuelve un array de cartas (pares) ya barajadas.
 * cardsNumber = número total de cartas en el tablero (par).
 */
export const buildDeck = (cardsNumber) => {
  const pairs = cardsNumber / 2;
  const pokemonIds = uniqueIds(pairs);
  const deck = pokemonIds.flatMap((id) => [
    { id, image: getSpriteUrl(id) },
    { id, image: getSpriteUrl(id) },
  ]);
  return shuffle(deck);
};
