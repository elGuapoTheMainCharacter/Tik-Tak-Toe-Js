
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
        if (checkWin(playerSide)) {
          alert(`Player ${playerSide} wins!`);
          setTimeout(resetGame, 1000);
        } else if (isBoardFull()) {
          alert("It's a draw!");
          setTimeout(resetGame, 1000);
        } else {
          if (gameMode === 'twoPlayers') {
            playerTurn = !playerTurn; // switch player
            playerSide = playerSide === 'X' ? 'O' : 'X'; // switch side
            whoAreYou.innerHTML = `Player ${playerSide}'s turn`;
          } else {
            playerTurn = false;
            setTimeout(robotMove, 500); // add a delay before the bot's move
          }
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
  playerSide = 'X';
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
      setTimeout(() => alert(`Bot ${botSide} wins!`), 300);
      setTimeout(resetGame, 1000);
    } else if(isBoardFull()){
      setTimeout(() => alert("It's a draw!"), 300);
      setTimeout(resetGame, 1000);
    } else {
      playerTurn = true; // switch back to player's turn
    }
  }
}

function mediumBotMove(){
  //medium bot, tries to win or block player's win
  for(let i = 0; i < boxes.length; i++){
    if(boxes[i].innerText === ''){
      boxes[i].innerText = botSide;
      if(checkWin(botSide)){
        setTimeout(() => alert(`Bot ${botSide} wins!`), 300);
        setTimeout(resetGame, 1000);
        return;
      }
      boxes[i].innerText = '';
    }
  }
  for(let i = 0; i < boxes.length; i++){
    if(boxes[i].innerText === ''){
      boxes[i].innerText = playerSide;
      if(checkWin(playerSide)){
        boxes[i].innerText = botSide;
        playerTurn = true;
        return;
      }
      boxes[i].innerText = '';
    }
  }
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
    if(isBoardFull()){
      setTimeout(() => alert("It's a draw!"), 300);
      setTimeout(resetGame, 1000);
    } else {
      playerTurn = true; // switch back to player's turn
    }
  }
}

function advancedBotMove(){
  //advanced bot, tries to win or block player's win, and play center
  if(boxes[4].innerText === ''){
    boxes[4].innerText = botSide;
    playerTurn = true;
    return;
  }
  for(let i = 0; i < boxes.length; i++){
    if(boxes[i].innerText === ''){
      boxes[i].innerText = botSide;
      if(checkWin(botSide)){
        setTimeout(() => alert(`Bot ${botSide} wins!`), 300);
        setTimeout(resetGame, 1000);
        return;
      }
      boxes[i].innerText = '';
    }
  }
  for(let i = 0; i < boxes.length; i++){
    if(boxes[i].innerText === ''){
      boxes[i].innerText = playerSide;
      if(checkWin(playerSide)){
        boxes[i].innerText = botSide;
        playerTurn = true;
        return;
      }
      boxes[i].innerText = '';
    }
  }
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
    if(isBoardFull()){
      setTimeout(() => alert("It's a draw!"), 300);
      setTimeout(resetGame, 1000);
    } else {
      playerTurn = true; // switch back to player's turn
    }
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
  chooseSide.style.display = "flex";
   }
