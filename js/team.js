const members = [
  { codename: 'Joker', realName: 'Ren Amamiya', persona: 'Arsene', arcana: 'Fool', role: 'Leader', threat: 10, image: 'images/joker.jpg', description: 'The leader. A wild card who can use many Personas.' },
  { codename: 'Skull', realName: 'Ryuji Sakamoto', persona: 'Captain Kidd', arcana: 'Chariot', role: 'Fighter', threat: 7, image: 'images/skull.jpg', description: 'Loud and loyal, always the first to charge in.' },
  { codename: 'Mona', realName: 'Morgana', persona: 'Zorro', arcana: 'Magician', role: 'Support', threat: 6, image: 'images/mona.jpg', description: 'A talking cat who knows the secrets of the Metaverse.' },
  { codename: 'Panther', realName: 'Ann Takamaki', persona: 'Carmen', arcana: 'Lovers', role: 'Fighter', threat: 7, image: 'images/panther.jpg', description: 'A model with a fiery temper and a strong sense of justice.' },
  { codename: 'Fox', realName: 'Yusuke Kitagawa', persona: 'Goemon', arcana: 'Emperor', role: 'Fighter', threat: 8, image: 'images/fox.jpg', description: 'An artist who sees beauty in everything around him.' },
  { codename: 'Queen', realName: 'Makoto Niijima', persona: 'Johanna', arcana: 'Priestess', role: 'Support', threat: 8, image: 'images/queen.jpg', description: 'The student council president and the team\'s strategist.' },
  { codename: 'Oracle', realName: 'Futaba Sakura', persona: 'Necronomicon', arcana: 'Hermit', role: 'Support', threat: 6, image: 'images/oracle.jpg', description: 'A genius hacker who guides the team from far away.' },
  { codename: 'Noir', realName: 'Haru Okumura', persona: 'Milady', arcana: 'Empress', role: 'Fighter', threat: 7, image: 'images/noir.jpg', description: 'A gentle gardener who fights with a sharp axe.' }
];

const grid = document.getElementById('roster-grid');
const searchInput = document.getElementById('member-search');
const sortSelect = document.getElementById('member-sort');
const resetBtn = document.getElementById('member-reset');
const filterButtons = document.querySelectorAll('.filter-btn');
const countText = document.getElementById('team-count');
const emptyBox = document.getElementById('team-empty');
const emptyText = document.getElementById('team-empty-text');

let activeRole = 'All';

function getVisibleMembers() {
  const query = searchInput.value.trim().toLowerCase();
  const result = [];

  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    const text = (m.codename + ' ' + m.realName + ' ' + m.persona + ' ' + m.arcana).toLowerCase();
    if (activeRole !== 'All' && m.role !== activeRole) continue;
    if (query && text.indexOf(query) === -1) continue;
    result.push(m);
  }

  result.sort(function (a, b) {
    if (sortSelect.value === 'threat') return b.threat - a.threat || a.codename.localeCompare(b.codename);
    if (sortSelect.value === 'persona') return a.persona.localeCompare(b.persona);
    return a.codename.localeCompare(b.codename);
  });

  return result;
}

function createCard(m) {
  const card = document.createElement('article');
  card.className = 'member';

  const img = document.createElement('img');
  img.className = 'slot';
  img.src = m.image;
  img.alt = 'Portrait of ' + m.codename;
  img.loading = 'lazy';

  const name = document.createElement('h3');
  name.textContent = m.codename;

  const text = document.createElement('p');
  text.textContent = m.description;

  const meta = document.createElement('p');
  meta.className = 'member-meta';
  meta.textContent = m.role + ' | Persona: ' + m.persona;

  const threatLabel = document.createElement('p');
  threatLabel.className = 'threat-label';
  threatLabel.textContent = 'Threat level: ' + m.threat + ' / 10';

  const threat = document.createElement('div');
  threat.className = 'threat';
  threat.setAttribute('role', 'img');
  threat.setAttribute('aria-label', 'Threat level ' + m.threat + ' of 10');
  const bar = document.createElement('span');
  bar.className = 'threat-bar';
  bar.dataset.level = m.threat * 10;
  threat.appendChild(bar);

  card.append(img, name, text, meta, threatLabel, threat);
  return card;
}

function render(animate) {
  const list = getVisibleMembers();
  let total = 0;

  grid.innerHTML = '';
  list.forEach(function (m) {
    total += m.threat;
    grid.appendChild(createCard(m));
  });

  if (list.length === 0) {
    const query = searchInput.value.trim();
    emptyText.textContent = query ? 'Nobody matches "' + query + '" in this group. Try another name or clear the filters.' : 'Nobody is in this group.';
    emptyBox.hidden = false;
    countText.textContent = 'Showing 0 of ' + members.length + ' thieves';
  } else {
    emptyBox.hidden = true;
    const average = (total / list.length).toFixed(1);
    countText.textContent = 'Showing ' + list.length + ' of ' + members.length + ' thieves | Average threat level: ' + average + ' / 10';
  }

  $('#roster-grid .threat-bar').each(function () {
    const level = $(this).data('level') + '%';
    if (animate === false) {
      $(this).css('width', level);
    } else {
      $(this).css('width', 0).animate({ width: level }, 600);
    }
  });
  if (animate !== false) $('#roster-grid .member').hide().fadeIn(300);
}

