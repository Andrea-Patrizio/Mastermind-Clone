/* 
 Author: Andrea P. Patella
 Front-end Developer
 Javascript file
 */

// VARIABLES & ARRAYS **********************************************************
const colors = [
    '#1ebf18',
    '#dd3333',
    '#dee516',
    '#1a87db',
    '#ea8425'
];
let gameColors = [];
let level = 3;
let userArray = [];
let selected = 0;
let row = 1;
let seconds = 0;
let matchColor = 0;
let matchColorPosition = 0;

// TIMER ***********************************************************************
const minField = document.getElementById('minutes');
const secField = document.getElementById('seconds');
let begin; // Set global time interval

// Start timer
const startTimer = function () {
    console.log('Start timer');
    begin = window.setInterval(counter, 1000);
};

// Reset timer
const resetTimer = function () {
    console.log('Reset timer');
    window.clearInterval(begin);
    seconds = 0;
    secField.textContent = '000';
    begin = window.setInterval(counter, 1000);
};

// Set seconds field and rating stars
const counter = function () {
    seconds++;
    if (seconds < 10) { // Set seconds field
        secField.textContent = '00' + seconds;
    } else if (seconds >= 10 && seconds < 100) {
        secField.textContent = '0' + seconds;
    } else {
        secField.textContent = seconds;
    }
    if (seconds === 666) { // Time's up
        endGame(2);
    }
};

// DIFFICULTY LEVEL SELECTION **************************************************
const levelSelection = document.querySelectorAll('.level');
levelSelection.forEach(function (lev) {
    lev.addEventListener('click', function () {
        let getLevel = lev.dataset.level; // Read data-level attribute of HTML tag
        level = getLevel;
        resetGame();
    });
});

// RANDOMIZE COLORS ************************************************************
function randomColors(level) {
    let arrayCut = colors.slice(0, level);
    for (let i = 0; i < 4; i++) {
        let index = Math.floor(Math.random() * level);
        gameColors.push(arrayCut[index]);
    }
    buttonsCreation(arrayCut);
    console.log(gameColors);
}

// CREATE BUTTONS **************************************************************
function buttonsCreation(array) {
    const buttons = document.querySelector('#buttons');
    const selections = document.querySelector('#USERcolors');
    array.forEach(function (color) {
        let but = document.createElement('li');
        but.className = 'button';
        but.style.backgroundColor = color;
        buttons.appendChild(but);
        but.addEventListener('click', function () {
            selected++;
            let sel = document.querySelector('.row' + row + ' .hole' + selected);
            let token = document.createElement('span');
            token.className = 'color';
            token.style.backgroundColor = color;
            sel.appendChild(token);
            userArray.push(color);
            if (selected === 4) {
                compareArrays();
                userArray = [];
                selected = 0;
                row++;
            }
        });
    });
}
// DELETE TOKENS AND HINTS *****************************************************
function deleteAllColors() {
    for (let i = 1; i <= 10; i++) {
        let rows = document.querySelectorAll('.hole');
        let hints = document.querySelectorAll('.hint');
        rows.forEach(function (element) {
            if (element.hasChildNodes()) {
                element.removeChild(element.firstChild);
            }
        });
        hints.forEach(function (element) {
            if (element.hasChildNodes()) {
                element.removeChild(element.firstChild);
            }
        });
    }
    row = 1;
    selected = 0;
    matchColor = 0;
    matchColorPosition = 0;
}

// CREATE ROWS OF HOLES ********************************************************
function createRows() {
    const board = document.querySelector('#board');
    for (let r = 10; r >= 1; r--) {
        let row = document.createElement('div');
        row.classList.add('row', 'row' + r);
        board.appendChild(row);
        for (let h = 1; h <= 4; h++) {
            let hole = document.createElement('div');
            hole.classList.add('hole', 'hole' + h);
            row.appendChild(hole);
        }
        let hint = document.createElement('div');
        hint.classList.add('hint' + r, 'hint');
        row.appendChild(hint);
    }
}
function AiRowCreation() {
    const deck = document.querySelector('#AIcolors');
    gameColors.forEach(function (color) {
        let li = document.createElement('li');
        li.style.backgroundColor = color;
        deck.appendChild(li);
    });
}

// COMPARING COLORS ************************************************************
function compareArrays() {
    let tempArray = gameColors.slice(0); // Copying computer colors array
    for (let i = 0; i < 4; i++) { // First checking position and color matching
        if (gameColors[i] === userArray[i]) {
            userArray[i] = 'userMatchCP';
            tempArray[i] = 'computerMatchCP';
            matchColorPosition++;
        }
    }
    userArray.forEach(function (colorU, indexU) { // Second checking just color matching
        for (let i = 0; i < 4; i++) {
            if (colorU === tempArray[i]) {
                userArray[indexU] = 'userMatchC';
                tempArray[i] = 'computerMatchC';
                matchColor++;
                break;
            }
        }
        ;
    });
    displayHint(matchColorPosition, matchColor);
}

// DISPLAY HINTS ***************************************************************
function displayHint(cp, c) {
    const hints = document.querySelector('.hint' + row);
    for (let a = 1; a <= cp; a++) {
        let span = document.createElement('span');
        span.className = 'cpMatch';
        hints.appendChild(span);
    }
    for (let b = 1; b <= c; b++) {
        let span = document.createElement('span');
        span.className = 'cMatch';
        hints.appendChild(span);
    }
    if (matchColorPosition === 4) {
        endGame(1);
    } else {
        matchColor = 0;
        matchColorPosition = 0;
    }
}

// END GAME ********************************************************************
function endGame(cond) {
    window.clearInterval(begin); // Stop timer
    const title = document.getElementById('title');
    const rate = document.getElementById('rating');
    if (cond === 1) { // Winning the game
        title.textContent = 'Congratulations, you won the game!';
        rate.innerHTML = 'You finished the game in <strong>' + seconds +
                ' seconds</strong>.';
    } else if (cond === 2) { // Time's up
        title.textContent = 'You reached 666 seconds';
        rate.innerHTML = 'I\'m sorry, you didn\'t take this game seriously enough.<br>' +
                'So Satan decided to <strong>take your soul</strong> to hell!';
        rate.innerHTML += '<img src="img/satan.jpg" class="satan">';
    }
    document.getElementById('modal').className = ('on'); // Display end game modal window
}

// SET *************************************************************************
function gameSet() {
    randomColors(level);
    createRows();
    startTimer();
}

// RESET ***********************************************************************
var reset = document.querySelectorAll('.restart');
reset.forEach(function (button) {
    button.addEventListener('click', resetGame);
});
function resetGame() {
    document.getElementById('modal').className = (''); // Hide winner popup
    const allButtons = document.querySelectorAll('.button');
    allButtons.forEach(function (button) { // Remove all cards
        button.remove();
    });
    gameColors = [];
    randomColors(level);
    deleteAllColors();
    resetTimer();
}
gameSet();