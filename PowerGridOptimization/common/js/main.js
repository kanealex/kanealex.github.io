//PLAYERCHANGEABLE-------------------------------------------------------------------

//GENOME CLASSIC
var GENOMES_POPULATION = 10;
var SURVIVAL_RATE = 10; // PERCENTAGE


//GENOME MUTATION
var STARTINGPOINTS = 10;
var NUMGENERATIONS = 200;
var NEWPOINT_MUTATION = 40; // PERCENTAGE
var MOVEPOINT_MUTATION = 50; // PERCENTAGE
var REMOVEPOINT_MUTATION = 30; // PERCENTAGE
var MUTATIONMOVE_SIZE = 1;

//AESTHETIC 
var WAITTIME = 0;



//GENETIC ALGORITHM---------------------------------------------------------------------
class Genome {
  path = [];
  chromosomes = [];
  fitness = 0;
}

function CreateNewPopulation(population) {
  population.splice(0,population.length);
  var startingValues = prims([],startingVertices);
  for (var i = 0; i < GENOMES_POPULATION; i++) {
    let newGenome = new Genome();
    newGenome.path = [...startingValues.path];
    newGenome.fitness = startingValues.fitness;
    population.push(newGenome);
  }
}


//PRIMS ALGORITHM----------------------------------------------------------------------
function prims(newpoints,startingpoints) {
  var reached = [];
  var unreached = [];
  var path = [];
  var pathLength = 0;
  for (var k = 0; k < startingpoints.length; k++) {
    unreached.push(startingpoints[k]);
  }
  for (var k = 0; k < newpoints.length; k++) {
    unreached.push(newpoints[k]);
  }
  reached.push(unreached[0]);
  unreached.splice(0, 1);

  while (unreached.length > 0) {
    var record = width + height;
    var rIndex; // reached index
    var uIndex; // unreached index

    for (var i = 0; i < reached.length; i++) {
      for (var j = 0; j < unreached.length; j++) {
        var v1 = reached[i];
        var v2 = unreached[j];
        var d = Math.hypot(v1[0] - v2[0], v1[1] - v2[1]);
        if (d < record) {
          record = d;
          rIndex = i;
          uIndex = j;
        }
      }
    }
    pathLength += record;
    path.push([reached[rIndex], unreached[uIndex]]);
    reached.push(unreached[uIndex]);
    unreached.splice(uIndex, 1);
  }
  return {
    fitness: pathLength,
    path: path,
  }
}
//CANVAS METHODS------------------------------------------------------------

function resetCanvas(canvas,initialpoints) {
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < initialpoints.length; i++) {
    drawPoint(initialpoints[i][0], initialpoints[i][1], "white", canvas);
  }
}

function drawPath(startingpoints, extrapoints, path, canvas, colour) {
  resetCanvas(canvas, startingpoints);
  for (let i = 0; i < extrapoints.length; i++) {
      drawPoint(extrapoints[i][0], extrapoints[i][1], colour, canvas);
  }
  for (let i = 0; i < path.length; i++) {
      connectPoints(path[i][0], path[i][1], canvas);
  }
}

function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  return [x, y]
}

function connectPoints(start, end, canvas) {
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(start[0], start[1]);
  ctx.lineTo(end[0], end[1]);
  ctx.stroke();
}

function drawPoint(x, y, colour, canvas) {
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = colour;
  ctx.fill();
}

//MAIN---------------------------------------------------------------------
function main() {
  initializeGamePoints();
  initializeStep1Points();
  initializeStep2Points();
  createResultsTable();
  initializeStep3Points();
  initializeStep4Points();
  initializeStep5Points()
}















