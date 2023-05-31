var cols = 100;
var rows = 100;
var grid = new Array(cols);
var openSet = [];
var closedSet = [];
var path = [];
var start;
var end;
var w, h;
class Spot {
  constructor(i, j) {
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.i = i;
    this.j = j;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < 0.35) {
      this.wall = true;
    }
    this.show = function (col) {
      noStroke();
      fill(col);
      if (this.wall) {
        fill(0);
        // ellipse(this.i * w + w / 2, this.j * h + h / 2, w / 2, h / 2);
        rect(this.i * w, this.j * h, w, h);
      }
    };

    this.addNeighbors = function (grid) {
      var i = this.i;
      var j = this.j;
      //straight neighbors
      if (i < cols - 1) {
        this.neighbors.push(grid[i + 1][j]);
      }
      if (i > 0) {
        this.neighbors.push(grid[i - 1][j]);
      }
      if (j < rows - 1) {
        this.neighbors.push(grid[i][j + 1]);
      }
      if (j > 0) {
        this.neighbors.push(grid[i][j - 1]);
      }
      //diagonal neighboars
      if (i > 0 && j > 0) {
        this.neighbors.push(grid[i - 1][j - 1]);
      }
      if (i < cols - 1 && j > 0) {
        this.neighbors.push(grid[i + 1][j - 1]);
      }
      if (i < cols - 1 && j < rows - 1) {
        this.neighbors.push(grid[i + 1][j + 1]);
      }
      if (i > 0 && j < rows - 1) {
        this.neighbors.push(grid[i - 1][j + 1]);
      }
    };
  }
}
function removeFromArray(array, element) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (array[i] == element) {
      array.splice(i, 1);
    }
  }
}
function heuristic(a, b) {
  return dist(a.i, a.j, b.i, b.j);
  // return abs(a.i - b.i) + abs(a.j - b.j);
}
function setup() {
  createCanvas(window.innerHeight, window.innerHeight);

  //get cell size
  w = width / cols;
  h = height / rows;

  //create array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }
  //populate
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  //add neighbors
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }
  //get start + end
  start = grid[0][0];
  end = grid[cols - 1][rows - 1];
  start.wall = false;
  end.wall = false;
  openSet.push(start);
}
function draw() {
  if (openSet.length > 0) {
    //find lowest
    var lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    var current = openSet[lowestIndex];

    //win condition
    if (openSet[lowestIndex] === end) {
      noLoop();
      console.log("done!");
    }

    //migrate current to closed set
    removeFromArray(openSet, current);
    closedSet.push(current);

    //do neighbors
    var neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      //check if not wall and not closed
      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        //since distance can only be one we add one
        var tempG = current.g + 1;

        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          openSet.push(neighbor);
          newPath = true;
        }
        if (newPath) {
          //how long would it take to get from here to there
          neighbor.h = heuristic(neighbor, end);
          //score = h + how close to goal
          neighbor.f = neighbor.g + neighbor.h;
          //next
          neighbor.previous = current;
        }
      }
    }
  } else {
    //lose condition
    console.log("nuh uh");
    noLoop();
    return;
  }

  background(255);
  //draw main grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));
    }
  }
  //get path

  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
    path.push(temp.previous);
    temp = temp.previous;
  }

  //add colors
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(255, 0, 0));
  }
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(0, 255, 0));
  }
  //draw path
  noFill();
  stroke(0, 0, 255);
  strokeWeight(w * 0.75);
  beginShape();
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
    // path[i].show(color(0, 0, 255));
  }
  endShape();
}
