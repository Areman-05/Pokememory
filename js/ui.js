export const showModal = (message) => {
  const modal = document.getElementById('modal');
  const modalMessage = document.getElementById('modal-message');
  modalMessage.textContent = message;
  if (typeof modal.showModal === 'function') {
    modal.showModal();
  } else {
    modal.setAttribute('open', '');
  }
};

export const showRegisterView = () => {
  const userForm = document.getElementById('user-form');
  const game = document.getElementById('game');
  userForm.hidden = false;
  userForm.classList.remove('hidden');
  game.hidden = true;
  game.classList.add('hidden');
};

export const showGameView = () => {
  const userForm = document.getElementById('user-form');
  const game = document.getElementById('game');
  userForm.hidden = true;
  userForm.classList.add('hidden');
  game.hidden = false;
  game.classList.remove('hidden');
};
