import { MATCH_FLIP_DELAY_MS } from './constants.js';
import { buildDeck } from './pokeapi.js';
import { saveGameScore } from './ranking.js';
import { createTimer } from './timer.js';
import { showModal } from './ui.js';

const isValidCardsNumber = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 && number % 2 === 0;
};

export const initGame = (getUserId) => {
  const form = document.getElementById('game-form');
  const cardsInput = document.getElementById('cards-number');
  const playBtn = document.getElementById('play-btn');
  const board = document.getElementById('game-board');
  const timerElement = document.getElementById('timer');
  const timer = createTimer(timerElement);

  let locked = false;
  let firstCard = null;
  let matchedPairs = 0;
  let totalPairs = 0;
  let currentCards = 0;
  let gameActive = false;

  const clearBoard = () => {
    board.innerHTML = '';
    firstCard = null;
    locked = false;
    matchedPairs = 0;
  };

  const finishGame = async () => {
    timer.stop();
    gameActive = false;
    const userId = getUserId();
    if (!userId) {
      return;
    }
    try {
      await saveGameScore(userId, timer.getSeconds(), currentCards);
    } catch (error) {
      console.error(error);
      showModal('No se ha podido guardar la puntuación.');
    }
  };

  const onCardClick = (event) => {
    const card = event.currentTarget;
    if (!gameActive || locked || card.classList.contains('flipped') || card.classList.contains('matched')) {
      return;
    }

    card.classList.add('flipped');
    card.style.backgroundImage = `url("${card.dataset.image}")`;

    if (!firstCard) {
      firstCard = card;
      return;
    }

    locked = true;
    const secondCard = card;

    if (firstCard.dataset.id === secondCard.dataset.id) {
      firstCard.classList.add('matched');
      secondCard.classList.add('matched');
      matchedPairs += 1;
      firstCard = null;
      locked = false;

      if (matchedPairs === totalPairs) {
        finishGame();
      }
      return;
    }

    window.setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard.style.backgroundImage = '';
      secondCard.style.backgroundImage = '';
      firstCard = null;
      locked = false;
    }, MATCH_FLIP_DELAY_MS);
  };

  const startGame = (cardsNumber) => {
    clearBoard();
    currentCards = cardsNumber;
    totalPairs = cardsNumber / 2;
    matchedPairs = 0;
    gameActive = true;
    playBtn.textContent = 'Volver a jugar';

    const deck = buildDeck(cardsNumber);
    deck.forEach((pokemon) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.id = String(pokemon.id);
      card.dataset.image = pokemon.image;
      card.addEventListener('click', onCardClick);
      board.appendChild(card);
    });

    timer.start();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = cardsInput.value;

    if (!isValidCardsNumber(value)) {
      showModal('El número de cartas debe ser un entero positivo y par.');
      return;
    }

    if (gameActive) {
      timer.stop();
    }

    startGame(Number(value));
  });
};
