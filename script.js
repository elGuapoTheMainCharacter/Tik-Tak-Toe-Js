let sideChosen = false;
let changeColor = document.getElementById("chooseSide");
let playTable = document.getElementById("playTable");
let whoAreYou = document.getElementById("whoAreYou");
let chooseX = document.getElementById("chooseX");
let chooseO = document.getElementById("chooseO");
let difficulty = null;
let playerTurn = true;
let gameMode = null;
let playerSide = null;
let botSide = null;
let difficultyDiv = document.getElementById("difficulty");
playTable.style.display = "none"; //hide the play table
difficultyDiv.style.display = "none"; //hide the difficulty div
let boxes = document.querySelectorAll('td');

// Winning combinations
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

//when a box is clicked,the actual playing
boxes.forEach(box => {
  box.addEventListener('click', function() {
    if (sideChosen && playerTurn) {
      if (this.innerText === '') {
        this.innerText = playerSide;
        playerTurn = false;
        if (checkWin(playerSide)) {
          alert(`Player ${playerSide} wins!`);
          resetGame();
        } else if (gameMode !== 'twoPlayers') {
          setTimeout(robotMove, 500); // add a delay before the bot's move
        }
      }
    }
  });
});

if (changeColor) {
  changeColor.addEventListener('click', function(event) {
    if (event.target.id === "chooseX") {
      chooseX.style.background = "blue";
      chooseO.style.background = "white";
      playerSide = 'X';
      botSide = 'O';
      sideChosen = true;
      difficultyDiv.style.display = "block";
      chooseSide.style.display = "none";
      whoAreYou.innerHTML = "Choose Mode";
    } else if (event.target.id === "chooseO") {
      chooseO.style.background = "blue";
      chooseX.style.background = "white";
      playerSide = 'O';
      botSide = 'X';
      sideChosen = true;
      difficultyDiv.style.display = "block";
      chooseSide.style.display = "none";
      whoAreYou.innerHTML = "Choose Mode";
    }
  });
}

document.getElementById('low').addEventListener('click', () => {
  difficulty = 'low';
  gameMode = 'robot';
  startGame();
});

document.getElementById('medium').addEventListener('click', () => {
  difficulty = 'medium';
  gameMode = 'robot';
  startGame();
});

document.getElementById('advanced').addEventListener('click', () => {
  difficulty = 'advanced';
  gameMode = 'robot';
  startGame();
});

document.getElementById('twoPlayers').addEventListener('click', () => {
  gameMode = 'twoPlayers';
  startGame();
});

function startGame() {
  setTimeout(() => {
    //chooseSide.style.display = "none";
    difficultyDiv.style.display = "none";
    whoAreYou.innerHTML = "Let's play";
    playTable.style.display = "block";
    setTimeout(() => {
      playTable.classList.add('show');
    }, 10);
  }, 200);
}

function robotMove(){
  if((gameMode==="robot")){
    if(difficulty === 'low'){
      lowBotMove();
    } else if(difficulty === 'medium'){
      mediumBotMove();
    } else if(difficulty === 'advanced'){
      advancedBotMove();
    }
  }
}

function lowBotMove(){
  //weak bot,chooses randomly
  let emptyBoxes = [];
  boxes.forEach(box => {
    if (box.innerText === '') {
      emptyBoxes.push(box);
    }
  });
  if (emptyBoxes.length > 0) {
    let randomIndex = Math.floor(Math.random() * emptyBoxes.length);
    let randomBox = emptyBoxes[randomIndex];
    randomBox.innerText = botSide;
    if (checkWin(botSide)) {
      alert(`Bot ${botSide} wins!`);
      resetGame();
    } else {
      playerTurn = true; // switch back to player's turn
    }
  }
}

function mediumBotMove(){
  //medium bot, sometimes wins, sometimes loses
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].innerText === '') {
      boxes[i].innerText = botSide;
      let score = minimax(boxes, 0, false);
      boxes[i].innerText = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  boxes[bestMove].innerText = botSide;
  if (checkWin(botSide)) {
    alert(`Bot ${botSide} wins!`);
    resetGame();
  } else {
    playerTurn = true; // switch back to player's turn
  }
}

function advancedBotMove(){
  //advanced bot, never loses
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].innerText === '') {
      boxes[i].innerText = botSide;
      let score = minimax(boxes, 0, false);
      boxes[i].innerText = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  boxes[bestMove].innerText = botSide;
  if (checkWin(botSide)) {
    alert(`Bot ${botSide} wins!`);
    resetGame();
  } else if(isBoardFull()){
    alert("It's a draw!");
    resetGame();
  } else {
    playerTurn = true; // switch back to player's turn
  }
}

function minimax(boxes, depth, isMaximizing) {
  if (checkWin(botSide)) {
    return 1;
  } else if (checkWin(playerSide)) {
    return -1;
  } else if (isBoardFull()) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].innerText === '') {
        boxes[i].innerText = botSide;
        let score = minimax(boxes, depth + 1, false);
        boxes[i].innerText = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].innerText === '') {
        boxes[i].innerText = playerSide;
        let score = minimax(boxes, depth + 1, true);
        boxes[i].innerText = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function isBoardFull(){
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].innerText === '') {
      return false;
    }
  }
  return true;
}

function checkWin(side) {
  for (let combination of winningCombinations) {
    if (boxes[combination[0]].innerText === side &&
        boxes[combination[1]].innerText === side &&
        boxes[combination[2]].innerText === side) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  boxes.forEach(box => {
    box.innerText = '';
  });
  playerTurn = true;
  sideChosen = false;
  difficulty = null;
  gameMode = null;
  playerSide = null;
  botSide = null;
  playTable.style.display = "none";
  difficultyDiv.style.display = "none";
  whoAreYou.innerHTML = "Choose Side";
  chooseX.style.background = "white";
  chooseO.style.background = "white";
  chooseSide.style.display = "block";
}
