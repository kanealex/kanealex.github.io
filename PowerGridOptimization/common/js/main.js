//PLAYERCHANGEABLE-------------------------------------------------------------------

//GENOME CLASSIC
var GENOMES_POPULATION = 70;
var SURVIVAL_RATE = 10; // PERCENTAGE


//GENOME MUTATION
var STARTINGPOINTS = 30;
var NUMGENERATIONS = 200;
var NEWPOINT_MUTATION = 40; // PERCENTAGE
var MOVEPOINT_MUTATION = 50; // PERCENTAGE
var REMOVEPOINT_MUTATION = 30; // PERCENTAGE
var MUTATIONMOVE_SIZE = 1;

//AESTHETIC 
var WAITTIME = 0;


//GLOBALS----------------------------------------------------------------------------
var PlayerCanvas = document.getElementById("playercanvas");
var AlgorithmCanvas = document.getElementById("algorithmcanvas");
var width = PlayerCanvas.getBoundingClientRect().width;
var height = PlayerCanvas.getBoundingClientRect().height;
var startingVertices = [];
var playerVertices = [];
var population = [];

//INITIALIZING FUNCTIONS-------------------------------------------------------------
document.body.onkeyup = function (event) {
  if (event.keyCode == 13) {//enter
    GeneticAlgorithm();
  } else if (event.keyCode == 32) {//spacebar
    calculatePlayerResults();
  } else if (event.keyCode == 27) {//esc
    location.reload();
  }
}

function initializePoints() {
  for (var i = 0; i < STARTINGPOINTS; i++) {
    var [x, y] = [Math.floor(Math.random() * (width + 1)), Math.floor(Math.random() * (height + 1))];
    drawPoint(x, y, "white", PlayerCanvas);
    drawPoint(x, y, "white", AlgorithmCanvas);
    startingVertices.push([x, y]);
  }
}

//PLAYER FUNCTIONS-------------------------------------------------------------------
function calculatePlayerResults() {
  results = prims(playerVertices);
  drawPlayerPath(playerVertices, results.path, PlayerCanvas);
  document.getElementById("player_results").innerHTML = "Current Fitness: " +Math.round(results.fitness * 100) / 100 + " pixels.";
  return results.fitness;
}

PlayerCanvas.addEventListener("mouseup", function (e) {
  if (typeof e === 'object') {
    switch (e.button) {
      case 0:
        var [x, y] = getMousePosition(PlayerCanvas, e);
        drawPoint(x, y, "", PlayerCanvas)
        playerVertices.push([x, y]);
        calculatePlayerResults();
        return;

      case 2:
        if(playerVertices.length>0){
          var [x, y] = getMousePosition(PlayerCanvas, e);
          for(var i = 0; i<playerVertices.length;i++){
            if(5>Math.hypot(playerVertices[i][0] - x, playerVertices[i][1] - y)){
              removePoint(i);
              calculatePlayerResults();
              return;
            }
          }
        }
      }
      }
    });

PlayerCanvas.addEventListener('contextmenu', event => event.preventDefault());


//CANVAS FUNCTIONS-------------------------------------------------------------------
function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  //console.log(x, y);
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

function removePoint(index){
  playerVertices.splice(index,1);
}

function drawPlayerPath(extrapoints, path, canvas) {
  resetCanvas(PlayerCanvas);
  for (let i = 0; i < extrapoints.length; i++) {
    drawPoint(extrapoints[i][0], extrapoints[i][1], "red", canvas);
  }
  for (let i = 0; i < path.length; i++) {
    connectPoints(path[i][0], path[i][1], canvas);
  }
}

function drawAlgorithmPath(extrapoints, path, canvas) {
  resetCanvas(canvas);
  for (let i = 0; i < extrapoints.length; i++) {
    drawPoint(extrapoints[i][0], extrapoints[i][1], "orange", canvas);
  }
  for (let i = 0; i < path.length; i++) {
    connectPoints(path[i][0], path[i][1], canvas);
  }
}

function resetCanvas(canvas) {
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < startingVertices.length; i++) {
    drawPoint(startingVertices[i][0], startingVertices[i][1], "white", canvas);
  }
}


//GENETIC ALGORITHM---------------------------------------------------------------------
class Genome {
  path = [];
  chromosomes = [];
  fitness = 0;
}

function CreateNewPopulation() {
  var startingValues = prims([]);
  for (var i = 0; i < GENOMES_POPULATION; i++) {
    let newGenome = new Genome();
    newGenome.path = [...startingValues.path];
    newGenome.fitness = startingValues.fitness;
    population.push(newGenome);
  }
  return population;
}

