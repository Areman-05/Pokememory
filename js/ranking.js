import { createScore, getScores, getUsers } from './firebase.js';
import { formatTime } from './timer.js';

const sortScores = (scores) =>
  scores.sort((a, b) => {
    if (b.cards !== a.cards) {
      return b.cards - a.cards;
    }
    return a.time - b.time;
  });

const buildRows = (sorted, highlightId) => {
  if (sorted.length <= 5) {
    return sorted.map((item, index) => ({ type: 'row', item, position: index + 1 }));
  }

  const topFiveIds = sorted.slice(0, 5).map((item) => item.id);
  const firstFour = sorted.slice(0, 4).map((item, index) => ({
    type: 'row',
    item,
    position: index + 1,
  }));

  if (!highlightId || topFiveIds.includes(highlightId)) {
    return [...firstFour, { type: 'ellipsis' }];
  }

  const highlightedIndex = sorted.findIndex((item) => item.id === highlightId);
  const highlighted = sorted[highlightedIndex];

  return [
    ...firstFour,
    { type: 'ellipsis' },
    { type: 'row', item: highlighted, position: highlightedIndex + 1 },
    { type: 'ellipsis' },
  ];
};

const renderRanking = (entries, highlightId) => {
  const ranking = document.getElementById('ranking');
  const tbody = ranking.querySelector('tbody');
  tbody.innerHTML = '';

  buildRows(entries, highlightId).forEach((row) => {
    const tr = document.createElement('tr');

    if (row.type === 'ellipsis') {
      tr.classList.add('ellipsis');
      tr.innerHTML = '<td colspan="5">...</td>';
      tbody.appendChild(tr);
      return;
    }

    if (row.item.id === highlightId) {
      tr.classList.add('highlight');
    }

    tr.innerHTML = `
      <td>${row.position}</td>
      <td>${row.item.username}</td>
      <td>${row.item.email}</td>
      <td>${formatTime(row.item.time)}</td>
      <td>${row.item.cards}</td>
    `;
    tbody.appendChild(tr);
  });
};

export const loadRanking = async (highlightId = null) => {
  const [scoresMap, usersMap] = await Promise.all([getScores(), getUsers()]);

  const entries = Object.entries(scoresMap).map(([id, score]) => {
    const user = usersMap[score.userId] || {};
    return {
      id,
      userId: score.userId,
      time: Number(score.time),
      cards: Number(score.cards),
      username: user.username || '-',
      email: user.email || '-',
    };
  });

  const sorted = sortScores(entries);
  renderRanking(sorted, highlightId);
  return sorted;
};

export const saveGameScore = async (userId, time, cards) => {
  const scoreId = await createScore({ userId, time, cards });
  await loadRanking(scoreId);
  return scoreId;
};
