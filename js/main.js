const btn = document.getElementById('meet-btn');
const overlay = document.getElementById('gif-overlay');
const gif = overlay.querySelector('img');

const GIF_MS = 1500;

btn.addEventListener('click', function (e) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  e.preventDefault();
  gif.src = 'media/1.gif?' + Date.now();
  overlay.classList.add('show');

  setTimeout(function () {
    overlay.classList.remove('show');
  }, GIF_MS);

  setTimeout(function () {
    window.location.href = btn.href;
  }, GIF_MS + 300);
});