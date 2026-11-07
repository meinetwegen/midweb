const btn = document.getElementById('meet-btn');
const overlay = document.getElementById('gif-overlay');
const gif = overlay.querySelector('img');

const GIF_MS = 1500;
let playing = false;

btn.addEventListener('click', function (e) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  e.preventDefault();
  if (playing) return;
  playing = true;

  gif.src = 'media/1.gif?' + Date.now();
  overlay.classList.add('show');

  setTimeout(function () {
    overlay.classList.remove('show');
  }, GIF_MS);

  setTimeout(function () {
    window.location.href = btn.href;
  }, GIF_MS + 300);
});


const questions = [
  { id: 1, question: 'What is the codename of the main character?', options: ['Joker', 'Skull', 'Fox', 'Noir'], answer: 0, fact: 'Joker can switch between many Personas, and that gave him his codename.' },
  { id: 2, question: 'Which member of the team is a talking cat?', options: ['Oracle', 'Mona', 'Panther', 'Queen'], answer: 1, fact: 'Mona is a cat who knows the secrets of the Metaverse.' },
  { id: 3, question: 'What is the name of the first Persona of Joker?', options: ['Carmen', 'Goemon', 'Arsene', 'Zorro'], answer: 2, fact: 'Arsene is named after the gentleman thief Arsene Lupin.' },
  { id: 4, question: 'How does Kamoshida see his Palace?', options: ['A museum', 'A castle', 'A bank', 'A casino'], answer: 1, fact: 'Kamoshida sees Shujin Academy as his own castle.' },
  { id: 5, question: 'What is the real name of Skull?', options: ['Ren Amamiya', 'Yusuke Kitagawa', 'Ryuji Sakamoto', 'Futaba Sakura'], answer: 2, fact: 'Ryuji Sakamoto is loud, loyal and always the first to charge in.' },
  { id: 6, question: 'What do the Phantom Thieves steal from a Palace?', options: ['Gold bars', 'Stolen paintings', 'The treasure', 'Secret maps'], answer: 2, fact: 'The treasure is the form of the ruler\'s distorted desire.' },
  { id: 7, question: 'Which Persona belongs to Panther?', options: ['Carmen', 'Milady', 'Johanna', 'Necronomicon'], answer: 0, fact: 'Panther is Ann Takamaki and her Persona is Carmen of the Lovers Arcana.' },
  { id: 8, question: 'Which Arcana does Joker belong to?', options: ['Magician', 'Emperor', 'Hermit', 'Fool'], answer: 3, fact: 'The Fool Arcana stands for new beginnings and many possibilities.' }
];

const quizStatus = document.getElementById('quiz-status');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const quizNext = document.getElementById('quiz-next');
const quizRestart = document.getElementById('quiz-restart');
const quizBox = document.querySelector('.quiz-box');

let current = 0;
let score = 0;
let answered = false;

function showQuestion() {
  const q = questions[current];
  answered = false;
  quizStatus.textContent = 'Question ' + (current + 1) + ' of ' + questions.length + ' | Score: ' + score;
  quizQuestion.textContent = q.question;
  quizFeedback.textContent = '';
  quizFeedback.className = 'quiz-feedback';
  quizOptions.innerHTML = '';
  quizNext.disabled = true;
  quizNext.textContent = current === questions.length - 1 ? 'Show result' : 'Next question';
  quizNext.hidden = false;

  q.options.forEach(function (text, index) {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = 'quiz-option';
    option.textContent = (index + 1) + '. ' + text;
    option.addEventListener('click', function () {
      chooseAnswer(index, option);
    });
    quizOptions.appendChild(option);
  });
}

function chooseAnswer(index, option) {
  if (answered) return;
  answered = true;
  const q = questions[current];
  const buttons = quizOptions.querySelectorAll('.quiz-option');

  buttons.forEach(function (b) {
    b.disabled = true;
  });
  buttons[q.answer].classList.add('correct');

  if (index === q.answer) {
    score++;
    quizFeedback.textContent = 'Correct! ' + q.fact;
    quizFeedback.className = 'quiz-feedback ok';
  } else {
    option.classList.add('wrong');
    quizFeedback.textContent = 'Not this time. ' + q.fact;
    quizFeedback.className = 'quiz-feedback bad';
  }
  quizStatus.textContent = 'Question ' + (current + 1) + ' of ' + questions.length + ' | Score: ' + score;
  quizNext.disabled = false;
  quizNext.focus();
}

function getRank(points) {
  if (points >= 7) return 'Master Thief';
  if (points >= 4) return 'Rising Phantom';
  return 'Rookie Thief';
}

function showResult() {
  const percent = Math.round((score / questions.length) * 100);
  quizStatus.textContent = 'Quiz finished';
  quizQuestion.textContent = 'You scored ' + score + ' of ' + questions.length + ' (' + percent + '%)';
  quizOptions.innerHTML = '';
  quizFeedback.textContent = 'Your rank: ' + getRank(score) + '. Press restart to try again.';
  quizFeedback.className = 'quiz-feedback ok';
  quizNext.hidden = true;
  quizQuestion.focus();
}

quizNext.addEventListener('click', function () {
  if (!answered) return;
  current++;
  if (current >= questions.length) {
    showResult();
  } else {
    showQuestion();
    quizQuestion.focus();
  }
});

quizRestart.addEventListener('click', function () {
  current = 0;
  score = 0;
  showQuestion();
});

quizBox.addEventListener('keydown', function (e) {
  const number = parseInt(e.key, 10);
  const buttons = quizOptions.querySelectorAll('.quiz-option');
  if (answered || isNaN(number) || number < 1 || number > buttons.length) return;
  buttons[number - 1].click();
});

showQuestion();

$(function () {
  $('.faq-btn').on('click', function () {
    const button = $(this);
    const panel = $('#' + button.attr('aria-controls'));
    const isOpen = button.attr('aria-expanded') === 'true';

    $('.faq-btn').not(button).attr('aria-expanded', 'false').addClass('collapsed');
    $('.faq-panel').not(panel).stop(true, true).slideUp(250);

    button.attr('aria-expanded', String(!isOpen)).toggleClass('collapsed', isOpen);
    if (isOpen) {
      panel.stop(true, true).slideUp(250);
    } else {
      panel.stop(true, true).slideDown(250);
    }
  });

  $('#q1').show();
});
