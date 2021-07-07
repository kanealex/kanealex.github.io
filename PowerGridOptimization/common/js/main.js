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
  var startingValues = prims([]);
  for (var i = 0; i < GENOMES_POPULATION; i++) {
    let newGenome = new Genome();
    newGenome.path = [...startingValues.path];
    newGenome.fitness = startingValues.fitness;
    population.push(newGenome);
  }
}

function SurvivaloftheFittest(population) {
  //Kills of SURVIVAL_RATE, breeds remaining genomes
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
    var updatedResults = prims(genome.chromosomes);
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

//MAIN---------------------------------------------------------------------
function main() {
  initializeGamePoints();
}















