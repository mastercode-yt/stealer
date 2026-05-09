// Game Variables
let totalMoney = 1000;
let secretNumber = 0;
let betAmount = 50;
let gameActive = false;
const MAX_BET = 999;
const MIN_BET = 10;

// Stats tracking
let stats = {
    totalStolen: 0,
    heistsCompleted: 0,
    gamesWon: 0
};

// Load data from localStorage when page loads
window.addEventListener('load', () => {
    loadMoney();
    loadStats();
    updateMoneyDisplay();
    updateStatsDisplay();
});

// Load money from localStorage
function loadMoney() {
    const saved = localStorage.getItem('stealMoney');
    if (saved) {
        totalMoney = parseInt(saved);
    }
}

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('stealStats');
    if (saved) {
        stats = JSON.parse(saved);
    }
}

// Save money to localStorage
function saveMoney() {
    localStorage.setItem('stealMoney', totalMoney);
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('stealStats', JSON.stringify(stats));
}

// Update money display
function updateMoneyDisplay() {
    const moneyElement = document.getElementById('totalMoney');
    if (moneyElement) {
        moneyElement.textContent = '$' + totalMoney.toLocaleString();
    }
}

// Update stats display
function updateStatsDisplay() {
    document.getElementById('totalStolen').textContent = '$' + stats.totalStolen.toLocaleString();
    document.getElementById('heistsCount').textContent = stats.heistsCompleted;
    document.getElementById('gamesWon').textContent = stats.gamesWon;
}

// Start heist animation
function startHeist() {
    // Generate random stolen amount between $10 and $999
    const stolenAmount = Math.floor(Math.random() * (MAX_BET - MIN_BET + 1)) + MIN_BET;
    
    // Add to current money
    totalMoney += stolenAmount;
    stats.totalStolen += stolenAmount;
    stats.heistsCompleted++;
    
    // Save data
    saveMoney();
    saveStats();
    
    // Show heist result
    document.getElementById('heistResult').style.display = 'block';
    document.getElementById('stolenAmount').textContent = '$' + stolenAmount;
    
    // Play heist animation
    playHeistAnimation();
    
    // Update stats
    updateStatsDisplay();
    
    // After animation, allow playing the game
    setTimeout(() => {
        const playGame = confirm('You stole $' + stolenAmount + '! Now play STEAL? to keep it?\n\nClick OK to play!');
        if (playGame) {
            startGame(stolenAmount);
        } else {
            resetHeistScreen();
        }
    }, 3000);
}

// Play heist animation
function playHeistAnimation() {
    const thief = document.getElementById('thief');
    const policeCar = document.getElementById('policeCar');
    
    // Reset animations
    thief.style.animation = 'none';
    policeCar.style.animation = 'none';
    
    // Trigger reflow to restart animation
    void thief.offsetWidth;
    void policeCar.offsetWidth;
    
    // Restart animation
    thief.style.animation = 'thiefRun 2s infinite';
    policeCar.style.animation = 'policePursue 2s infinite';
}

// Reset heist screen
function resetHeistScreen() {
    document.getElementById('heistResult').style.display = 'none';
    updateMoneyDisplay();
}

// View stats
function viewStats() {
    const statsDisplay = document.getElementById('statsDisplay');
    if (statsDisplay.style.display === 'none') {
        statsDisplay.style.display = 'block';
    } else {
        statsDisplay.style.display = 'none';
    }
}

// Reset stats
function resetStats() {
    if (confirm('Reset all stats?')) {
        stats = {
            totalStolen: 0,
            heistsCompleted: 0,
            gamesWon: 0
        };
        totalMoney = 1000;
        saveMoney();
        saveStats();
        updateMoneyDisplay();
        updateStatsDisplay();
        alert('Stats reset!');
    }
}

// Switch screens
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Start game
function startGame(heistAmount) {
    if (totalMoney < MIN_BET) {
        alert('You need at least $' + MIN_BET + ' to play!');
        return;
    }

    // Generate random bet amount between $10 and min(totalMoney, $999)
    betAmount = Math.floor(Math.random() * Math.min(totalMoney - 1, MAX_BET - MIN_BET)) + MIN_BET;

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
        stats.gamesWon++;
        resultDiv.innerHTML = `<div class="result-text result-win">🎉 YOU WON! +$${betAmount}</div>`;
        document.getElementById('gameStatus').textContent = 'Success! You kept the money!';
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
        saveStats();
        updateMoneyDisplay();
        updateStatsDisplay();
        setTimeout(() => {
            const playAgain = confirm('Play another round?');
            if (playAgain) {
                backToMain();
                setTimeout(() => {
                    startHeist();
                }, 500);
            } else {
                backToMain();
            }
        }, 1500);
    }
}

// Handle Enter key
document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guessInput');
    if (guessInput) {
        guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                makeGuess();
            }
        });
    }
});

// Back to main screen
function backToMain() {
    gameActive = false;
    switchScreen('mainScreen');
    resetHeistScreen();
    updateMoneyDisplay();
}
