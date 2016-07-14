var Grid = require("../components/grid");
var MazeBuilder = require("../builders/mazeBuilder");
var StreetBuilder = require("../builders/streetBuilder");
var DfBuilder = require("../builders/dfBuilder");
var DijkstraTest = require("../builders/DijkstraTest");

var BfSolver = require("../solvers/bfSolver");
var DfSolver = require("../solvers/dfSolver");
var RogerSolver = require("../solvers/rogerSolver");
var DijkstraSolver = require("../solvers/DijkstraSolver");

var resetTimers = function(){
  $("#roger-time").html("Timer:");
  $("#dijkstra-time").html("Timer:");
  $("#bf-time").html("Timer:");
  $("#df-time").html("Timer:");
};

function bindHandlers(ctx){
  grid = new Grid(ctx);
  MazeBuilder = new MazeBuilder(grid);
  DfBuilder = new DfBuilder(grid);
  StreetBuilder = new StreetBuilder(grid);
  DijkstraTest = new DijkstraTest(grid);

  BfSolver = new BfSolver(grid);
  DfSolver = new DfSolver(grid);
  RogerSolver = new RogerSolver(grid);
  DijkstraSolver = new DijkstraSolver(grid);
  grid.draw(ctx);

  $("#build-maze").click(function(){
    grid.reset();
    resetTimers();
    grid.addCells(ctx);
    grid.draw(ctx);
    $("button").prop("disabled", true);
    MazeBuilder.animateMaze(1);
  });

  $("#df-builder").click(function(){
    grid.reset();
    resetTimers();
    grid.addCells(ctx);
    grid.draw(ctx);
    $("button").prop("disabled", true);
    DfBuilder.animateMaze(1);
  });

  $("#fast-maze").click(function(){
    grid.reset();
    resetTimers();
    grid.addCells(ctx);
    grid.draw(ctx);
    MazeBuilder.buildMaze();
  });

  $("#build-street").click(function(){
    grid.reset();
    resetTimers();
    grid.addCells(ctx);
    grid.draw(ctx);
    StreetBuilder.buildStreets();
  });

  $("#dijkstra-test").click(function(){
    grid.reset();
    resetTimers();
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

  $("#dijkstra-solver").click(function(){
    grid.reset();
    $("button").prop("disabled", true);
    DijkstraSolver.solve();
  });



  $("#solvers").hide();
}

module.exports = bindHandlers;
