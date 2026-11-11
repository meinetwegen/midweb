const accountIn = document.getElementById('account-in');
const accountOut = document.getElementById('account-out');
const favList = document.getElementById('fav-list');
const favEmpty = document.getElementById('fav-empty');
const favTotal = document.getElementById('fav-total');
const favClear = document.getElementById('fav-clear');
const planSavedList = document.getElementById('plan-saved-list');
const planSavedEmpty = document.getElementById('plan-saved-empty');
const planSavedClear = document.getElementById('plan-saved-clear');

function formatDate(iso) {
  const date = new Date(iso);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderAccount() {
  const user = getCurrentUser();
  accountIn.hidden = !user;
  accountOut.hidden = !!user;

  if (user) {
    document.getElementById('pf-name').textContent = user.name;
    document.getElementById('pf-email').textContent = user.email;
    document.getElementById('pf-since').textContent = formatDate(user.created);
  }
}

function renderQuiz() {
  const best = getQuizBest();
  const percent = best ? Math.round((best.score / best.total) * 100) : 0;
  document.getElementById('pf-quiz').textContent = best
    ? 'Best result: ' + best.score + ' of ' + best.total + ' (' + percent + '%). Saved on ' + formatDate(best.date) + '.'
    : 'No result yet. Take the quiz on the Home page.';
}

function createSavedItem(text, label, onRemove) {
  const item = document.createElement('li');

  const name = document.createElement('span');
  name.className = 'saved-name';
  name.textContent = text;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn-remove';
  button.textContent = 'Remove';
  button.setAttribute('aria-label', label);
  button.addEventListener('click', function () {
    button.disabled = true;
    onRemove();
    $(item).stop(true, true).slideUp(200);
  });

  item.append(name, button);
  return item;
}

function renderFavorites() {
  const names = getFavorites().filter(function (codename) {
    return members.some(function (m) {
      return m.codename === codename;
    });
  });

  favList.innerHTML = '';
  names.forEach(function (codename) {
    const m = members.find(function (x) {
      return x.codename === codename;
    });
    favList.appendChild(createSavedItem(
      m.codename + ' (' + m.persona + ') | ' + m.role,
      'Remove ' + m.codename + ' from favorites',
      function () {
        removeFavorite(codename);
        updateFavoriteText();
      }
    ));
  });

  updateFavoriteText();
}

function updateFavoriteText() {
  const count = getFavorites().length;
  favTotal.textContent = count + (count === 1 ? ' favorite thief' : ' favorite thieves');
  favEmpty.hidden = count > 0;
  favClear.disabled = count === 0;
}

function renderPlan() {
  const ids = getPlanIds().filter(function (id) {
    return palaces.some(function (p) {
      return p.id === id;
    });
  });

  planSavedList.innerHTML = '';
  ids.forEach(function (id) {
    const p = palaces.find(function (x) {
      return x.id === id;
    });
    planSavedList.appendChild(createSavedItem(
      p.name + ' | ' + p.days + ' days | difficulty ' + p.difficulty + ' / 5',
      'Remove ' + p.name + ' from the plan',
      function () {
        savePlanIds(getPlanIds().filter(function (x) {
          return x !== id;
        }));
        updatePlanTotals();
      }
    ));
  });

  updatePlanTotals();
}

function updatePlanTotals() {
  let days = 0;
  let level = 0;
  const ids = getPlanIds();

  ids.forEach(function (id) {
    const p = palaces.find(function (x) {
      return x.id === id;
    });
    if (!p) return;
    days += p.days;
    level += p.difficulty;
  });

  document.getElementById('pf-plan-count').textContent = ids.length;
  document.getElementById('pf-plan-days').textContent = days;
  document.getElementById('pf-plan-avg').textContent = ids.length ? (level / ids.length).toFixed(1) + ' / 5' : '0';
  planSavedEmpty.hidden = ids.length > 0;
  planSavedClear.disabled = ids.length === 0;
}

document.getElementById('pf-logout').addEventListener('click', function () {
  clearSession();
  renderAccount();
});

favClear.addEventListener('click', function () {
  clearFavorites();
  $('#fav-list li').stop(true, true).slideUp(200, renderFavorites);
  updateFavoriteText();
});

planSavedClear.addEventListener('click', function () {
  savePlanIds([]);
  $('#plan-saved-list li').stop(true, true).slideUp(200, renderPlan);
  updatePlanTotals();
});

document.addEventListener('p5-data-changed', renderAccount);

renderAccount();
renderQuiz();
renderFavorites();
renderPlan();
