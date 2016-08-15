var SolverUtil = require("../utils/solverUtil");

function BfSolver(grid){
  this.grid = grid;
  this.ctx = this.grid.ctx;
  this.moves = [];
  this.solved = false;
  this.timerId = null;
  this.time = 0;
  this.distance = 0;
  this.distanceId = "#bf-distance";
}

BfSolver.prototype.exploreMaze = function(){
  var cell = this.moves[0];
  var i = 0;
  while (cell.state.explored) {
    cell = this.moves[i];
    i++;
  }
  SolverUtil.explorePath(cell);

  if (cell.state.end) {
    clearInterval(this.timerId);
    SolverUtil.traceBackHome(cell,this);
    this.solved = true;
  } else {
    SolverUtil.chartPathOptions(this, cell);
  }
};

BfSolver.prototype.solveMaze = function(){
  SolverUtil.reset(this);
  SolverUtil.startTimer(this, "#bf-time");
  var startCell = this.grid.getStartCell();
  startCell.distance = 0;
  SolverUtil.chartPathOptions(this, startCell);
  var solver = this;

  var solveIntervalId = setInterval(function(){
    if (solver.solved === false) {
      solver.exploreMaze();
    } else {
      clearInterval(solveIntervalId);
    }
  }, 0);
};

module.exports = BfSolver;
