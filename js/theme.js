(function () {
  try {
    var theme = localStorage.getItem('p5-theme');
    if (theme) document.documentElement.dataset.theme = theme;
    if (sessionStorage.getItem('p5-wipe') === '1') document.documentElement.classList.add('wipe-in');
  } catch (e) {}
})();
