//GLOBALS----------------------------------------------------------------------------
var PlayerCanvas = document.getElementById("playercanvas");
var AlgorithmCanvas = document.getElementById("algorithmcanvas");
var width = PlayerCanvas.getBoundingClientRect().width;
var height = PlayerCanvas.getBoundingClientRect().height;
var startingVertices = [];
var playerVertices = [];
var game_population = [];
var playerscore;

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


//INITIALIZING FUNCTIONS-------------------------------------------------------------
function initializeGamePoints() {
  startingVertices.splice(0,startingVertices.length);
  resetCanvas(AlgorithmCanvas,startingVertices);
  resetCanvas(PlayerCanvas,startingVertices);
  for (var i = 0; i < STARTINGPOINTS; i++) {
    var [x, y] = [Math.floor(Math.random() * (width + 1)), Math.floor(Math.random() * (height + 1))];
    drawPoint(x, y, "white", PlayerCanvas);
    drawPoint(x, y, "white", AlgorithmCanvas);
    startingVertices.push([x, y]);
  }
  let results = prims(startingVertices,startingVertices);
  drawPlayerPath([], results.path, PlayerCanvas);
  drawAlgorithmPath([], results.path, AlgorithmCanvas);
  playerscore = results.fitness;
  document.getElementById("player_results").innerHTML = "Current Fitness: " +Math.round(results.fitness * 100) / 100 + " pixels.";
  document.getElementById("alg_results").innerHTML = "Current Fitness: " +Math.round(results.fitness * 100) / 100 + " pixels.";
  document.getElementById("startingresults").innerHTML ="Starting Path Length: "+ Math.round(results.fitness * 100) / 100 + " pixels.";
}

//PLAYER FUNCTIONS-------------------------------------------------------------------
function calculatePlayerResults() {
  results = prims(playerVertices,startingVertices);
  drawPlayerPath(playerVertices, results.path, PlayerCanvas);
  document.getElementById("player_results").innerHTML = "Current Fitness: " +Math.round(results.fitness * 100) / 100 + " pixels.";
  playerscore = results.fitness;
  return results.fitness;
}

PlayerCanvas.addEventListener("mouseup", function (e) {
  if (typeof e === 'object') {
    switch (e.button) {
      case 0:
        document.getElementById('runalg').style.boxShadow = "0 0 50px green";
        var [x, y] = getMousePosition(PlayerCanvas, e);
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

//SLIDER FUNCTIONS------------------------------------------------------------------

$(document).ready(function () {
    $("#runalg").click(function () {
      $("#runalg").fadeOut("slow");
      document.getElementById('reload').style.boxShadow = "0 0 50px green";
      document.getElementById('rangeDifficultySlider').disabled = true;
      document.getElementById('rangeDifficultySlider').style = "opacity: 0.5;";
      document.getElementById('rangePointsSlider').disabled = true;
      document.getElementById('rangePointsSlider').style = "opacity: 0.5;";
    });
  });

  function rangeSlide(value,name,text) {
            document.getElementById(name).innerHTML = text +value;
            if(name === 'rangePoints'){
              STARTINGPOINTS = value;
              initializeGamePoints();
            }
            else if(name === 'rangeDifficulty'){
              GENOMES_POPULATION = value;
            }
          }
  function rangeSlideVisual(value,name,text) {
            document.getElementById(name).innerHTML = text + value;
          }

//CANVAS FUNCTIONS-------------------------------------------------------------------

function removePoint(index){
  playerVertices.splice(index,1);
}

function drawPlayerPath(extrapoints, path, canvas) {
  resetCanvas(canvas,startingVertices);
  for (let i = 0; i < extrapoints.length; i++) {
    drawPoint(extrapoints[i][0], extrapoints[i][1], "red", canvas);
  }
  for (let i = 0; i < path.length; i++) {
    connectPoints(path[i][0], path[i][1], canvas);
  }
}

function drawAlgorithmPath(extrapoints, path, canvas) {
  resetCanvas(canvas,startingVertices);
  for (let i = 0; i < extrapoints.length; i++) {
    drawPoint(extrapoints[i][0], extrapoints[i][1], "orange", canvas);
  }
  for (let i = 0; i < path.length; i++) {
    connectPoints(path[i][0], path[i][1], canvas);
  }
}


function fightResults(generation) {
  if(generation == -1){//player beat algorithm
    document.getElementById('finalresults').innerHTML = "You Won!";
    $("#finalresults").fadeIn("slow");
  }else{//algorithm beat player
    document.getElementById('finalresults').innerHTML =  "Algorithm Won <br> <p> You survived: "+ generation +" generations.<p>";
    $("#finalresults").fadeIn("slow");
  }
}

//GENETIC ALGORITHM FUNCTIONS-----------------------------------------------------------------------------------
async function GeneticAlgorithm() {
    CreateNewPopulation(game_population);
    var results = true;
    for (var generation = 0; generation <= NUMGENERATIONS; generation++) {
      SurvivaloftheFittest(game_population);
      MutatePopulation(game_population);
      game_population.sort(function (a, b) { return a.fitness - b.fitness; });
      document.getElementById("alg_results").innerHTML = "Current Fitness: " + Math.round(game_population[0].fitness * 100) / 100 + " pixels.";
      document.getElementById("alg_results2").innerHTML = "Generation: " + generation + ".";
      drawAlgorithmPath(game_population[0].chromosomes, game_population[0].path, AlgorithmCanvas);
      await new Promise(r => setTimeout(r, WAITTIME)); ///??? sure
      if(Math.round(game_population[0].fitness * 100)/100 < playerscore && results){
        results = false;
        fightResults(generation);
      }else if (generation == NUMGENERATIONS && results){
        fightResults(-1);
      }
    }
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

  
function SurvivaloftheFittest(population) {
  //Kills of SURVIVAL_RATE, breeds remaining genomes
  let survivalIndex = parseInt(population.length * (SURVIVAL_RATE / 100));
  population.splice(survivalIndex, population.length - survivalIndex);
  for (var i = population.length; i < GENOMES_POPULATION; i++) {
    let newChromosomes = [];
    let mother = Math.floor(Math.random() * (survivalIndex));
    let father = Math.floor(Math.random() * (survivalIndex));
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
    let genome = new Genome();
    genome.chromosomes = [...newChromosomes];
    population.push(genome);
  }
}

function MutatePopulation(population) {
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
    var updatedResults = prims(genome.chromosomes,startingVertices);
    genome.path = [...updatedResults.path]; //maybe need a deepcopy
    genome.fitness = updatedResults.fitness;
  }
}

function movePointMutatation(genome) {
  let pointindex = Math.floor(Math.random() * genome.chromosomes.length);
  let angle = Math.floor(Math.random() * 361);
  let x = genome.chromosomes[pointindex][0] + MUTATIONMOVE_SIZE * Math.sin(angle * (Math.PI / 180));
  if (x >= width) { x = width; }
  else if (x <= 0) { x = 0; }
  let y = genome.chromosomes[pointindex][1] + MUTATIONMOVE_SIZE * Math.cos(angle * (Math.PI / 180));
  if (y >= width) { y = width; }
  else if (y <= 0) { y = 0; }
  genome.chromosomes[pointindex] = [x, y];
}

function removePointMutation(genome) {
  genome.chromosomes.splice(Math.floor(Math.random() * (genome.chromosomes.length + 1)), 1);
}

function newPointMutation(genome) {
  var [x, y] = [Math.floor(Math.random() * (width + 1)), Math.floor(Math.random() * (height + 1))];
  genome.chromosomes.push([x, y]);
}