async function GeneticAlgorithm() {
  CreateNewPopulation();
  for (var generation = 0; generation <= NUMGENERATIONS; generation++) {
    SurvivaloftheFittest();
    MutatePopulation();
    population.sort(function (a, b) { return a.fitness - b.fitness; });
    document.getElementById("alg_results").innerHTML = "Current Fitness: " + Math.round(population[0].fitness * 100) / 100 + " pixels.";
    document.getElementById("alg_results2").innerHTML = "Generation: " + generation + ".";
    drawAlgorithmPath(population[0].chromosomes, population[0].path, AlgorithmCanvas);
    await new Promise(r => setTimeout(r, WAITTIME)); ///??? sure
  }
}

function SurvivaloftheFittest() {
  //Kills of SURVIVAL_RATE, breeds remaining genomes
  //console.log(population.length);
  var survivalIndex = parseInt(population.length * (SURVIVAL_RATE / 100));
  population.splice(survivalIndex, population.length - survivalIndex);
  for (var i = population.length; i < GENOMES_POPULATION; i++) {
    var newChromosomes = [];
    var mother = Math.floor(Math.random() * (survivalIndex));
    var father = Math.floor(Math.random() * (survivalIndex));
    for (var j = 0; j < population[mother].chromosomes.length; j++) {
      if (Math.floor(Math.random() * (101)) > 50) {
        newChromosomes.push([...population[mother].chromosomes[j]]);
      }
    }
    for (var j = 0; j < population[father].chromosomes.length; j++) {
      if (Math.floor(Math.random() * (101)) > 50) {
        newChromosomes.push([...population[father].chromosomes[j]]);
      }
    }
    var genome = new Genome();
    genome.chromosomes = [...newChromosomes];
    population.push(genome);
  }
  //console.log(population.length);
}

function MutatePopulation() {
  for (var i = 0; i < population.length; i++) {
    var genome = population[i];
    if (genome.chromosomes.length == 0 || Math.floor(Math.random() * 101) < NEWPOINT_MUTATION) {
      newPointMutation(genome);
    }
    if (Math.floor(Math.random() * 101) < REMOVEPOINT_MUTATION) {
      removePointMutation(genome);
    }
    if (Math.floor(Math.random() * 101) < MOVEPOINT_MUTATION && genome.chromosomes.length > 0) {
      movePointMutatation(genome);
    }
    var updatedResults = prims(genome.chromosomes);
    genome.path = [...updatedResults.path]; //maybe need a deepcopy ig?
    genome.fitness = updatedResults.fitness;
  }
}

function movePointMutatation(genome) {
  let pointindex = Math.floor(Math.random() * genome.chromosomes.length);
  //console.log("length of array = "+ genome.chromosomes.length);
  //console.log("point index=" +pointindex)
  let angle = Math.floor(Math.random() * 361);
  //console.log("OLD POINT = "+genome.chromosomes[pointindex]);
  let x = genome.chromosomes[pointindex][0] + MUTATIONMOVE_SIZE * Math.sin(angle * (Math.PI / 180));
  if (x >= width) { x = width; }
  else if (x <= 0) { x = 0; }
  let y = genome.chromosomes[pointindex][1] + MUTATIONMOVE_SIZE * Math.cos(angle * (Math.PI / 180));
  if (y >= width) { y = width; }
  else if (y <= 0) { y = 0; }
  genome.chromosomes[pointindex] = [x, y];
  //console.log("NEW POINT = "+genome.chromosomes[pointindex]+'\n');
}

function removePointMutation(genome) {
  genome.chromosomes.splice(Math.floor(Math.random() * (genome.chromosomes.length + 1)), 1);
}

function newPointMutation(genome) {
  var [x, y] = [Math.floor(Math.random() * (width + 1)), Math.floor(Math.random() * (height + 1))];
  genome.chromosomes.push([x, y]);
}


//PRIMS ALGORITHM----------------------------------------------------------------------
function prims(points) {
  var reached = [];
  var unreached = [];
  var path = [];
  var pathLength = 0;
  for (var k = 0; k < startingVertices.length; k++) {
    unreached.push(startingVertices[k]);
  }
  for (var k = 0; k < points.length; k++) {
    unreached.push(points[k]);
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


function main() {
  initializePoints();
  document.getElementById("startingresults").innerHTML += Math.round(calculatePlayerResults() * 100) / 100 + " pixels.";
}















