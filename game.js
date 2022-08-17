var columnCount = 5;
var rowCount = 5;

// game variable is the state of the game at each point, and helps in knowing all the features like red pieces, black pieces , current turn, round etc

var game = {
    stage : "setup",
    round : 1,
    turn: "redPlayer",
    selectedRow : -1,
    selectedCol : -1,
    redPlayer : { 
                  onePieces   : 0,
                  twoPieces   : 0,
                  threePieces : 0,
                  fourPieces  : 0,
                  totalPieces : function() {
                    return this.onePieces + this.twoPieces + this.threePieces + this.fourPieces;
                   }
                },
    blackPlayer : {
                    onePieces   : 0,
                    twoPieces   : 0,
                    threePieces : 0,
                    fourPieces  : 0,
                    totalPieces : function() {
                      return this.onePieces + this.twoPieces + this.threePieces + this.fourPieces;
                   }
                  }
  };


// this method basically restaarts the game
function restart(){
  document.querySelector(".winner").innerHTML = "";
  game.selectedRow = game.selectedCol = -1;
  game.stage = "setup";
  game.round = 1;
  game.turn = "redPlayer";
  game.redPlayer.onePieces = game.redPlayer.twoPieces = game.redPlayer.threePieces = game.redPlayer.fourPieces = 0;
  game.blackPlayer.onePieces = game.blackPlayer.twoPieces = game.blackPlayer.threePieces =        game.blackPlayer.fourPieces = 0;
  
  // removing box-cell class 
  for(var i =0;i<rowCount;i++){
    for(var j =0;j<columnCount;j++){
      nowCell = getAnyCell(i,j);
      if(nowCell.classList.contains("box-cell")){
        nowCell.classList.remove("box-cell");
      }
      nowCell.setAttribute("player","");
      nowCell.setAttribute("val","-1");
    }
  }
  
  updateMetrics();
}


function endGame(){
  game.stage = "End";
  updateMetrics();
}


// At each stage we update all the variables irrespective of whether or not they have changed so that the data on html is consistent with our 
// state (which is the variable game)

function updateMetrics(){
  // check if the game is won by any player
  if(game.stage == "play" && game.redPlayer.totalPieces() == 0){
    document.querySelector(".winner").innerHTML = "Black Player";
    game.stage = "End";
  }
  else if(game.stage == "play" && game.blackPlayer.totalPieces() == 0){
    document.querySelector(".winner").innerHTML = "Red Player";
    game.stage = "End";
  }
  
  if(game.stage == "End"){
    game.round = "";
    game.turn = "";
    if(game.blackPlayer.totalPieces() != 0 && game.redPlayer.totalPieces() != 0){
      document.querySelector(".winner").innerHTML = "Draw";
    }
  }
  
  
  // update stage
  document.querySelector(".stage-metric").innerHTML =   game.stage;
  //update round
  document.querySelector(".round-metric").innerHTML =   game.round;
  // update turn
  document.querySelector(".turn-metric").innerHTML = game.turn;
  // update red pieces
  document.querySelector(".red-pieces-metric").innerHTML = game.redPlayer.totalPieces();
  // update black pieces
  document.querySelector(".black-pieces-metric").innerHTML = game.blackPlayer.totalPieces();
  
  
 //updating all cells
  for(var i =0;i<rowCount;i++){
    for(var j = 0;j<columnCount;j++){
      nowCell = getAnyCell(i,j);
      cur = nowCell.childNodes[0];
      cur.removeAttribute("class");
      if(nowCell.getAttribute("player") == "redPlayer"){
        cur.classList.add("red-color");
      }
      else if(nowCell.getAttribute("player") == "blackPlayer"){
        cur.classList.add("black-color");
      }
      else{
        continue;
      }
      cur.classList.add("fa-solid");
      var nowVal = nowCell.getAttribute("val");
      if(nowVal == "1"){
        cur.classList.add("fa-1");
      }
      else if(nowVal == "2"){
        cur.classList.add("fa-2");
      }
      else if(nowVal == "3"){
        cur.classList.add("fa-3");
      }
      else if(nowVal == "4"){
        cur.classList.add("fa-4");
      }
      
      
    }
  }
  

}



function unselectCurrentCell(){
  if(game.selectedRow != -1){
    let prevCell = getAnyCell(game.selectedRow.toString(), game.selectedCol.toString());
  console.log("previos ->", prevCell);
  prevCell.classList.remove("selected-cell");
  }
}


