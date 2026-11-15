import { USER_STORAGE_KEY } from './constants.js';

export const getUserId = () => {
  try {
    return sessionStorage.getItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setUserId = (userId) => {
  try {
    sessionStorage.setItem(USER_STORAGE_KEY, userId);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const clearUserId = () => {
  try {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
