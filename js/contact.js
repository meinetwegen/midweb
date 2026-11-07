const contactForm = document.getElementById('contact-form');
const contactSuccess = document.getElementById('contact-success');
const msgField = document.getElementById('msg');
const msgCount = document.getElementById('msg-count');
const dateField = document.getElementById('date');

dateField.max = getToday();

function updateCount() {
  const length = msgField.value.length;
  msgCount.textContent = length + ' / 200';
  msgCount.classList.toggle('near-limit', length >= 180);
}

const contactRules = {
  name: function (f) {
    const v = f.value.trim();
    if (!v) return 'Please enter the name or alias of the target.';
    if (v.length < 2) return 'The name must have at least 2 letters.';
    if (!isName(v)) return 'Use only letters, spaces, apostrophes and hyphens.';
    return '';
  },
  email: function (f) {
    const v = f.value.trim();
    if (!v) return 'Please enter your email so we can reach you.';
    if (!isEmail(v)) return 'Enter a real email, for example joker@metaverse.jp.';
    return '';
  },
  phone: function (f) {
    const v = f.value.trim();
    if (!v) return '';
    if (!/^\+?[0-9][0-9\s()-]{8,16}$/.test(v)) return 'Use 9 to 17 digits, for example +7 701 123 4567.';
    return '';
  },
  age: function (f) {
    const v = f.value.trim();
    if (!v) return 'Please enter the age of the target.';
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1 || n > 99) return 'The age must be a whole number from 1 to 99.';
    return '';
  },
  date: function (f) {
    if (!f.value) return 'Please choose the date of the incident.';
    if (f.value > getToday()) return 'The incident date cannot be in the future.';
    return '';
  },
  msg: function (f) {
    const v = f.value.trim();
    if (!v) return 'Please describe what the target did.';
    if (v.length < 20) return 'Write at least 20 characters, you have ' + v.length + '.';
    return '';
  },
  agree: function (f) {
    return f.checked ? '' : 'You must confirm that the report is true.';
  }
};

watchForm(contactForm, contactRules);
msgField.addEventListener('input', updateCount);

contactForm.addEventListener('input', function () {
  if (!contactSuccess.hidden) $(contactSuccess).stop(true, true).slideUp(200);
});

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  $(contactSuccess).stop(true, true).hide();

  if (checkForm(contactForm, contactRules) > 0) return;

  const target = document.getElementById('name').value.trim();
  const crime = contactForm.querySelector('input[name="opt"]:checked').value;

  contactSuccess.textContent = 'Calling card received! The Phantom Thieves will investigate ' + target + ' for ' + crime.toLowerCase() + '. Check your inbox soon.';
  resetForm(contactForm);
  updateCount();
  $(contactSuccess).hide().prop('hidden', false).slideDown(300);
  $('html, body').stop(true).animate({ scrollTop: $(contactSuccess).offset().top - 90 }, 500);
});

updateCount();
