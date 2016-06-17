function Cell(displayPos,gridCoords, grid){
  this.displayPos = displayPos;
  this.gridCoords = gridCoords;
  this.width = Cell.WIDTH;
  this.state = "wall";
  this.start = false;
  this.end = false;
  this.explored = false;
  this.parent = null;
  this.children = [];
  this.solvePath = false;
  this.occupied = false;
  this.grid = grid;
}

Cell.WALL_COLOR = "black";
Cell.PATH_COLOR = "white";
Cell.WIDTH = 10;

Cell.DELTAS = {
  up:         [1, 0],
  down:       [-1, 0],
  left:       [0, 1],
  right:      [0, -1],
  upRight:    [-1, 1],
  upLeft:     [-1, -1],
  downRight:  [1, 1],
  downLeft:   [1, -1]
};

Cell.prototype.makePath = function(){
  this.state = "path";
};


Cell.prototype.getMove = function(direction){
  myPos = this.gridCoords;
  var delta = Cell.DELTAS[direction];
  return [delta[0] + myPos[0], delta[1] + myPos[1]];
};

Cell.prototype.getMoves = function() {
  var directions = ["up","down","left","right"];
  var moves = [];
  for (var i = 0; i < directions.length; i++) {
    var direction = directions[i];
    moves.push(this.getMove(direction));
  }
  return moves;
};

Cell.prototype.validMove = function(moveCoords){
  if (!this.grid.inBounds(moveCoords)) {
    return false;
  }

  var self = this;
  var parent = this.parent ? this.parent : {gridCoords:[-1,-1]};

  var moveCell = this.grid.getCell(moveCoords);
  if (moveCell.match(parent)) {
    return false;
  }
  var neighbors = moveCell.getValidNeighbors();
  var valid = true;
  // loop through neighbors. if the neighbor is self or parent, ignor it's state. else, check if it is a path
  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (neighbor.match(self) || neighbor.match(parent)) {
    } else {
      if (neighbor.state === "path") {
        return false;
      }
    }
  }
  return true;
};

Cell.prototype.getValidMoves = function(){
  var moves = this.getMoves();
  var cell = this;
  var validMoves =  moves.filter(function(move){
    return cell.validMove(move);
  });
  return validMoves.length > 0 ? validMoves : null;
};

Cell.prototype.match = function(cell){
  var otherCoords = cell.gridCoords;
  var myCoords = this.gridCoords;
  if (myCoords[0] === otherCoords[0] && myCoords[1] === otherCoords[1]) {
    return true;
  } else {
    return false;
  }
};

Cell.prototype.getNeighbors = function(){
  var pos = this.gridCoords;
  var directions = ["up","down","left","right", "upRight","downRight", "upLeft", "downLeft"];
  var neighbors = [];
  for (var i = 0; i < directions.length; i++) {
    var dir = directions[i];
    neighbors.push(this.getMove(dir));
  }
  return neighbors;
};

Cell.prototype.getValidNeighbors = function(){
  var neighbors = this.getNeighbors();
  var validNeighbors = [];

  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (this.grid.inBounds(neighbor)) {
      var neighborCell = this.grid.getCell(neighbor);
      validNeighbors.push(neighborCell);
    }
  }
  return validNeighbors;
};

Cell.prototype.draw = function(ctx){

  if (this.start) {
    ctx.fillStyle = "green";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.end) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.occupied) {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.solvePath) {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  if (this.explored) {
    ctx.fillStyle = "gray";
    ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
    return;
  }

  switch(this.state){
    case "wall":
      ctx.fillStyle = "black";
      ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
      break;
    case "path":
      ctx.fillStyle = "white";
      ctx.fillRect(this.displayPos[0],this.displayPos[1],this.width, this.width);
      break;
  }
};

module.exports = Cell;