function selectCell(cell){
  // checking if currently selected cell is clicked
  let cellRow = parseInt(cell.getAttribute("row"));
  let cellCol = parseInt(cell.getAttribute("col"));
  // deselect the current cell
  unselectCurrentCell();
  
  
  if(game.selectedRow == cellRow && game.selectedCol == cellCol ){
    game.selectedRow = -1;
    game.selectedCol = -1;
    return;
  }
  game.selectedRow = cellRow;
  game.selectedCol = cellCol;
  cell.classList.add("selected-cell");
}

// returns the coordinates of currently selected cells
function getCurrentCell(){
    if(game.selectedRow == "-1"){
      return null;
    }
    
    var query = `[row='${game.selectedRow.toString()}'][col='${game.selectedCol.toString()}']`;
        
        console.log(query);
        var cell = document.querySelector(query);
    
    return cell;
    
  }

function getAnyCell( row,  col){
   var query = `[row='${row}'][col='${col}']`;
        
   //console.log(query);
   cell = document.querySelector(query);
   return cell;
       
  }


// manage the changes in the state depending on what move played by which player
function changeCell( cell,  player,  newVal){
  curPlayer = game[cell.getAttribute("player")];
  console.log("changing ", cell, " - to " , player, " ", newVal);
  var val = cell.getAttribute("val");
  if(val == "1"){
    curPlayer.onePieces -= 1;
  }
  else if(val == "2"){
    curPlayer.twoPieces -= 1;
  }
  else if(val == "3"){
    curPlayer.threePieces -= 1;
  }
  else if(val == "4"){
    curPlayer.fourPieces -= 1;
  }
  
  var nextPlayer = game[player];
  if(newVal == "1"){
    nextPlayer.onePieces += 1;
  }
  else if(newVal == "2"){
    nextPlayer.twoPieces += 1;
  }
  else if(newVal == "3"){
    console.log(player);
    nextPlayer.threePieces += 1;
  }
  else if(newVal == "4"){
    nextPlayer.fourPieces += 1;
  }
  

  
  cell.setAttribute("player", player);
  var prevVal = cell.getAttribute("player");
  cell.setAttribute("val", newVal);
}
  



 function roundChange(){
    // check if any player has set 0 pieces in the setup round
    if(game.stage == "setup" && game.round == 2 && game.redPlayer.totalPieces() == 0 ){
      alert("Cannot proceed to next round, You have to select atleast one piece for the Red player");
      return;
    }

    if(game.stage == "setup" && game.round == 3 && game.blackPlayer.totalPieces() == 0){
      alert("Cannot proceed to next round, You have to select atleast one piece for the Black player");
      return;
    }
    
    console.log("changing round");
    if(game.stage == "setup"){
      if(game.round == 1){
        game.round =2;
        // unselect
      }
      else if(game.round ==2){
        game.round = 3;
        game.turn = "blackPlayer";
        // unselect
      }
      else{
       game.stage = "play";
       game.turn = "redPlayer";
       game.round = 1;
      }
    }
    
    updateMetrics();
 }
  
  
  function cell_click(cell){
    console.log("inside cell click");
    console.log(game);
    unselectCurrentCell();
    // check stage
    if(game.stage == "setup"){
      // checking if any block or any piece is there on the cell
      if(cell.getAttribute("val") != "-1"){
        alert("Error! cell is not empty");
        return;
      }
      selectCell(cell);
    }
    else if(game.stage == "play"){
      
      if(game.turn != cell.getAttribute("player")){
        alert("Error cannot select on this block");
        return;
      }
      selectCell(cell);
      
    }
    else{
      let n = 10;
    }
    
  }
  
  // handles the event of pressing any key and changes the state depening on the round, turn and key pressed
  function keyPressHandle(event){
    console.log(game);
    var keyVal;
    if(window.event){
      keyVal = event.keyCode;
    }
    else if(event.which){
      keyVal = event.which;
    }
    var nowRow = game.selectedRow;
    console.log(nowRow);
    if(nowRow == -1){
      return;
    }
    keyVal = String.fromCharCode(keyVal);
    
    
    if(game.stage == "setup"){
      
      if(game.round == 1){
        if(keyVal != 'b'){
          unselectCurrentCell();
          alert("Error cannot press anything but 'b' in the first round of setup stage");
          return;
        }
        cell = getCurrentCell();
        cell.setAttribute("val", "b");
        cell.classList.add("box-cell");
        console.log(cell);
        
      }
      
      else if(game.round == 2 || game.round == 3){
        cell = getCurrentCell();
        curPlayer = game[game.turn];
        
        if(curPlayer.totalPieces == 8){
            alert("cannot put more than 8 pieces");
            return;
          }
        
        if(keyVal == '1'){
          
          if(curPlayer.onePieces == 3){
            alert("Error! Cannot place more than 3 one pieces");
            return;
          }
          cell.setAttribute("player", game.turn);
          cell.setAttribute("val","1");
          curPlayer.onePieces += 1;
          
        }
        else if(keyVal == '2'){
          if(curPlayer.twoPieces == 2){
            alert("Error! Cannot place more than 2 two pieces");
            return;
          }
          cell.setAttribute("player", game.turn);
          cell.setAttribute("val","2");
          curPlayer.twoPieces += 1;
        }
        else if(keyVal == '3'){
          if(curPlayer.threePieces == 2){
            alert("Error! Cannot place more than 2 three pieces");
            return;
          }
          
          cell.setAttribute("player", game.turn);
          cell.setAttribute("val","3");
          curPlayer.threePieces += 1;
          
        }
        else if(keyVal == '4'){
          if(curPlayer.fourPieces == 1){
            alert("Error! Cannot place more than 1 four pieces");
            return;
          }
          cell.setAttribute("player", game.turn);
          cell.setAttribute("val","4");
          curPlayer.fourPieces += 1;
        }
        else{
          alert("Error! you can only choose a number between 1 and 4");
          return;
        }
        
        
        
        updateMetrics();
        
      }
      
        
      
    }
    else if(game.stage == "play"){
      curRow = game.selectedRow;
      curCol = game.selectedCol;
      var nextRow = curRow;
      var nextCol = curCol;
      var cell = getCurrentCell();                                                             
      if(keyVal == 'a'){
        nextCol -= 1;
      }
      else if(keyVal == 'w'){
        nextRow -= 1;
      }
      else if(keyVal == 'd'){
        nextCol += 1;
      }
      else if(keyVal == 's'){
        nextRow += 1;
      }
      else{
        alert("Error wrong key pressed");
        return;
      }
      
      console.log(nextRow, " -> next row");
      console.log(nextCol, " -> nextCol");
      if(nextRow < 0 || nextRow >= rowCount || nextCol < 0 || nextCol >= columnCount  ){
        alert("Error cannot go out of bounds");
        return;
      }
      var nextCell = getAnyCell(nextRow, nextCol);
      console.log(nextCell);
      if(nextCell.getAttribute("val") == "b"){
        alert("Error cannot move to a place containing box");
        return;
      }
      
      if(nextCell.getAttribute("player") == game.turn){
        alert("Error cannot move to same player");
        return;
      }
      
      // empty next cell
      if(nextCell.getAttribute("player") == ""){
        console.log("going to empty cell");
        console.log("curplayer " , cell);
        changeCell(nextCell,cell.getAttribute("player"), cell.getAttribute("val"));
        changeCell(cell, "", "");
      }
      else{
        console.log("fighting opponent");
        var curCellNumber = parseInt(cell.getAttribute("val"));
        var nextCellNumber = parseInt(nextCell.getAttribute("val"));
        
        if( ( (curCellNumber > nextCellNumber ) || (curCellNumber == 1 && nextCellNumber ==4) ) && !(nextCellNumber == 1 && curCellNumber == 4) ){
            changeCell(nextCell, cell.getAttribute("player"), cell.getAttribute("val"));
        }
        // anyway current cell become empty
        changeCell(cell, "", "");
      }
      if(game.turn == 'redPlayer'){
        game.turn = "blackPlayer";
      }
      else{
        game.turn = "redPlayer";
        game.round += 1;
      }
      
       
      console.log(game);
      
      
    }
    updateMetrics();
    console.log(cell);
    console.log(game);
    
    unselectCurrentCell();
    console.log(keyVal);
    
    
  }
  
  window.addEventListener("keypress", keyPressHandle,false);
  var i,j,id;
  

// generate a dynamic sized table 
var table = document.createElement("TABLE");
  
for (var i = 0; i < rowCount; i++) {
  row = table.insertRow(-1);
  for (var j = 0; j < columnCount; j++) {
    var cell = row.insertCell(-1);
    cell.classList.add("boardbox");

    cell.setAttribute("row",i.toString());

    cell.setAttribute("col",j.toString());

    cell.setAttribute("val", "-1");

    cell.setAttribute("player", "");

    var iTag = document.createElement("i");
    iTag.classList.add("icon");
    cell.appendChild(iTag);
    cell.addEventListener("click", function(){
      cell_click(this);
     });
   
   }
  }
   
var dvTable = document.getElementById("board");
dvTable.innerHTML = "";
dvTable.appendChild(table);