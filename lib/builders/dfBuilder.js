var BuilderUtil = require("../utils/builderUtil");

function DfBuilder(grid){
  this.grid = grid;
  this.frontier = [];
}

DfBuilder.prototype.animateMaze = function(interval) {
  this.grid.active = true;
  var builder = this;
  this.exploreStart();

  var mazeIntervalId = setInterval(function(){
    if (builder.frontier.length > 0) {
      frontierCell = builder.getRandomDeepFrontier();
      if (builder.grid.validPath(frontierCell)) {
        builder.exploreFrontier(frontierCell);
      }
    } else{
      builder.buildEnd();
      $("button").prop("disabled", false);
      $("#solvers").show();
      clearInterval(mazeIntervalId);
    }
  }, interval);
};

DfBuilder.prototype.exploreFrontier = function(frontierCell){
  frontierCell.makePath();
  frontierCell.draw(ctx);

  var newMoves = frontierCell.getValidMoves();

  if (newMoves) {
    BuilderUtil.addToFrontier(this, newMoves);
  }
};

DfBuilder.prototype.exploreStart = function(){
  var startCell = this.grid.getStartCell();
  BuilderUtil.buildStart(startCell);
  var firstMoves = startCell.getValidMoves();
  BuilderUtil.addToFrontier(this, firstMoves);
};

DfBuilder.prototype.buildEnd = function(){
  while(true){
    var randCoords = BuilderUtil.getRandomCoords();
    var randCell = this.grid.getCell(randCoords);
    if (randCell.state.type === "path" && randCell.gridCoords[0] > 40 && randCell.gridCoords[1] > 30) {
      randCell.state.end = true;
      randCell.grid.end = randCell;
      randCell.draw(this.grid.ctx);
      return;
    }
  }
};

DfBuilder.prototype.getRandomDeepFrontier = function(){
  if (this.frontier.length === 0) {return null;}
  var deepestIdx = this.frontier.length - 1;

  var randomNum = Math.floor(Math.random()*5);
  var randomFrontier = this.frontier.splice(deepestIdx-randomNum, 1)[0];
  var frontierCell = this.grid.getCell(randomFrontier);
  frontierCell.state.frontier = false;
  frontierCell.draw(this.grid.ctx);
  return frontierCell;
};

DfBuilder.prototype.buildMaze = function() {
  this.exploreStart();
  while (this.frontier.length > 0){
    frontierCell = this.getRandomDeepFrontier();
    if (this.grid.validPath(frontierCell)) {
      this.exploreFrontier(frontierCell);
    }
  }
  this.buildEnd();
  $("#solvers").show();
};

module.exports = DfBuilder;
