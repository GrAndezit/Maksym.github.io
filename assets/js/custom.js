document.addEventListener('DOMContentLoaded', () => {
    console.log('custom.js loaded ✅');

    // Rating sliders -> live value labels
    setupRatingSlider('ratingProject', 'ratingProjectValue');
    setupRatingSlider('ratingTimeline', 'ratingTimelineValue');
    setupRatingSlider('ratingBudget', 'ratingBudgetValue');

    // Real-time validation for contact form fields
    setupRealTimeValidation();

    // Phone number masking for Lithuanian format
    setupPhoneMask();

    // Contact form submission handling
    setupBulbControl();
});

/* =========================================================
   SLIDER LABELS
   ========================================================= */
function setupRatingSlider(sliderId, outputId) {
    const slider = document.getElementById(sliderId);
    const output = document.getElementById(outputId);

    if (!slider || !output) return;

    output.textContent = slider.value;

    slider.addEventListener('input', () => {
        output.textContent = slider.value;
    });
}

/* =========================================================
   REAL-TIME VALIDATION HELPERS
   ========================================================= */

function showFieldError(input, message) {
    if (!input) return;

    let errorEl = input.parentElement.querySelector('.field-error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'field-error';
        input.parentElement.appendChild(errorEl);
    }

    if (message) {
        errorEl.textContent = message;
        input.classList.add('field-invalid');
        input.classList.remove('field-valid');
    } else {
        errorEl.textContent = '';
        input.classList.remove('field-invalid');
        input.classList.add('field-valid');
    }
}

function validateNameField(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'This field is required.';
    if (!/^[A-Za-zÀ-ž\s'-]+$/.test(trimmed)) {
        return 'Use letters only (spaces, - and \' allowed).';
    }
    return '';
}

function validateEmailField(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Email is required.';
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(trimmed)) {
        return 'Enter a valid email address.';
    }
    return '';
}

function validateAddressField(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Address is required.';
    if (trimmed.length < 5) return 'Address is too short.';
    if (!/[A-Za-z]/.test(trimmed)) return 'Address must contain letters.';
    return '';
}

/**
 * Phone validation for Lithuanian format +370 6xx xxxxx
 */
function validatePhoneField(value) {
    const digits = value.replace(/\D/g, ''); // only digits

    if (!digits) return 'Phone number is required.';

    // Expect 11 digits total: 370 + 8-digit mobile starting with 6
    if (digits.length !== 11 || !digits.startsWith('3706')) {
        return 'Phone must be in Lithuanian format (+370 6xx xxxxx).';
    }

    return '';
}

/**
 * Check if entire form is valid right now (live validation)
 */
function isFormCompletelyValid() {
    const first = validateNameField(document.getElementById('firstName').value);
    const last = validateNameField(document.getElementById('lastName').value);
    const email = validateEmailField(document.getElementById('emailAddress').value);
    const address = validateAddressField(document.getElementById('addressField').value);
    const phone = validatePhoneField(document.getElementById('phoneNumber').value);

    return (!first && !last && !email && !address && !phone);
}

/**
 * Enables or disables the submit button based on form validity
 */
function updateSubmitState() {
    const btn = document.getElementById('submitButton');
    if (!btn) return;

    if (isFormCompletelyValid()) {
        btn.classList.remove('submit-disabled');
        btn.disabled = false;
    } else {
        btn.classList.add('submit-disabled');
        btn.disabled = true;
    }
}

/**
 * Attach real-time validation to Name, Surname, Email, Address
 * Phone is handled separately via masking + submit validation.
 */
function setupRealTimeValidation() {
    const fields = [
        { id: 'firstName', validator: validateNameField },
        { id: 'lastName', validator: validateNameField },
        { id: 'emailAddress', validator: validateEmailField },
        { id: 'addressField', validator: validateAddressField },
    ];

    fields.forEach(({ id, validator }) => {
        const input = document.getElementById(id);
        if (!input) return;

        const handler = () => {
            const error = validator(input.value);
            showFieldError(input, error);
        };

        // Validate as user types and when they leave the field
        input.addEventListener('input', () => {
            handler();
            updateSubmitState();
        });

            input.addEventListener('blur', () => {
            handler();
            updateSubmitState();
        });
    });
}

/**
 * Validate all fields at submit time, reusing same rules.
 */
