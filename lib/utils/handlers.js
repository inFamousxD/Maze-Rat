var Grid = require("../components/grid");
var BfBuilder = require("../builders/BfBuilder");
var StreetBuilder = require("../builders/streetBuilder");
var DfBuilder = require("../builders/dfBuilder");
var DijkstraTest = require("../builders/DijkstraTest");

var BfSolver = require("../solvers/bfSolver");
var DfSolver = require("../solvers/dfSolver");
var RogerSolver = require("../solvers/rogerSolver");
var AStar = require("../solvers/aStar");

var resetTimers = function(){
  $("#roger-time").html("Time: 0");
  $("#bf-time").html("Time: 0");
  $("#df-time").html("Time: 0");
  $("#astar-time").html("Time: 0");
};

var resetDistance = function(){
  $("#roger-distance").html("Distance: 0");
  $("#bf-distance").html("Distance: 0");
  $("#df-distance").html("Distance: 0");
  $("#astar-distance").html("Distance: 0");
};

function bindHandlers(ctx){
  grid = new Grid(ctx);
  BfBuilder = new BfBuilder(grid);
  DfBuilder = new DfBuilder(grid);
  StreetBuilder = new StreetBuilder(grid);
  DijkstraTest = new DijkstraTest(grid);

  BfSolver = new BfSolver(grid);
  DfSolver = new DfSolver(grid);
  RogerSolver = new RogerSolver(grid);
  AStar = new AStar(grid);
  grid.draw(ctx);

  $("#build-maze").click(function(){
    grid.reset();
    resetTimers();
    resetDistance();
    grid.addCells(ctx);
    grid.draw(ctx);
    $("button").prop("disabled", true);
    BfBuilder.animateMaze(1);
  });

  $("#df-builder").click(function(){
    grid.reset();
    resetTimers();
    resetDistance();
    grid.addCells(ctx);
    grid.draw(ctx);
    $("button").prop("disabled", true);
    DfBuilder.animateMaze(1);
  });

  $("#fast-maze").click(function(){
    grid.reset();
    resetTimers();
    resetDistance();
    grid.addCells(ctx);
    grid.draw(ctx);
    BfBuilder.buildMaze();
  });

  $("#build-street").click(function(){
    grid.reset();
    resetTimers();
    resetDistance();
    grid.addCells(ctx);
    grid.draw(ctx);
    StreetBuilder.buildStreets();
  });

  $("#astar-test").click(function(){
    grid.reset();
    resetTimers();
    resetDistance();
    grid.addCells(ctx);
    grid.draw(ctx);
    DijkstraTest.build();
  });

  $("#solve-maze").click(function(){
    grid.reset();
    $("button").prop("disabled", true);
    BfSolver.solveMaze();
  });

  $("#depth-first").click(function(){
    grid.reset();
    $("button").prop("disabled", true);
    DfSolver.solveMaze();
  });

  $("#roger").click(function(){
    grid.reset();
    $("button").prop("disabled", true);
    RogerSolver.solveMaze();
  });

  $("#astar-solver").click(function(){
    grid.reset();
    $("button").prop("disabled", true);
    AStar.solve();
  });

  $("#solvers").hide();
}

module.exports = bindHandlers;
