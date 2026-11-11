if (getCurrentUser()) {
  window.location.replace('profile.html');
}

const loginForm = document.getElementById('login-form');
const loginSuccess = document.getElementById('login-success');
const loginEmail = document.getElementById('li-email');
const loginPassword = document.getElementById('li-password');

const loginRules = {
  'li-email': function (f) {
    const v = f.value.trim();
    if (!v) return 'Please enter your email.';
    if (!isEmail(v)) return 'Please enter a valid email, for example joker@metaverse.jp.';
    return '';
  },
  'li-password': function (f) {
    return f.value ? '' : 'Please enter your password.';
  }
};

watchForm(loginForm, loginRules);

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  $(loginSuccess).hide();

  if (checkForm(loginForm, loginRules) > 0) return;

  const user = findUser(loginEmail.value);

  if (!user || user.password !== loginPassword.value) {
    setError(loginPassword, 'Wrong email or password. Please try again or sign up.');
    loginPassword.focus();
    return;
  }

  setSession(user.email);
  loginSuccess.textContent = 'Welcome back, ' + user.name + '! Opening your profile...';
  resetForm(loginForm);
  $(loginSuccess).hide().prop('hidden', false).slideDown(200);

  setTimeout(function () {
    window.location.href = 'profile.html';
  }, 900);
});