searchInput.addEventListener('input', function () {
  render(false);
});
sortSelect.addEventListener('change', render);

filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    activeRole = button.dataset.role;
    filterButtons.forEach(function (b) {
      const on = b === button;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    render();
  });
});

resetBtn.addEventListener('click', function () {
  searchInput.value = '';
  sortSelect.value = 'name';
  activeRole = 'All';
  filterButtons.forEach(function (b) {
    const on = b.dataset.role === 'All';
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', String(on));
  });
  render();
  searchInput.focus();
});

render();

const pollForm = document.getElementById('poll-form');
const pollSuccess = document.getElementById('poll-success');
const thiefSelect = document.getElementById('poll-thief');
const dateInput = document.getElementById('poll-date');
const pollResults = document.getElementById('poll-results');
const pollResultsList = document.getElementById('poll-results-list');
const votes = {};
let totalVotes = 0;

members.forEach(function (m) {
  votes[m.codename] = 0;
  const option = document.createElement('option');
  option.value = m.codename;
  option.textContent = m.codename + ' (' + m.persona + ')';
  thiefSelect.appendChild(option);
});

dateInput.max = getToday();

const pollRules = {
  'poll-name': function (f) {
    const v = f.value.trim();
    if (!v) return 'Please enter your name.';
    if (v.length < 2) return 'The name must have at least 2 letters.';
    if (!isName(v)) return 'Use only letters, spaces, apostrophes and hyphens.';
    return '';
  },
  'poll-email': function (f) {
    const v = f.value.trim();
    if (!v) return 'Please enter your email.';
    if (!isEmail(v)) return 'Enter a real email, for example fan@example.com.';
    return '';
  },
  'poll-thief': function (f) {
    return f.value ? '' : 'Please choose your favourite thief.';
  },
  'poll-rating': function (f) {
    const v = f.value.trim();
    if (!v) return 'Please give a rating.';
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1 || n > 10) return 'The rating must be a whole number from 1 to 10.';
    return '';
  },
  'poll-date': function (f) {
    if (!f.value) return 'Please choose the date.';
    if (f.value > getToday()) return 'The date cannot be in the future.';
    if (f.value < '2016-09-15') return 'Persona 5 came out in September 2016, choose a later date.';
    return '';
  },
  'poll-comment': function (f) {
    const v = f.value.trim();
    if (v && v.length < 10) return 'Write at least 10 characters or leave this field empty.';
    return '';
  },
  'poll-agree': function (f) {
    return f.checked ? '' : 'You must accept the rules to vote.';
  }
};

function renderResults() {
  const sorted = members.slice().sort(function (a, b) {
    return votes[b.codename] - votes[a.codename] || a.codename.localeCompare(b.codename);
  });

  pollResultsList.innerHTML = '';
  sorted.forEach(function (m) {
    const count = votes[m.codename];
    if (!count) return;
    const percent = Math.round((count / totalVotes) * 100);

    const item = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = m.codename + ': ' + count + (count === 1 ? ' vote' : ' votes') + ' (' + percent + '%)';
    const track = document.createElement('div');
    track.className = 'poll-bar';
    track.setAttribute('role', 'img');
    track.setAttribute('aria-label', m.codename + ' has ' + percent + ' percent of the votes');
    const fill = document.createElement('span');
    fill.style.width = percent + '%';
    track.appendChild(fill);
    item.append(label, track);
    pollResultsList.appendChild(item);
  });

  if (pollResults.hidden) $(pollResults).prop('hidden', false).hide().slideDown(250);
}

watchForm(pollForm, pollRules);

pollForm.addEventListener('input', function () {
  if (!pollSuccess.hidden) $(pollSuccess).stop(true, true).slideUp(200);
});

pollForm.addEventListener('submit', function (e) {
  e.preventDefault();
  $(pollSuccess).stop(true, true).hide();

  if (checkForm(pollForm, pollRules) > 0) return;

  const name = document.getElementById('poll-name').value.trim();
  const thief = thiefSelect.value;
  votes[thief]++;
  totalVotes++;

  pollSuccess.textContent = 'Thanks, ' + name + '! Your vote for ' + thief + ' is counted. ' + thief + ' has ' + votes[thief] + ' of ' + totalVotes + ' votes in this session.';
  resetForm(pollForm);
  renderResults();
  $(pollSuccess).hide().prop('hidden', false).slideDown(300);
});
