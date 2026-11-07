const fankit = [
  { id: 1, title: 'Full team poster', type: 'Wallpaper', file: 'images/full_team.jpg', size: 314, alt: 'All Phantom Thieves posing together' },
  { id: 2, title: 'Star pattern', type: 'Wallpaper', file: 'images/Background.jpg', size: 1693, alt: 'Dark pattern of grey stars' },
  { id: 3, title: 'Kamoshida\'s Palace', type: 'Wallpaper', file: 'images/kamoshida-palace.jpg', size: 696, alt: 'Castle of Kamoshida\'s Palace under a purple sky' },
  { id: 4, title: 'Bank of Gluttony', type: 'Wallpaper', file: 'images/bank-of-gluttony.jpg', size: 1047, alt: 'Giant armored vault of the Bank of Gluttony' },
  { id: 5, title: 'Museum of Vanity', type: 'Wallpaper', file: 'images/museum-of-vanity.jpg', size: 47, alt: 'Gallery of the Museum of Vanity' },
  { id: 6, title: 'Phantom emblem', type: 'Avatar', file: 'images/emblem.jpg', size: 39, alt: 'Red and black mask emblem' },
  { id: 7, title: 'Joker', type: 'Avatar', file: 'images/joker.jpg', size: 58, alt: 'Portrait of Joker' },
  { id: 8, title: 'Panther', type: 'Avatar', file: 'images/panther.jpg', size: 223, alt: 'Portrait of Panther' }
];

const fankitGrid = document.getElementById('fankit-grid');
const fankitCount = document.getElementById('fankit-count');
const fankitButtons = document.querySelectorAll('#fankit-filters .filter-btn');

let fankitType = 'All';

function formatSize(kb) {
  return kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB';
}

function createFankitCard(item) {
  const card = document.createElement('article');
  card.className = 'fankit-card';

  const img = document.createElement('img');
  img.className = item.type === 'Avatar' ? 'slot slot-1x1' : 'slot slot-16x9';
  img.src = item.file;
  img.alt = item.alt;
  img.loading = 'lazy';

  const title = document.createElement('h3');
  title.textContent = item.title;

  const info = document.createElement('p');
  info.textContent = item.type + ' | ' + formatSize(item.size);

  const link = document.createElement('a');
  link.className = 'btn btn-p5';
  link.href = item.file;
  link.download = item.file.split('/').pop();
  link.textContent = 'DOWNLOAD';
  link.setAttribute('aria-label', 'Download ' + item.title);

  card.append(img, title, info, link);
  return card;
}

function renderFankit() {
  let total = 0;
  let count = 0;

  fankitGrid.innerHTML = '';
  fankit.forEach(function (item) {
    if (fankitType !== 'All' && item.type !== fankitType) return;
    total += item.size;
    count++;
    fankitGrid.appendChild(createFankitCard(item));
  });

  fankitCount.textContent = count + ' files | Total size: ' + formatSize(total);
  $('#fankit-grid .fankit-card').hide().fadeIn(300);
}

fankitButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    fankitType = button.dataset.type;
    fankitButtons.forEach(function (b) {
      const on = b === button;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    renderFankit();
  });
});

renderFankit();
