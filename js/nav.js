const navBadge = document.getElementById('nav-count');
const navBadgeLabel = document.getElementById('nav-count-label');
const navLogin = document.getElementById('nav-login');
const navLogout = document.getElementById('nav-logout');
const welcome = document.getElementById('welcome');

function updateNav() {
  const user = getCurrentUser();
  const count = countSaved();

  navBadge.textContent = count;
  navBadge.hidden = count === 0;
  navBadgeLabel.textContent = count ? ' (' + count + ' saved)' : '';

  navLogin.hidden = !!user;
  navLogout.hidden = !user;

  if (welcome) {
    welcome.hidden = !user;
    welcome.textContent = user ? 'Welcome back, ' + user.name.split(' ')[0] + '!' : '';
  }
}

navLogout.addEventListener('click', function () {
  clearSession();
});

document.addEventListener('p5-data-changed', updateNav);
window.addEventListener('storage', updateNav);

updateNav();
