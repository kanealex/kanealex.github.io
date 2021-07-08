//GLOBALS----------------------------------------------------------------------------
var PlayerCanvas = document.getElementById("playercanvas");
var AlgorithmCanvas = document.getElementById("algorithmcanvas");
var width = PlayerCanvas.getBoundingClientRect().width;
var height = PlayerCanvas.getBoundingClientRect().height;
var startingVertices = [];
var playerVertices = [];
var game_population = [];
var playerscore;

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

//GENETIC ALGORITHM
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
