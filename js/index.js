import { initGame } from './game.js';
import { loadRanking } from './ranking.js';
import { initRegister } from './register.js';
import { clearUserId, getUserId } from './storage.js';
import { showGameView, showRegisterView } from './ui.js';

const bootstrap = async () => {
  const userId = getUserId();

  initRegister(async () => {
    try {
      await loadRanking();
    } catch (error) {
      console.error(error);
    }
  });

  initGame(getUserId);

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearUserId();
    window.location.reload();
  });

  if (userId) {
    showGameView();
    try {
      await loadRanking();
    } catch (error) {
      console.error(error);
    }
  } else {
    showRegisterView();
  }
};

bootstrap();
