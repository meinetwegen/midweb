const KEYS = {
  users: 'p5-users',
  session: 'p5-session',
  favorites: 'p5-favorites',
  plan: 'p5-plan',
  quiz: 'p5-quiz'
};

function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    return false;
  }
  document.dispatchEvent(new CustomEvent('p5-data-changed'));
  return true;
}

function removeData(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    return;
  }
  document.dispatchEvent(new CustomEvent('p5-data-changed'));
}

function loadList(key) {
  const value = loadData(key, []);
  return Array.isArray(value) ? value : [];
}

function getFavorites() {
  return loadList(KEYS.favorites);
}

function isFavorite(codename) {
  return getFavorites().indexOf(codename) !== -1;
}

function toggleFavorite(codename) {
  const list = getFavorites();
  const index = list.indexOf(codename);
  if (index === -1) {
    list.push(codename);
  } else {
    list.splice(index, 1);
  }
  saveData(KEYS.favorites, list);
  return index === -1;
}

function removeFavorite(codename) {
  saveData(KEYS.favorites, getFavorites().filter(function (name) {
    return name !== codename;
  }));
}

function clearFavorites() {
  removeData(KEYS.favorites);
}


function getPlanIds() {
  return loadList(KEYS.plan).filter(function (id) {
    return typeof id === 'number';
  });
}

function savePlanIds(ids) {
  saveData(KEYS.plan, ids);
}


function getQuizBest() {
  const best = loadData(KEYS.quiz, null);
  if (!best || typeof best.score !== 'number' || typeof best.total !== 'number') return null;
  return best;
}

function saveQuizResult(score, total) {
  const best = getQuizBest();
  if (best && best.score >= score) return best;
  const result = { score: score, total: total, date: new Date().toISOString() };
  saveData(KEYS.quiz, result);
  return result;
}


function getUsers() {
  return loadList(KEYS.users);
}

function findUser(email) {
  const wanted = String(email).trim().toLowerCase();
  return getUsers().find(function (user) {
    return user.email === wanted;
  });
}

function addUser(name, email, password) {
  const users = getUsers();
  users.push({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: password,
    created: new Date().toISOString()
  });
  return saveData(KEYS.users, users);
}

function setSession(email) {
  saveData(KEYS.session, { email: email.trim().toLowerCase() });
}

function getCurrentUser() {
  const session = loadData(KEYS.session, null);
  if (!session || !session.email) return null;
  return findUser(session.email) || null;
}

function clearSession() {
  removeData(KEYS.session);
}


function countSaved() {
  return getFavorites().length + getPlanIds().length;
}
