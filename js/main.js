function revealOnScroll() {
  const bottom = $(window).scrollTop() + $(window).height();
  $('.reveal').not('.revealed').each(function () {
    if ($(this).offset().top < bottom - 40) {
      $(this).addClass('revealed').fadeTo(600, 1);
    }
  });
}

function readTheme() {
  try {
    return localStorage.getItem('p5-theme') || 'phantom';
  } catch (e) {
    return 'phantom';
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem('p5-theme', theme);
  } catch (e) {
    return;
  }
}

function applyTheme(theme) {
  const next = theme === 'school' ? 'Phantom life' : 'School life';
  document.documentElement.dataset.theme = theme;
  $('#theme-toggle').text(next).attr('aria-label', 'Switch to ' + next.toLowerCase() + ' theme');
}

$(function () {
  $('html').addClass('js');

  let switching = false;
  applyTheme(readTheme());

  $('#theme-toggle').on('click', function () {
    if (switching) return;
    switching = true;
    const next = document.documentElement.dataset.theme === 'school' ? 'phantom' : 'school';
    $('body').fadeTo(150, 0.3, function () {
      applyTheme(next);
      saveTheme(next);
      $('body').fadeTo(250, 1, function () {
        switching = false;
      });
    });
  });

  $('a[href^="#"]').on('click', function (e) {
    const target = $(this.getAttribute('href'));
    if (!target.length) return;
    e.preventDefault();
    $('html, body').stop(true).animate({ scrollTop: target.offset().top - 70 }, 600);
    target.attr('tabindex', '-1')[0].focus({ preventScroll: true });
  });

  const topBtn = $('<button type="button" class="back-top" aria-label="Back to top">&#8593;</button>').appendTo('body').hide();
  let shown = false;

  topBtn.on('click', function () {
    $('html, body').stop(true).animate({ scrollTop: 0 }, 600);
  });

  $(window).on('scroll', function () {
    const past = $(window).scrollTop() > 300;
    if (past && !shown) {
      shown = true;
      topBtn.stop(true, true).fadeIn(250);
    } else if (!past && shown) {
      shown = false;
      topBtn.stop(true, true).fadeOut(250);
    }
    revealOnScroll();
  });

  revealOnScroll();
});
