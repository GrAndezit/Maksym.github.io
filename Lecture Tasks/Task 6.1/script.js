const buttons = document.querySelectorAll('.btn[data-choice]');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const drawsEl = document.getElementById('draws');
const resultText = document.getElementById('resultText');
const reasonText = document.getElementById('reasonText');
const computerCircle = document.getElementById('computerCircle');
const computerImage = document.getElementById('computerImage');
const resetBtn = document.getElementById('resetBtn');

let playerScore = 0;
let computerScore = 0;
let draws = 0;

// image folder paths
const imagePath = "images/";

const icons = {
  rock: imagePath + "rock.png",
  paper: imagePath + "paper.png",
  scissors: imagePath + "scissors.png",
  lizard: imagePath + "lizard.png",
  spock: imagePath + "spock.png"
};

// all choices
const choices = Object.keys(icons);

// win rules
const outcomes = {
  "rock-scissors": "Rock crushes Scissors.",
  "rock-lizard": "Rock crushes Lizard.",
  "paper-rock": "Paper covers Rock.",
  "paper-spock": "Paper disproves Spock.",
  "scissors-paper": "Scissors cuts Paper.",
  "scissors-lizard": "Scissors decapitates Lizard.",
  "lizard-spock": "Lizard poisons Spock.",
  "lizard-paper": "Lizard eats Paper.",
  "spock-scissors": "Spock smashes Scissors.",
  "spock-rock": "Spock vaporizes Rock."
};

function showComputerChoice(choice) {
  computerImage.src = icons[choice];
  computerImage.alt = choice;

  computerCircle.classList.add("animate");
  setTimeout(() => computerCircle.classList.remove("animate"), 200);
}

function getComputerChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

function clearSelections() {
  buttons.forEach(btn => {
    btn.classList.remove("selected");
    btn.classList.remove("computer");
  });
}

function playRound(playerChoice) {
  const computerChoice = getComputerChoice();
  showComputerChoice(computerChoice);

  clearSelections();

  document.querySelector(`.btn[data-choice="${playerChoice}"]`).classList.add("selected");
  document.querySelector(`.btn[data-choice="${computerChoice}"]`).classList.add("computer");

  if (playerChoice === computerChoice) {
    resultText.textContent = "It's a draw";
    reasonText.textContent = "";
    draws++;
  } else if (outcomes[`${playerChoice}-${computerChoice}`]) {
    resultText.textContent = "You win";
    reasonText.textContent = outcomes[`${playerChoice}-${computerChoice}`];
    playerScore++;
  } else {
    resultText.textContent = "You lose";
    reasonText.textContent = outcomes[`${computerChoice}-${playerChoice}`];
    computerScore++;
  }

  updateScoreboard();
}

function updateScoreboard() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
  drawsEl.textContent = draws;
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    playRound(btn.getAttribute("data-choice"));
  });
});

resetBtn.addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  draws = 0;
  updateScoreboard();

  resultText.textContent = "Choose your move.";
  reasonText.textContent = "";

  clearSelections();

  computerImage.src = "";
  computerCircle.style.background = "#ccc";
});