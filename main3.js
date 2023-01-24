let originalBoard;

let humanPlayer = 'O';
let AIPlayer = 'X';
const clickMusic = new Audio('tic-click.wav');
const WINNING_COMBINATIONS = [
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[6,4,2]
];

const cells = document.querySelectorAll('.square');
const arr = [...document.querySelectorAll('.square')];
const result = document.querySelector('.result');


const X = document.getElementById('chooseX');
const Y = document.getElementById('chooseO');
const vsComputer  = document.getElementById('vs-computer');
const vsHuman  = document.getElementById('vs-human');

class UI{
    Cclicked = HClicked = false;
    static choose(obj,obj2){
        obj2.style.backgroundColor = 'transparent';
        obj.style.backgroundColor = 'white';
        obj.style.boxShadow = 'inset 0px 5px 10px 0px rgba(0, 0, 0, 0.5)' ;
        obj2.style.boxShadow = '0px 5px 10px 0px rgba(0, 0, 0, 0.5)';
        humanPlayer = obj.textContent;
        AIPlayer = obj2.textContent;
        console.log(humanPlayer,AIPlayer);
    }   
    
    static vsHuman(){
        document.getElementById('gameUI').style.transform = 'translateY(0%)';
        document.getElementById('GameChooser').style.transform = 'translateY(-1000%)';
        this.HClicked = true;
        humanPlayer = 'X';
        AIPlayer = 'O';
    }

    static vsComputer(){
        document.getElementById('gameUI').style.transform = 'translateY(0%)';
        document.getElementById('GameChooser').style.transform = 'translateY(-1000%)';
        this.Cclicked = true;
        if(humanPlayer === 'O') Utilities.compFirst();
    }
}

class Utilities{
    static changeTurn(){
        humanPlayer = humanPlayer === 'X' ? 'O' : 'X';
        return humanPlayer;
    }

    static compFirst(){
        let id = Game.bestSpot();
        clickMusic.play();
        originalBoard[id] = AIPlayer;
        document.getElementById(id).innerText = AIPlayer;
    }
}

class Game{
    winner;
     plays;
     static startGame(){
        document.getElementById('endGame').style.display = 'none';
        originalBoard = Array.from(Array(9).keys());
        for(let i =0; i< cells.length;i++){
            cells[i].style.textContent = '';
            cells[i].style.removeProperty('background-color');
            cells[i].addEventListener('click',(e)=>Game.handleCells(e),false);
        }
     }

     static handleCells(e){
        if(UI.Cclicked == true){
            if(typeof originalBoard[e.target.id] === 'number'){
                Game.turn(e.target.id, humanPlayer);
                if(!Game.checkWin(originalBoard,humanPlayer)){
                    if(!Game.checkDraw()){
                        Game.turn(Game.bestSpot(),AIPlayer);
                    }
                }
            }
        }else if(UI.HClicked === true){
            if(typeof originalBoard[e.target.id] === 'number'){
                if(!Game.checkWin(originalBoard,humanPlayer)){
                    if(!Game.checkDraw()){
                        Game.turn(e.target.id,humanPlayer);
                        Utilities.changeTurn();
                    }
                }
            }
        }
     }

     static turn(id,player){
        clickMusic.play();
        originalBoard[id] = player;
        cells[id].textContent = player;
        if(Game.checkWin(originalBoard,player)) Game.gameOver(Game.checkWin(originalBoard,player));
     }  

     static checkWin(board,player){
        this.plays = board.reduce((a,e,i)=> (e===player) ? a.concat(i) : a, []);

        this.winner = null;
        WINNING_COMBINATIONS.forEach((item,index)=>{
            if(item.every(el=> this.plays.includes(el))){
                this.winner = {index,player};
            }
        })
        return this.winner;
     }

     static declareWinner(who){
        document.getElementById('endGame').style.display = 'block';
        document.querySelector('.game-board').style.backgroundColor = 'rgba(255,255,255,0.1)';
        document.getElementById('text').textContent = who;
     }

     static gameOver(winner){
        for (let index of WINNING_COMBINATIONS[winner.index]){
            document.getElementById(index).style.backgroundColor = 
             winner.player === humanPlayer ? 'red' : 'blue';
        }

        Game.declareWinner(`${winner.player} has won the match`);

        for(let i = 0; i < cells.length ;i++){
            cells[i].removeEventListener('click',Game.handleCells,false);
        }
     }

     static checkDraw(){
        if(arr.every(el=>{
            return el.textContent === 'X' || el.textContent === 'O';
         })==true){
            
            for(let i=0; i<cells.length;i++){
                cells[i].style.backgroundColor = 'green';
                cells[i].removeEventListener('click',Game.handleCells,false);
    
            }
            Game.declareWinner("The game is tied")
            return true;
        }   
      return false;
     }

    static emptySpots(){
        return originalBoard.filter(el=> typeof el === 'number');
    }

    static bestSpot(){
        return Algorithm.minimax(originalBoard,AIPlayer).index;
    }
}


class Algorithm{
  
    static minimax(newBoard,player){
        let availSpots = Game.emptySpots();

        if(Game.checkWin(newBoard,humanPlayer)){
            return {score:-10};
        }else if(Game.checkWin(newBoard,AIPlayer)){
            return {score:10};
        }else if(availSpots.length === 0){
            return {score:0};
        }

        let moves = [];
        for(let i =0;i < availSpots.length;i++){
            let move = {};
            move.index = newBoard[availSpots[i]];
            newBoard[availSpots[i]] = player;

            if(player === AIPlayer){
                let result = Algorithm.minimax(newBoard,humanPlayer);
                move.score = result.score;
            }else{
                let result = Algorithm.minimax(newBoard,AIPlayer);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = move.index;
            moves.push(move);
        }

       let bestMove;
        if(player  === AIPlayer){
            let bestScore = -10000;
            for(let i =0;i<moves.length;i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }else{
            let bestScore = 10000;
            for(let i =0;i<moves.length;i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }
}

//UI EventListeners
X.addEventListener('click',()=>UI.choose(X,Y),false);
Y.addEventListener('click',()=>UI.choose(Y,X),false);
vsHuman.addEventListener('click',()=>UI.vsHuman(),false);
vsComputer.addEventListener('click',()=>UI.vsComputer(),false);


//Game EventListeners
Game.startGame();