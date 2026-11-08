const palaces = [
  { id: 1, name: 'Kamoshida\'s Palace', ruler: 'Suguru Kamoshida', form: 'Castle', location: 'Shujin Academy', difficulty: 2, days: 5, deadline: 'May 2' },
  { id: 2, name: 'Museum of Vanity', ruler: 'Ichiryusai Madarame', form: 'Museum', location: 'Traditional art district', difficulty: 3, days: 6, deadline: 'June 5' },
  { id: 3, name: 'Bank of Gluttony', ruler: 'Junya Kaneshiro', form: 'Bank', location: 'Shibuya', difficulty: 3, days: 6, deadline: 'July 9' },
  { id: 4, name: 'Pyramid of Wisdom', ruler: 'Futaba Sakura', form: 'Pyramid', location: 'Yongen-Jaya', difficulty: 3, days: 7, deadline: 'August 21' },
  { id: 5, name: 'Spaceport of Greed', ruler: 'Kunikazu Okumura', form: 'Spaceport', location: 'Okumura Foods', difficulty: 4, days: 8, deadline: 'October 11' },
  { id: 6, name: 'Casino Palace', ruler: 'Sae Niijima', form: 'Casino', location: 'Prosecutor\'s office', difficulty: 4, days: 8, deadline: 'November 20' },
  { id: 7, name: 'Cruise Ship of Pride', ruler: 'Masayoshi Shido', form: 'Cruise ship', location: 'Tokyo Bay', difficulty: 5, days: 10, deadline: 'December 18' },
  { id: 8, name: 'Mementos Depths', ruler: 'Public cognition', form: 'Underground tunnel', location: 'Shibuya Station', difficulty: 5, days: 12, deadline: 'open all year' }
];

const gallery = [
  { src: 'images/kamoshida-palace.jpg', alt: 'Kamoshida\'s Palace, a castle floating above Shujin Academy', title: 'Kamoshida\'s Palace', text: 'A castle where the ruler sees students as his subjects.' },
  { src: 'images/museum-of-vanity.jpg', alt: 'Museum of Vanity, a gallery full of stolen artwork', title: 'Museum of Vanity', text: 'A gallery full of stolen art, guarded by lasers.' },
  { src: 'images/bank-of-gluttony.jpg', alt: 'Bank of Gluttony, a giant armored vault above Shibuya', title: 'Bank of Gluttony', text: 'A huge vault floating high above Shibuya.' },
  { src: 'images/map.jpg', alt: 'Map of Tokyo with the Metaverse entry points marked', title: 'Tokyo map', text: 'The operation board with every entry point to the Metaverse.' }
];

const palaceGrid = document.getElementById('palace-grid');
const palaceSearch = document.getElementById('palace-search');
const palaceLevel = document.getElementById('palace-level');
const palaceSort = document.getElementById('palace-sort');
const palaceCount = document.getElementById('palace-count');
const palaceEmpty = document.getElementById('palace-empty');
const palaceEmptyText = document.getElementById('palace-empty-text');
const palaceReset = document.getElementById('palace-reset');
const planList = document.getElementById('plan-list');
const planEmpty = document.getElementById('plan-empty');
const planCount = document.getElementById('plan-count');
const planDays = document.getElementById('plan-days');
const planAvg = document.getElementById('plan-avg');
const planNote = document.getElementById('plan-note');
const planClear = document.getElementById('plan-clear');

let plan = [];

function matchesLevel(p) {
  if (palaceLevel.value === 'easy') return p.difficulty <= 2;
  if (palaceLevel.value === 'medium') return p.difficulty === 3;
  if (palaceLevel.value === 'hard') return p.difficulty >= 4;
  return true;
}

function getVisiblePalaces() {
  const query = palaceSearch.value.trim().toLowerCase();
  const result = [];

  for (let i = 0; i < palaces.length; i++) {
    const p = palaces[i];
    const text = (p.name + ' ' + p.ruler + ' ' + p.form + ' ' + p.location).toLowerCase();
    if (!matchesLevel(p)) continue;
    if (query && text.indexOf(query) === -1) continue;
    result.push(p);
  }

  result.sort(function (a, b) {
    if (palaceSort.value === 'difficulty') return b.difficulty - a.difficulty || a.name.localeCompare(b.name);
    if (palaceSort.value === 'days') return a.days - b.days || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });

  return result;
}

function createPalaceCard(p) {
  const card = document.createElement('article');
  card.className = 'palace-card';

  const title = document.createElement('h3');
  title.textContent = p.name;

  const info = document.createElement('p');
  info.className = 'palace-info';
  info.textContent = 'Ruler: ' + p.ruler + ' | Shape: ' + p.form + ' | Place: ' + p.location;

  const meter = document.createElement('div');
  meter.className = 'meter';
  meter.setAttribute('role', 'img');
  meter.setAttribute('aria-label', 'Difficulty ' + p.difficulty + ' of 5');
  const fill = document.createElement('span');
  fill.className = 'meter-fill';
  fill.dataset.level = p.difficulty * 20;
  meter.appendChild(fill);

  const days = document.createElement('p');
  days.className = 'palace-days';
  days.textContent = 'Difficulty ' + p.difficulty + ' / 5 | ' + p.days + ' days to infiltrate | Deadline: ' + p.deadline;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-p5 add-btn';
  button.dataset.id = p.id;
  button.addEventListener('click', function () {
    togglePlan(p.id);
  });

  card.append(title, info, meter, days, button);
  return card;
}

function refreshButtons() {
  palaceGrid.querySelectorAll('.add-btn').forEach(function (button) {
    const inPlan = plan.indexOf(Number(button.dataset.id)) !== -1;
    button.textContent = inPlan ? 'REMOVE FROM PLAN' : 'ADD TO PLAN';
    button.setAttribute('aria-pressed', String(inPlan));
    button.classList.toggle('in-plan', inPlan);
  });
}

