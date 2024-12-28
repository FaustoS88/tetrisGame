const gameBoard = document.getElementById('gameBoard');
const width = 10;
const height = 20;
let squares = [];
let currentPosition = 4;
let currentRotation = 0;
let timerId;
const colors = [
    '#3498db',
    '#e74c3c',
    '#2ecc71',
    '#f1c40f',
    '#9b59b6',
    '#34495e',
    '#1abc9c'
];

// The Tetrominoes
const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];

const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
];

const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];

const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

// Randomly select a Tetromino and its first rotation
let random = Math.floor(Math.random() * theTetrominoes.length);
let current = theTetrominoes[random][currentRotation];
let nextRandom = 0;

// Audio Elements
const backgroundMusic = document.getElementById('backgroundMusic');
const gameOverSound = document.getElementById('gameOverSound');

// Draw the Tetromino
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
        squares[currentPosition + index].style.backgroundColor = colors[random];
    });
}

// Undraw the Tetromino
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
        squares[currentPosition + index].style.backgroundColor = '';
    });
}

// Make the Tetromino move down every second
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

// Freeze function
function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken') || currentPosition + index + width >= width * height)) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        current = theTetrominoes[random][currentRotation];
        currentPosition = 4;
        draw();
        addScore();
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            gameOver();
        }
    }
}

// Move the tetromino left, unless it is at the edge or there is a blockage
function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge) currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }
    draw();
}

// Move the tetromino right, unless it is at the edge or there is a blockage
function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtRightEdge) currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }
    draw();
}

// Rotate the tetromino
function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) { // If the current rotation gets to 4, make it go back to 0
        currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
}

// Show up-next tetromino in mini-grid display
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;

// The Tetrominos without rotations
const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
];

// Display the shape in the mini-grid display
function displayShape() {
    // Remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
    });
    upNextTetrominoes[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('tetromino');
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
}

// Add functionality to the button
function startGame() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    } else {
        resetGame();
        draw();
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayShape();
        console.log('Playing background music');
        backgroundMusic.play();
    }
}

// Reset the game state
function resetGame() {
    squares.forEach(square => {
        square.classList.remove('tetromino', 'taken');
        square.style.backgroundColor = '';
    });
    currentPosition = 4;
    currentRotation = 0;
    random = Math.floor(Math.random() * theTetrominoes.length);
    current = theTetrominoes[random][currentRotation];
    score = 0;
    scoreDisplay.innerHTML = 'Score: 0';
}

// Add score
const scoreDisplay = document.getElementById('score');
let score = 0;

function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreDisplay.innerHTML = 'Score: ' + score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => gameBoard.appendChild(cell));
        }
    }
}

// Game Over
function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'Game Over';
        clearInterval(timerId);
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0; // Reset the music to the beginning
        gameOverSound.play();
    }
}

// Create Board
function createBoard() {
    for (let i = 0; i < width * height; i++) {
        const square = document.createElement('div');
        square.classList.add('cell');
        gameBoard.appendChild(square);
        squares.push(square);
    }

    // Create the bottom row of the board
    for (let i = 0; i < width; i++) {
        const square = document.createElement('div');
        square.classList.add('taken');
        gameBoard.appendChild(square);
        squares.push(square);
    }
}

createBoard();

// Assign functions to keyCodes
function control(e) {
    if (e.keyCode === 37) {
        moveLeft();
    } else if (e.keyCode === 38) {
        rotate();
    } else if (e.keyCode === 39) {
        moveRight();
    } else if (e.keyCode === 40) {
        moveDown();
    }
}
document.addEventListener('keyup', control);

// Toggle Music Function
function toggleMusic() {
    if (backgroundMusic.paused) {
        console.log('Playing background music');
        backgroundMusic.play();
    } else {
        console.log('Pausing background music');
        backgroundMusic.pause();
    }
}