function validateAllFieldsOnSubmit(form) {
    let allValid = true;

    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('emailAddress');
    const addressInput = document.getElementById('addressField');
    const phoneInput = document.getElementById('phoneNumber');

    const firstErr = validateNameField(firstNameInput.value);
    const lastErr = validateNameField(lastNameInput.value);
    const emailErr = validateEmailField(emailInput.value);
    const addrErr = validateAddressField(addressInput.value);
    const phoneErr = validatePhoneField(phoneInput.value);

    showFieldError(firstNameInput, firstErr);
    showFieldError(lastNameInput, lastErr);
    showFieldError(emailInput, emailErr);
    showFieldError(addressInput, addrErr);
    showFieldError(phoneInput, phoneErr);

    if (firstErr || lastErr || emailErr || addrErr || phoneErr) {
        allValid = false;
    }

    return allValid;
}

/* =========================================================
   PHONE MASKING – +370 6xx xxxxx
   ========================================================= */

function setupPhoneMask() {
  const phoneInput = document.getElementById('phoneNumber');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', () => {
    let digits = phoneInput.value.replace(/\D/g, ''); // keep digits only

    if (!digits) {
      phoneInput.value = '';
      return;
    }

    // Normalize to Lithuanian pattern:
    // allow typing 6..., 86..., 3706..., etc.
    if (digits.startsWith('86')) {
      // 86xxxxxxx -> 3706xxxxxxx
      digits = '370' + digits.slice(1); // drop 8, keep 6xxxxxxx
    } else if (digits.startsWith('6')) {
      // 6xxxxxxx -> 3706xxxxxxx
      digits = '370' + digits;
    } else if (!digits.startsWith('370')) {
      // If user types something odd, just force starting with 370
      digits = '370' + digits;
    }

    // Limit to max 11 digits (370 + 8 digits)
    digits = digits.slice(0, 11);

    // If still typing country code
    if (digits.length <= 3) {
      phoneInput.value = '+' + digits;
      return;
    }

    // Split into +370 6xx xxxxx (after the first 3 digits)
    const rest = digits.slice(3);          // after "370"
    const part1 = rest.slice(0, 3);        // 6xx
    const part2 = rest.slice(3);           // xxxxx

    let formatted = '+370';
    if (part1) formatted += ' ' + part1;
    if (part2) formatted += ' ' + part2;

    phoneInput.value = formatted;
    updateSubmitState();
  });
}

/* =========================================================
   CONTACT FORM SUBMISSION + AVERAGE + POPUP
   ========================================================= */

function setupContactFormHandler() {
    const form = document.querySelector('.php-email-form');
    if (!form) {
        console.warn('php-email-form not found');
        return;
    }

    const output = document.getElementById('form-output');
    const popup = document.getElementById('success-popup');

    form.addEventListener(
        'submit',
        (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();

            const valid = validateAllFieldsOnSubmit(form);
            if (!valid) {
                alert('Please correct the highlighted fields before submitting.');
                return;
            }

            const ratingProject = Number(form.rating_project.value);
            const ratingTimeline = Number(form.rating_timeline.value);
            const ratingBudget = Number(form.rating_budget.value);

            const formData = {
                firstName: form.first_name.value.trim(),
                lastName: form.last_name.value.trim(),
                email: form.email.value.trim(),
                phone: form.phone.value.trim(),
                address: form.address.value.trim(),
                ratingProject,
                ratingTimeline,
                ratingBudget,
            };

            const sum = ratingProject + ratingTimeline + ratingBudget;
            const averageRaw = sum / 3;
            const average = Math.round(averageRaw * 10) / 10;

            let avgClass = 'avg-low';
            if (average > 4 && average <= 7) avgClass = 'avg-mid';
            else if (average > 7) avgClass = 'avg-high';

            console.log('Contact form data:', formData);
            console.log('Average rating:', average);

            if (output) {
                output.innerHTML = `
                <div><strong>Name:</strong> ${formData.firstName}</div>
                <div><strong>Surname:</strong> ${formData.lastName}</div>
                <div><strong>Email:</strong> ${formData.email}</div>
                <div><strong>Phone number:</strong> ${formData.phone}</div>
                <div><strong>Address:</strong> ${formData.address}</div>
                <div><strong>Project clarity (1-10):</strong> ${formData.ratingProject}</div>
                <div><strong>Timeline urgency (1-10):</strong> ${formData.ratingTimeline}</div>
                <div><strong>Budget readiness (1-10):</strong> ${formData.ratingBudget}</div>
                <div class="average-line ${avgClass}">
                    <strong>${formData.firstName} ${formData.lastName}:</strong> ${average}
                </div>
                `;
            }

            if (popup) {
                popup.classList.add('show');
                setTimeout(() => {
                    popup.classList.remove('show');
                }, 3000);
            }
        },
        true
    );
}

