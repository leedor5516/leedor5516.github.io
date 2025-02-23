var playerTurn = "x";
var turnDict = {"x":"o","o":"x"};
var valueDict = {"x": 1, "o": -1};
var board = [["","",""],["","",""],["","",""]];
var canvas;
var ctx;
var width;
var height;
var canvasTop;
var canvasLeft;
var test = 0;


document.addEventListener("DOMContentLoaded", function() {
    
    canvas = document.getElementById("game-board");
    ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvasTop = rect.top + window.scrollY;
    canvasLeft = rect.left + window.scrollX;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    drawGrid(width/2,height/2,width*0.5)
});

function drawLine(x1,y1,x2,y2){
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
}

function drawX(x,y,scale){
    drawLine(x - scale/2 ,y - scale/2 ,x + scale/2,y+scale/2);
    drawLine(x + scale/2 ,y - scale/2 ,x - scale/2,y+scale/2);
}

function drawGrid(x,y,scale){
    drawLine(x-scale,y+scale/3,x+scale,y+scale/3);
    drawLine(x-scale,y-scale/3,x+scale,y-scale/3);

    drawLine(x-scale/3,y-scale,x-scale/3,y+scale);
    drawLine(x+scale/3,y-scale,x+scale/3,y+scale);
}

function drawCircle(x,y,d){
    ctx.beginPath();
    ctx.arc(x, y, d/2, 0, 2 * Math.PI);
    ctx.stroke();
}

function moveValid(boxx,boxy,board){
    if (board[boxy][boxx] != ""){
        return false
    }
    return true
}

function doMove(boxx,boxy,board){
    board[boxy][boxx] = playerTurn;
    playerTurn = turnDict[playerTurn];
    document.getElementById("status text").innerText = `it is ${playerTurn}\'s turn`;

}

function drawBoard(board){
    ctx.clearRect(0,0,width,height);
    drawGrid(width/2,height/2,width*0.5);
    for (let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            let locx = j * width/3 + width/6;
            let locy = i * height/3 + height/6;
            if(board[i][j] == "x"){
                drawX(locx,locy,width/3.5)
            }
            if(board[i][j] == "o"){
                drawCircle(locx,locy,width/3.5)
            }
            else{
            }
        }
    }
}

function playerWin(board,player){ // checks both if the game is ended and what value the ended game would be

    for (let i = 0; i < board.length; i++){
        if(board[i][0] === player && board[i][1] === player && board[i][2] === player){
            return true
        }

        if(board[0][i] === player && board[1][i] === player && board[2][i] === player){
            return true
        }
    }

    if(board[0][0] === player && board[1][1] === player && board[2][2] === player){
        return true
    }

    if(board[0][2] === player && board[1][1] === player && board[2][0] === player){
        return true
    }

    return false;
}

function isTie(board){
    if(playerWin(board,'x') || playerWin(board,'o')){
        return false
    }
    for (let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(board[i][j] == ""){
                return false
            }
        }
    }
    return true
}

function gameEnded(board){
    if(playerWin(board,'x') || playerWin(board,'o')){
        return true
    }
    for (let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(board[i][j] == ""){
                return false
            }
        }
    }
    return true
}

function evaluateBoard(board, playerTurn) {
    if (!gameEnded(board)) {
        let value; 

        if (playerTurn === "x") {
            value = -Infinity; // Fixed capitalization
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (moveValid(j, i, board)) {
                        value = Math.max(value, evaluateBoard(setShape(board,playerTurn,j,i), turnDict[playerTurn]));
                    }
                }
            }
        } else if (playerTurn === "o") {
            value = Infinity; // Fixed capitalization
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    if (moveValid(j, i, board)) {
                        value = Math.min(value, evaluateBoard(setShape(board,playerTurn,j,i), turnDict[playerTurn]));
                    }
                }
            }
        }

        // If no valid moves were found, ensure value isn't undefined.
        return value === undefined ? 0 : value; 
    } else {
        if(playerWin(board,'x')){
            return 1
        }
        if(playerWin(board,'o')){
            return -1
        }
        if(isTie(board)){
            return 0
        }
        return "what da fuaxk"
    }
}


function doBotMove(board,playerTurn){
    let valueBoard = [[null,null,null],[null,null,null],[null,null,null]]
    let value;
    let bestMovex;
    let bestMovey;
    for (let i = 0; i < board.length; i++){
        for(let j = 0; j < board[i].length; j++){
            if(moveValid(j,i,board)){
                valueBoard[i][j] = evaluateBoard(setShape(board,playerTurn,j,i),turnDict[playerTurn])
            }
        }
    }
    console.log(valueBoard)
    if (playerTurn === "x") {
        value = -Infinity; // Fixed capitalization
        for (let i = 0; i < valueBoard.length; i++) {
            for (let j = 0; j < valueBoard[i].length; j++) {
                if(value < valueBoard[i][j] && moveValid(j,i,board)){
                    bestMovex = j
                    bestMovey = i
                    value = valueBoard[i][j]
                }
            }
        }
    } else if (playerTurn === "o") {
        value = Infinity; // Fixed capitalization
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if(value > valueBoard[i][j] && moveValid(j,i,board)){
                    bestMovex = j
                    bestMovey = i
                    value = valueBoard[i][j]
                }
            }
        }
    }
    doMove(bestMovex,bestMovey,board)
}

function setShape(board,shape, x,y){
    let newBoard = JSON.parse(JSON.stringify(board));
    newBoard[y][x] = shape;
    return newBoard
}

function onPageClick(event) {
    mouseX = event.clientX - canvasLeft
    mouseY = event.clientY - canvasTop
    if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){

        // get box clicked on
        var boxx = Math.floor(mouseX*3/width);
        var boxy = Math.floor(mouseY*3/height);

        if(moveValid(boxx,boxy,board) && !gameEnded(board)){
            doMove(boxx,boxy,board)

            if(!gameEnded(board)){
                doBotMove(board,playerTurn)
            }
            drawBoard(board)

        }

        if(gameEnded(board)){
            if(playerWin(board,"x")){
                document.getElementById("status text").innerText = `player x won`;
            }
            if(playerWin(board,"o")){
                document.getElementById("status text").innerText = `player o won`;
            }
            if(isTie(board)){
                document.getElementById("status text").innerText = `it is a tie`;
            }
        }

    }
}

document.addEventListener("click", onPageClick);