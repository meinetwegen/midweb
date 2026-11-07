function getToday() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return now.getFullYear() + '-' + month + '-' + day;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isName(value) {
  return /^[A-Za-z\u00C0-\u024F\u0400-\u04FF' -]+$/.test(value);
}

function setError(field, message) {
  const error = document.getElementById(field.id + '-error');
  const wasInvalid = field.classList.contains('is-invalid');
  field.classList.add('is-invalid');
  field.setAttribute('aria-invalid', 'true');
  if (error) {
    error.textContent = message;
    if (!wasInvalid) $(error).stop(true, true).hide().fadeIn(200);
  }
}

function clearError(field) {
  const error = document.getElementById(field.id + '-error');
  field.classList.remove('is-invalid');
  field.removeAttribute('aria-invalid');
  if (error) {
    error.textContent = '';
    $(error).stop(true, true).css('display', '');
  }
}

function checkField(field, rules) {
  const rule = rules[field.id];
  if (!rule) return true;
  const message = rule(field);
  if (message) {
    setError(field, message);
    return false;
  }
  clearError(field);
  return true;
}

function checkForm(form, rules) {
  let firstInvalid = null;
  let errors = 0;

  Object.keys(rules).forEach(function (id) {
    const field = document.getElementById(id);
    if (!checkField(field, rules)) {
      errors++;
      if (!firstInvalid) firstInvalid = field;
    }
  });

  if (firstInvalid) firstInvalid.focus();
  return errors;
}

function watchForm(form, rules) {
  const handler = function (e) {
    const field = e.target;
    if (rules[field.id] && field.classList.contains('is-invalid')) {
      checkField(field, rules);
    }
  };
  form.addEventListener('input', handler);
  form.addEventListener('change', handler);
}

function resetForm(form) {
  form.reset();
  form.querySelectorAll('.is-invalid').forEach(clearError);
}
