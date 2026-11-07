function revealOnScroll() {
  const bottom = $(window).scrollTop() + $(window).height();
  $('.reveal').not('.revealed').each(function () {
    if ($(this).offset().top < bottom - 40) {
      $(this).addClass('revealed').fadeTo(600, 1);
    }
  });
}

$(function () {
  $('html').addClass('js');

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
