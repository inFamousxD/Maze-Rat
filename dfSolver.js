var SolverUtil = require("./utils/solverUtil");

function DfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
}

DfSolver.prototype.solveMaze = function(){
  var ctx = this.ctx;
  var grid = this.grid;
  var moveStack = [];
  var startCell = this.grid.getCell(grid.startPos);

  var pathOptions = SolverUtil.getPathOptions(startCell);
  var mazeSolved = false;
  moveStack = moveStack.concat(pathOptions);
  var solveIntervalId = setInterval(function(){
    if (moveStack.length > 0 && mazeSolved === false) {
      var move = moveStack.pop();
      move.explored = true;
      move.draw(ctx);
      if (move.end) {
        SolverUtil.traceBackHome(move, ctx, solveIntervalId);
        mazeSolved = true;
      } else {
        var pathOptions = SolverUtil.getPathOptions(move);
        moveStack = moveStack.concat(pathOptions);
      }
    } else {
      clearInterval(solveIntervalId);
    }
  }, 5);
};

module.exports = DfSolver;