function renderPalaces(animate) {
  const list = getVisiblePalaces();

  palaceGrid.innerHTML = '';
  list.forEach(function (p) {
    palaceGrid.appendChild(createPalaceCard(p));
  });

  if (list.length === 0) {
    const query = palaceSearch.value.trim();
    palaceEmptyText.textContent = query ? 'Nothing matches "' + query + '" with this difficulty. Change the search or the level.' : 'No target has this difficulty level.';
    palaceEmpty.hidden = false;
    palaceCount.textContent = 'Showing 0 of ' + palaces.length + ' targets';
  } else {
    palaceEmpty.hidden = true;
    palaceCount.textContent = 'Showing ' + list.length + ' of ' + palaces.length + ' targets';
  }

  refreshButtons();
  $('#palace-grid .meter-fill').each(function () {
    const level = $(this).data('level') + '%';
    if (animate === false) {
      $(this).css('width', level);
    } else {
      $(this).css('width', 0).animate({ width: level }, 600);
    }
  });
  if (animate !== false) $('#palace-grid .palace-card').hide().fadeIn(300);
}

function findPalace(id) {
  return palaces.find(function (p) {
    return p.id === id;
  });
}

function updateSummary() {
  let days = 0;
  let level = 0;
  let hardest = null;

  plan.forEach(function (id) {
    const p = findPalace(id);
    days += p.days;
    level += p.difficulty;
    if (!hardest || p.difficulty > hardest.difficulty) hardest = p;
  });

  planCount.textContent = plan.length;
  planDays.textContent = days;
  planAvg.textContent = plan.length ? (level / plan.length).toFixed(1) + ' / 5' : '0';
  planEmpty.hidden = plan.length > 0;
  planClear.disabled = plan.length === 0;

  if (!plan.length) {
    planNote.textContent = '';
  } else if (days > 20) {
    planNote.textContent = 'Warning: more than 20 days. Hardest target: ' + hardest.name + '.';
  } else {
    planNote.textContent = 'A safe plan. Hardest target: ' + hardest.name + '.';
  }
}

function addToPlan(id) {
  const p = findPalace(id);
  plan.push(id);

  $('#plan-item-' + id).stop(true, true).remove();
  const item = document.createElement('li');
  item.id = 'plan-item-' + id;
  item.textContent = p.name + ' (' + p.days + ' days)';
  planList.appendChild(item);
  $(item).hide().slideDown(250);
}

function removeFromPlan(id) {
  plan = plan.filter(function (x) {
    return x !== id;
  });
  $('#plan-item-' + id).stop(true, true).slideUp(250, function () {
    $(this).remove();
  });
}

function togglePlan(id) {
  if (plan.indexOf(id) === -1) {
    addToPlan(id);
  } else {
    removeFromPlan(id);
  }
  updateSummary();
  refreshButtons();
}

palaceSearch.addEventListener('input', function () {
  renderPalaces(false);
});
palaceLevel.addEventListener('change', renderPalaces);
palaceSort.addEventListener('change', renderPalaces);

palaceReset.addEventListener('click', function () {
  palaceSearch.value = '';
  palaceLevel.value = 'all';
  palaceSort.value = 'name';
  renderPalaces();
  palaceSearch.focus();
});

planClear.addEventListener('click', function () {
  plan.slice().forEach(removeFromPlan);
  updateSummary();
  refreshButtons();
});

renderPalaces();
updateSummary();

const galleryGrid = document.getElementById('gallery-grid');
const lightbox = $('#lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
let galleryIndex = 0;
let lastThumb = null;

gallery.forEach(function (g, index) {
  const thumb = document.createElement('button');
  thumb.type = 'button';
  thumb.className = 'gallery-thumb';
  thumb.setAttribute('aria-label', 'Open ' + g.title);

  const img = document.createElement('img');
  img.className = 'slot';
  img.src = g.src;
  img.alt = g.alt;
  img.loading = 'lazy';

  const label = document.createElement('span');
  label.textContent = g.title;

  thumb.append(img, label);
  thumb.addEventListener('click', function () {
    lastThumb = thumb;
    galleryIndex = index;
    showSlide();
    lightbox.stop(true, true).prop('hidden', false).hide().fadeIn(250);
    document.getElementById('lightbox-close').focus();
  });
  galleryGrid.appendChild(thumb);
});

function showSlide() {
  const g = gallery[galleryIndex];
  lightboxImg.src = g.src;
  lightboxImg.alt = g.alt;
  lightboxCaption.textContent = (galleryIndex + 1) + ' / ' + gallery.length + ' | ' + g.title + ': ' + g.text;
}

function moveSlide(step) {
  galleryIndex = (galleryIndex + step + gallery.length) % gallery.length;
  $(lightboxImg).stop(true, true).fadeOut(120, function () {
    showSlide();
    $(this).fadeIn(200);
  });
}

function closeLightbox() {
  lightbox.stop(true, true).fadeOut(200, function () {
    lightbox.prop('hidden', true);
    if (lastThumb) lastThumb.focus();
  });
}

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox-prev').addEventListener('click', function () {
  moveSlide(-1);
});
document.getElementById('lightbox-next').addEventListener('click', function () {
  moveSlide(1);
});
lightbox.on('click', function (e) {
  if (e.target === this) closeLightbox();
});

document.addEventListener('keydown', function (e) {
  if (lightbox.prop('hidden') || !lightbox.is(':visible')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') moveSlide(-1);
  if (e.key === 'ArrowRight') moveSlide(1);
  if (e.key === 'Tab') {
    const controls = lightbox.find('button').toArray();
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
