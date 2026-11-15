import { registerOrUpdateUser } from './firebase.js';
import { setUserId } from './storage.js';
import { showGameView, showModal } from './ui.js';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const initRegister = (onRegistered) => {
  const form = document.getElementById('user-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!username || !isValidEmail(email)) {
      showModal('Introduce un username y un email válidos.');
      return;
    }

    try {
      const userId = await registerOrUpdateUser(username, email);
      setUserId(userId);
      showGameView();
      onRegistered(userId);
    } catch (error) {
      console.error(error);
      showModal('No se ha podido registrar el usuario.');
    }
  });
};
