// Game Variables
let totalMoney = 1000;
let secretNumber = 0;
let betAmount = 50;
let gameActive = false;
const MAX_BET = 999;

// Load money from localStorage when page loads
window.addEventListener('load', () => {
    loadMoney();
    updateMoneyDisplay();
});

// Load money from localStorage
function loadMoney() {
    const saved = localStorage.getItem('stealMoney');
    if (saved) {
        totalMoney = parseInt(saved);
    }
}

// Save money to localStorage
function saveMoney() {
    localStorage.setItem('stealMoney', totalMoney);
}

// Update money display
function updateMoneyDisplay() {
    const moneyElement = document.getElementById('totalMoney');
    moneyElement.textContent = '$' + totalMoney.toLocaleString();
}

// Switch screens
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Start game
function startGame() {
    if (totalMoney < 10) {
        alert('You need at least $10 to play!');
        return;
    }

    // Generate random bet amount between $10 and min(totalMoney, $999)
    betAmount = Math.floor(Math.random() * Math.min(totalMoney - 1, MAX_BET - 9)) + 10;

    // Generate secret number
    secretNumber = Math.floor(Math.random() * 999) + 1;
    gameActive = true;

    // Update game display
    document.getElementById('betAmount').textContent = '$' + betAmount;
    document.getElementById('gameResult').innerHTML = '';
    document.getElementById('guessInput').value = '';
    document.getElementById('gameStatus').textContent = 'Guess the number to win!';

    // Switch to game screen
    switchScreen('gameScreen');

    // Focus on input
    document.getElementById('guessInput').focus();
}

// Make guess
function makeGuess() {
    if (!gameActive) {
        alert('Game over! Go back to main screen.');
        return;
    }

    const guess = parseInt(document.getElementById('guessInput').value);

    // Validate input
    if (isNaN(guess) || guess < 1 || guess > 999) {
        alert('Please enter a number between 1 and 999!');
        return;
    }

    const resultDiv = document.getElementById('gameResult');

    if (guess === secretNumber) {
        // Win!
        totalMoney += betAmount;
        resultDiv.innerHTML = `<div class="result-text result-win">🎉 YOU WON! +$${betAmount}</div>`;
        document.getElementById('gameStatus').textContent = 'Success! You stole the money!';
        gameActive = false;
    } else if (guess < secretNumber) {
        // Too low
        resultDiv.innerHTML = `<div class="result-text">📉 Too low! Try a higher number.</div>`;
    } else if (guess > secretNumber) {
        // Too high
        resultDiv.innerHTML = `<div class="result-text">📈 Too high! Try a lower number.</div>`;
    }

    // Clear input
    document.getElementById('guessInput').value = '';
    document.getElementById('guessInput').focus();

    // If won, show option to play again or go back
    if (!gameActive) {
        saveMoney();
        updateMoneyDisplay();
        setTimeout(() => {
            const playAgain = confirm('Play another round?');
            if (playAgain) {
                startGame();
            } else {
                backToMain();
            }
        }, 1500);
    }
}

// Handle Enter key
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('guessInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            makeGuess();
        }
    });
});

// Back to main screen
function backToMain() {
    gameActive = false;
    switchScreen('mainScreen');
    updateMoneyDisplay();
}

// Reset money
function resetMoney() {
    if (confirm('Reset your money to $1,000?')) {
        totalMoney = 1000;
        saveMoney();
        updateMoneyDisplay();
    }
}
