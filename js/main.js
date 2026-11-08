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

function canWipe(link, e) {
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return false;
  if (link.target === '_blank' || link.hasAttribute('download') || link.hasAttribute('data-no-wipe')) return false;
  if (['http:', 'https:', 'file:'].indexOf(link.protocol) === -1) return false;
  if (link.hostname !== window.location.hostname) return false;
  return link.pathname !== window.location.pathname;
}

function readWipe() {
  try {
    return sessionStorage.getItem('p5-wipe') === '1';
  } catch (err) {
    return false;
  }
}

function saveWipe(value) {
  try {
    if (value) {
      sessionStorage.setItem('p5-wipe', '1');
    } else {
      sessionStorage.removeItem('p5-wipe');
    }
  } catch (err) {
    return;
  }
}

$(function () {
  $('html').addClass('js');

  const wipe = $('<div class="wipe" aria-hidden="true"><div class="wipe-dark"></div><div class="wipe-red"></div></div>').appendTo('body');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let leaving = false;

  if (readWipe() && !reduceMotion) {
    saveWipe(false);
    wipe.addClass('on cover no-anim');

    let revealed = false;
    const reveal = function () {
      if (revealed) return;
      revealed = true;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          wipe.removeClass('no-anim').addClass('leave');
          setTimeout(function () {
            wipe.removeClass('on cover leave');
          }, 1100);
        });
      });
    };

    if (document.readyState === 'complete') {
      reveal();
    } else {
      $(window).on('load', reveal);
      setTimeout(reveal, 1200);
    }
  }

  document.documentElement.classList.remove('wipe-in');

  $(window).on('pageshow', function (e) {
    if (e.originalEvent.persisted) {
      leaving = false;
      wipe.removeClass('on cover leave no-anim');
    }
  });

  $(document).on('click', 'a[href]', function (e) {
    if (reduceMotion || !canWipe(this, e)) return;
    e.preventDefault();
    if (leaving) return;
    leaving = true;
    const url = this.href;
    saveWipe(true);
    wipe.addClass('on');
    wipe[0].offsetWidth;
    wipe.addClass('cover');
    setTimeout(function () {
      window.location.href = url;
    }, 850);
  });

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
