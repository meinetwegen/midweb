const signupForm = document.getElementById('signup-form');
const signupSuccess = document.getElementById('signup-success');
const suPassword = document.getElementById('su-password');
const suConfirm = document.getElementById('su-confirm');

const signupRules = {
  'su-name': function (f) {
    const v = f.value.trim();
    if (!v) return 'Please enter your name.';
    if (v.length < 2) return 'The name must have at least 2 letters.';
    if (!isName(v)) return 'Use letters, spaces, hyphens and apostrophes only.';
    return '';
  },
  'su-email': function (f) {
    const v = f.value.trim();
    if (!v) return 'Please enter your email.';
    if (!isEmail(v)) return 'Please enter a valid email, for example joker@metaverse.jp.';
    if (findUser(v)) return 'This email is already registered. Please log in.';
    return '';
  },
  'su-password': function (f) {
    const v = f.value;
    if (!v) return 'Please create a password.';
    if (v.length < 8) return 'The password must have at least 8 characters (now ' + v.length + ').';
    if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v)) return 'Use at least one letter and one number.';
    return '';
  },
  'su-confirm': function (f) {
    if (!f.value) return 'Please repeat the password.';
    if (f.value !== suPassword.value) return 'The passwords do not match.';
    return '';
  }
};

watchForm(signupForm, signupRules);

suPassword.addEventListener('input', function () {
  if (suConfirm.value) checkField(suConfirm, signupRules);
});

signupForm.addEventListener('input', function () {
  if (!signupSuccess.hidden) $(signupSuccess).slideUp(200);
});

signupForm.addEventListener('submit', function (e) {
  e.preventDefault();
  $(signupSuccess).hide();

  if (checkForm(signupForm, signupRules) > 0) return;

  const name = document.getElementById('su-name').value;
  const saved = addUser(name, document.getElementById('su-email').value, suPassword.value);

  if (!saved) {
    setError(document.getElementById('su-email'), 'The account could not be saved. Allow site data in your browser and try again.');
    return;
  }

  signupSuccess.textContent = 'Account created for ' + name.trim() + '. You can log in now. ';
  const link = document.createElement('a');
  link.href = 'login.html';
  link.className = 'p5-link-inline-light';
  link.textContent = 'Go to Log In';
  signupSuccess.appendChild(link);

  resetForm(signupForm);
  $(signupSuccess).hide().prop('hidden', false).slideDown(300);
});
