import { FIREBASE_URL, SCORES_PATH, USERS_PATH } from './constants.js';

const buildUrl = (path, id) => {
  if (id) {
    return `${FIREBASE_URL}/${path}/${id}.json`;
  }
  return `${FIREBASE_URL}/${path}.json`;
};

const parseJson = async (response) => {
  if (!response.ok) {
    throw new Error(`Firebase error: ${response.status}`);
  }
  return response.json();
};

export const getUsers = async () => {
  const response = await fetch(buildUrl(USERS_PATH));
  const data = await parseJson(response);
  return data || {};
};

export const createUser = async (user) => {
  const response = await fetch(buildUrl(USERS_PATH), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  const data = await parseJson(response);
  return data.name;
};

export const updateUser = async (userId, user) => {
  const response = await fetch(buildUrl(USERS_PATH, userId), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  await parseJson(response);
  return userId;
};

export const registerOrUpdateUser = async (username, email) => {
  const users = await getUsers();
  const existing = Object.entries(users).find(([, user]) => user.email === email);

  if (existing) {
    const [userId] = existing;
    await updateUser(userId, { username, email });
    return userId;
  }

  return createUser({ username, email });
};

export const getScores = async () => {
  const response = await fetch(buildUrl(SCORES_PATH));
  const data = await parseJson(response);
  return data || {};
};

export const createScore = async (score) => {
  const response = await fetch(buildUrl(SCORES_PATH), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(score),
  });
  const data = await parseJson(response);
  return data.name;
};