/* =========================================================
   MEMORY GAME – DATA, BEST SCORES, TIMER & LOGIC
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  setupMemoryGame();
});

/* Data set: at least 6 unique items using Bootstrap icons */
const MEMORY_ITEMS = [
  { id: 'palette', iconClass: 'bi-palette' },
  { id: 'camera', iconClass: 'bi-camera' },
  { id: 'code', iconClass: 'bi-code-slash' },
  { id: 'phone', iconClass: 'bi-phone' },
  { id: 'cpu', iconClass: 'bi-cpu' },
  { id: 'cloud', iconClass: 'bi-cloud' },
  { id: 'star', iconClass: 'bi-star-fill' },
  { id: 'controller', iconClass: 'bi-controller' },
  { id: 'globe', iconClass: 'bi-globe2' },
  { id: 'music', iconClass: 'bi-music-note-beamed' },
  { id: 'heart', iconClass: 'bi-heart-fill' },
  { id: 'rocket', iconClass: 'bi-rocket-takeoff' }
];

const MEMORY_BEST_KEY = 'memoryBestScoresV1';

function setupMemoryGame() {
  const board = document.getElementById('memory-board');
  if (!board) return; // section not present

  const difficultySelect = document.getElementById('memory-difficulty');
  const movesSpan = document.getElementById('memory-moves');
  const matchesSpan = document.getElementById('memory-matches');
  const winMessageEl = document.getElementById('memory-win-message');
  const startBtn = document.getElementById('memory-start');
  const restartBtn = document.getElementById('memory-restart');
  const timerSpan = document.getElementById('memory-timer');
  const bestEasySpan = document.getElementById('memory-best-easy');
  const bestHardSpan = document.getElementById('memory-best-hard');

  const state = {
    cards: [],
    flippedIndices: [],
    lockBoard: false,
    moves: 0,
    matches: 0,
    totalPairs: 0,
    difficulty: difficultySelect ? difficultySelect.value : 'easy',
    secondsElapsed: 0,
    timerId: null,
    bestScores: {
      easy: null,
      hard: null
    }
  };

  /* ---------- BEST SCORES (localStorage) ---------- */

  function loadBestScores() {
    try {
      const raw = localStorage.getItem(MEMORY_BEST_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || parsed === null) return;

      if (typeof parsed.easy === 'number') state.bestScores.easy = parsed.easy;
      if (typeof parsed.hard === 'number') state.bestScores.hard = parsed.hard;
    } catch (e) {
      console.warn('Could not read memory best scores from localStorage', e);
    }
  }

  function saveBestScores() {
    try {
      localStorage.setItem(MEMORY_BEST_KEY, JSON.stringify(state.bestScores));
    } catch (e) {
      console.warn('Could not save memory best scores to localStorage', e);
    }
  }

  function updateBestDisplay() {
    if (bestEasySpan) {
      bestEasySpan.textContent =
        state.bestScores.easy != null ? `${state.bestScores.easy} moves` : '–';
    }
    if (bestHardSpan) {
      bestHardSpan.textContent =
        state.bestScores.hard != null ? `${state.bestScores.hard} moves` : '–';
    }
  }

  /* ---------- TIMER ---------- */

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    if (timerSpan) {
      timerSpan.textContent = formatTime(state.secondsElapsed);
    }
  }

  function startTimer() {
    stopTimer();
    state.secondsElapsed = 0;
    updateTimerDisplay();

    state.timerId = setInterval(() => {
      state.secondsElapsed += 1;
      updateTimerDisplay();
    }, 1000);
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  /* ---------- GAME SETUP ---------- */

  function chooseItemsForDifficulty(diff) {
    if (diff === 'hard') {
      // 12 pairs (24 cards)
      return MEMORY_ITEMS.slice(0, 12);
    }
    // easy: 6 pairs (12 cards)
    return MEMORY_ITEMS.slice(0, 6);
  }

  function createDeck(diff) {
    const base = chooseItemsForDifficulty(diff);
    const deck = [];
    base.forEach(item => {
      deck.push({ id: item.id, iconClass: item.iconClass });
      deck.push({ id: item.id, iconClass: item.iconClass });
    });
    return shuffleArray(deck);
  }

  function shuffleArray(arr) {
    const array = arr.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function buildBoard() {
    board.innerHTML = '';
    board.classList.toggle('memory-board-easy', state.difficulty === 'easy');
    board.classList.toggle('memory-board-hard', state.difficulty === 'hard');

    state.cards.forEach((cardData, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'memory-card';
      card.dataset.index = index;

      const inner = document.createElement('div');
      inner.className = 'memory-card-inner';

      const front = document.createElement('div');
      front.className = 'memory-card-face memory-card-front';
      front.innerHTML = '<i class="bi bi-grid-3x3-gap-fill"></i>';

      const back = document.createElement('div');
      back.className = 'memory-card-face memory-card-back';
      back.innerHTML = `<i class="bi ${cardData.iconClass}"></i>`;

      inner.appendChild(front);
      inner.appendChild(back);
      card.appendChild(inner);
      board.appendChild(card);

      card.addEventListener('click', onCardClick);
    });
  }

  function resetStats() {
    state.moves = 0;
    state.matches = 0;
    state.flippedIndices = [];
    state.lockBoard = false;
    state.totalPairs = state.cards.length / 2;
    updateStats();
    clearWinMessage();
    stopTimer();
    updateTimerDisplay();
  }

  function updateStats() {
    if (movesSpan) movesSpan.textContent = state.moves;
    if (matchesSpan) {
      matchesSpan.textContent = `${state.matches} / ${state.totalPairs}`;
    }
  }

  function showWinMessage() {
    if (!winMessageEl) return;
    winMessageEl.textContent = `Great job! You matched all pairs in ${state.moves} moves and ${formatTime(
      state.secondsElapsed
    )}.`;
  }

  function clearWinMessage() {
    if (!winMessageEl) return;
    winMessageEl.textContent = '';
  }

  /* ---------- CARD CLICK / MATCHING ---------- */

  function onCardClick(event) {
    const card = event.currentTarget;
    const index = Number(card.dataset.index);

    if (state.lockBoard) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
      return;
    }

    card.classList.add('flipped');
    state.flippedIndices.push(index);

    if (state.flippedIndices.length === 2) {
      state.lockBoard = true;
      state.moves += 1;
      updateStats();
      checkForMatch();
    }
  }

  function checkForMatch() {
    const [idx1, idx2] = state.flippedIndices;
    const card1 = board.querySelector(`.memory-card[data-index="${idx1}"]`);
    const card2 = board.querySelector(`.memory-card[data-index="${idx2}"]`);

    if (!card1 || !card2) {
      state.flippedIndices = [];
      state.lockBoard = false;
      return;
    }

    const id1 = state.cards[idx1].id;
    const id2 = state.cards[idx2].id;

    if (id1 === id2) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      state.matches += 1;
      state.flippedIndices = [];
      state.lockBoard = false;
      updateStats();

      if (state.matches === state.totalPairs) {
        handleWin();
      }
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        state.flippedIndices = [];
        state.lockBoard = false;
      }, 900);
    }
  }

  function handleWin() {
    stopTimer();
    showWinMessage();

    const diff = state.difficulty;
    const currentBest = state.bestScores[diff];

    if (currentBest == null || state.moves < currentBest) {
      state.bestScores[diff] = state.moves;
      saveBestScores();
      updateBestDisplay();
    }
  }

  function initGame() {
    state.difficulty = difficultySelect ? difficultySelect.value : 'easy';
    state.cards = createDeck(state.difficulty);
    buildBoard();
    resetStats();
  }

  /* ---------- EVENT BINDINGS ---------- */

  if (difficultySelect) {
    difficultySelect.addEventListener('change', () => {
      initGame();
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      initGame();
      startTimer();
      startBtn.disabled = true;
      if (restartBtn) restartBtn.disabled = false;
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      initGame();
      clearWinMessage();
      startTimer();
    });
  }

  /* ---------- INITIALIZATION ---------- */

  loadBestScores();
  updateBestDisplay();
  initGame(); // show board on page load (timer starts only when Start clicked)
}

/* ============================================
   BULB IMAGE + TEXT SWITCH
============================================ */

function setupBulbControl() {
  const toggle = document.getElementById('bulb-toggle');
  const bulbImage = document.getElementById('bulb-image');
  const bulbText = document.getElementById('bulb-text');

  if (!toggle || !bulbImage || !bulbText) return;

  // Default state
  bulbImage.src = "assets/img/bulb-off.png";
  bulbText.textContent = "Bulb Off";

  toggle.addEventListener('change', () => {
    if (toggle.checked) {
      bulbImage.src = "assets/img/bulb-on.png";
      bulbText.textContent = "Bulb On";
    } else {
      bulbImage.src = "assets/img/bulb-off.png";
      bulbText.textContent = "Bulb Off";
    }
  });
}