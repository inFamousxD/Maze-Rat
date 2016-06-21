# Maze Rat

[Maze Rat live][rogercodes]
[rogercodes]: http://rogercodes.com/maze-rat

Maze Rat is a series of visualizations built with JavaScript and HTML5 Canvas that are designed to illustrate the power of algorithms that build and solve mazes.


## General Implementation

### The blank canvas and the grid behind it.

The core architecture of Maze Rat is a canvas element that reflects the state of a JavaScript grid component that is essentially a two-dimensional array of cell components.

Each of these cells keeps track of its state and renders itself in different colors depending on the state. The `Grid` class initializes with pure wall cells, so at first the grid is colored pure black.

## Maze generation

One of the most challenging aspects of this project was to translate the abstract logic of the random-traversal algorithm into JavaScript code. The random traversal algorithm works by keeping track of a 'frontier' of nodes that represent options for where the maze path might branch out to, then selecting one of these nodes randomly to branch out from. To maintain a maze-like structure I had to exclude frontier cells that would intersect with an existing maze branch.

```
Grid.prototype.validPath = function(coords){
  var cell = this.getCell(coords);
  var parent = cell.parent ? cell.parent : {gridCoords:[-1,-1]};
  var grandparent = parent.parent ? parent.parent : {gridCoords:[-1,-1]};
  var siblings = parent.children;

  var neighbors = cell.getValidNeighbors(this);
  for (var i = 0; i < neighbors.length; i++) {
    var neighbor = neighbors[i];
    if (neighbor.match(grandparent) || neighbor.match(parent) || parent.isChild(neighbor)) {
    } else{
      if (neighbor.state.type=== "path") {
        return false;
      }
    }
  }
  return true;
};
```

Initially, the method above only ensured that the cell at the input coordinates was not intersecting directly with another maze branch, but it did not take into account diagonally adjacent cells, which resulted in mazes which were more reminiscent of product scanner codes than classical mazes.

Of course, when a maze path turns a corner, its frontier cell is adjacent diagonally to the cell that precedes its parent, so I had to adjust the filter to ignore cases where the adjacent cell was a direct 'ancestor' of the frontier cell.

The animation of this algorithm was accomplished by wrapping the maze generation steps inside a `setInterval()` function that halts the code for a millisecond after each cycle. The interval is cleared once there are no more frontiers to explore.

## Maze Solving

Visitors to Maze Rat have three options for solving the randomly generated mazes: a breadth-first search, a depth-first search, and a naive implementation of A* search.

### Breadth-first

A breadth-first search solves a maze by keeping a queue (first in, first out) of all possible moves it can take from a given position and exploring each of those moves before exploring the possible moves that follow one of those choices. In this way, the maze is explored in a uniform manner, spreading out to the full width of the grid, until the end is found, at which point the solver traces its way back to the start of the maze, therby finding the shortest path.

```
utils/SolverUtil.js

traceBackHome: function(cell, ctx, solveIntervalId){
  if (cell.state.start === true) {
    clearInterval(solveIntervalId);
    return;
  } else {
    var parent = cell.parent;
    parent.solvePath = true;
    parent.draw(ctx);
    SolverUtil.traceBackHome(parent, ctx);
  }
}
...
```

The method above traces the 'solvePath' by recursively  finding a cell's parent until the cell has the attribute 'start' set to true.

Like the maze-building algorithm, breadth-first, depth-first and A* are all animated by wrapping their steps inside an interval that is only cleared once the maze is solved.

### Depth-first

The depth-first search algorithm takes the inverse approach of its breadth-first cousin. Instead of a queue to store its possible paths, depth-first using a stack (first in, last out), so that the algorithm will go as deep into the grid as it can before exploring an alternate branch.

### Naive A*

A* (A-star) is an algorithm that is markedly different than depth or breadth-first. Rather than exploring a grid blindly, it knows the coordinates of the endpoint and favors trying out paths that bring it closer. Before learning about breadth-first or depth-first or A*, I came up with a naive, incredibly inefficient algorithm that vaguely resembles A*.

At each step, the algorithm sends out an exploratory probe and finds all possible valid moves it can make, then calculates how close each of those moves are to the end, and prioritizes those moves that bring it the closest. If the exploring probe gets to a dead end, where it has no choice but to backtrack, it traces its way back home and fills in any cells that are along that dead-end route.

```
RogerSolver.js

RogerSolver.prototype.distanceToEnd = function(coords){
  var endPos = this.grid.end.gridCoords;
  var row1 = coords[0];
  var row2 = endPos[0];
  var col1 = coords[1];
  var col2 = endPos[1];

  return Math.pow(Math.pow((row2 - row1),2) + Math.pow((col2 - col1),2),0.5);
};

RogerSolver.prototype.towardsEnd = function(coords){
  return this.distanceToEnd(coords) < this.distanceToEnd(this.currentPos);
};
```

## Street Tested

While building the maze generators and solvers I was curious to see how the various solvers would do if given a simple city street grid structure to navigate to find an end point. I started by building a simple class, `streetBuilder` to construct a grid of alternating walls and paths, setting the beginning to the bottom-right corner, and the end to the top left.

In this scenario, visitors will see three interesting, but largely predictable behaviors:

1. Breadth-first search quickly becomes overwhelmed and stalls due to the size of its move queue since there are so many more path options in an open grid.

2. Depth-first search zig-zags back and forth across the grid, going as deep as it can until finding the end and tracing a wildly inefficient solve-path back to the start.

3. My naive A* algorithm almost always finds the end within three tries.
