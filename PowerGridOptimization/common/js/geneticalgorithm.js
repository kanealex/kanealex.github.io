//GLOBALS----------------------------------------------------------------------------
var algorithmCanvas = document.getElementById("finalcanvas");
var algorithmWidth = algorithmCanvas.getBoundingClientRect().width;
var algorithmHeight = algorithmCanvas.getBoundingClientRect().height;
var algorithmVertices = [];
var algorithmPopulation = [];
var algorithmxValues = [];
var algorithmResults = [];
var playerscore;

//PLAYERCHANGEABLE------------------------------------------------------------------
NUMGENOMES =0;
NUMGENS=0;
NUMPOINTS=0;
SURVIVALRATE=0;
MOVEPOINT=0;
CHANGEPOINT=0;


//SLIDER FUNCTIONS-------------------------------------------------------------------

function algorithmSlider(value, name, text, percentage) {
    document.getElementById(name).innerHTML = text + value + percentage;
}

function updateGame() {
    NUMGENOMES = document.getElementById('numGenomesValue').value;
    NUMGENS = document.getElementById('numGenerationsValue').value;
    NUMPOINTS = document.getElementById('numPointsValue').value;
    SURVIVALRATE = document.getElementById('survivalRateValue').value;
    MOVEPOINT = document.getElementById('movePointValue').value;
    CHANGEPOINT = document.getElementById('changePointValue').value;
    mainAlgorithm()
}

async function mainAlgorithm() {
    initPoints();
    for (var generation = 0; generation <= NUMGENS; generation++) {
        algorithmPurge();
        algorithmMutation();
        algorithmPopulation.sort(function (a, b) { return a.fitness - b.fitness; });
        await new Promise(r => setTimeout(r, 10));
        drawPath(algorithmVertices,algorithmPopulation[0].chromosomes, algorithmPopulation[0].path, algorithmCanvas,'blue');
        algorithmResults.push(algorithmPopulation[0].fitness);
        algorithmChart.update();
    }
}

function initPoints() {
    algorithmVertices.splice(0,  algorithmVertices.length);
    resetCanvas(algorithmCanvas, '');
    for (var i = 0; i < NUMPOINTS; i++) {
        var [x, y] = [Math.floor(Math.random() * (algorithmWidth + 1)), Math.floor(Math.random() * (algorithmHeight + 1))];
        drawPoint(x, y, "white", algorithmCanvas);
        algorithmVertices.push([x, y]);
    }
    let results = prims('',algorithmVertices);
    drawPath(algorithmVertices,'',results.path,algorithmCanvas,'');
    algorithmPopulation.splice(0, algorithmPopulation.length);
    for (var i = 0; i < NUMGENOMES; i++) {
        let newGenome = new Genome();
        newGenome.path = [...results.path];
        newGenome.fitness = results.fitness;
        algorithmPopulation.push(newGenome);
    }
    algorithmxValues.splice(0,algorithmxValues.length);
    for (let i = 0; i < NUMGENS; i++) {
        algorithmxValues.push(i);
    }
    algorithmResults.splice(0,algorithmResults.length);
    algorithmChart.options.scales.yAxes[0].ticks.max = parseInt(results.fitness+10);
    algorithmChart.options.scales.yAxes[0].ticks.min = parseInt(results.fitness*0.95);
    algorithmChart.update();
}



function algorithmPurge() {
    //Kills of SURVIVAL_RATE, breeds remaining genomes
    let survivalIndex = parseInt(algorithmPopulation .length * (SURVIVALRATE / 100));
    algorithmPopulation.splice(survivalIndex, algorithmPopulation.length - survivalIndex);
    for (var i = algorithmPopulation.length; i < NUMGENOMES; i++) {
        let newChromosomes = [];
        let mother = Math.floor(Math.random() * (survivalIndex));
        let father = Math.floor(Math.random() * (survivalIndex));
        for (var j = 0; j < algorithmPopulation[mother].chromosomes.length; j++) {
            if (Math.floor(Math.random() * (101)) > 50) {
                newChromosomes.push([...algorithmPopulation[mother].chromosomes[j]]);
            }
        }
        for (var j = 0; j < algorithmPopulation [father].chromosomes.length; j++) {
            if (Math.floor(Math.random() * (101)) > 50) {
                newChromosomes.push([...algorithmPopulation[father].chromosomes[j]]);
            }
        }
        var genome = new Genome();
        genome.chromosomes = [...newChromosomes];
        algorithmPopulation.push(genome);
    }
}

function algorithmMutation() {
    for (var i = 0; i < algorithmPopulation.length; i++) {
        var genome = algorithmPopulation[i];
        if (genome.chromosomes.length == 0 || Math.floor(Math.random() * 101) < CHANGEPOINT) {
            algorithmNewPoint(genome);
        }
        if (Math.floor(Math.random() * 101) < CHANGEPOINT) {
            algorithmRemovePoint(genome);
        }
        if (Math.floor(Math.random() * 101) < MOVEPOINT && genome.chromosomes.length > 0) {
            algorithmMovePoint(genome);
        }
        let updatedResults = prims(genome.chromosomes, algorithmVertices);
        genome.path = [...updatedResults.path]; //maybe need a deepcopy
        genome.fitness = updatedResults.fitness;
    }
}

function algorithmMovePoint(genome) {
    let pointindex = Math.floor(Math.random() * genome.chromosomes.length);
    let angle = Math.floor(Math.random() * 361);
    let x = genome.chromosomes[pointindex][0] + MUTATIONMOVE_SIZE * Math.sin(angle * (Math.PI / 180));
    if (x >= algorithmWidth) { x = algorithmWidth; }
    else if (x <= 0) { x = 0; }
    let y = genome.chromosomes[pointindex][1] + MUTATIONMOVE_SIZE * Math.cos(angle * (Math.PI / 180));
    if (y >= algorithmHeight) { y = algorithmHeight; }
    else if (y <= 0) { y = 0; }
    genome.chromosomes[pointindex] = [x, y];
}

function algorithmRemovePoint(genome) {
    genome.chromosomes.splice(Math.floor(Math.random() * (genome.chromosomes.length + 1)), 1);
}

function algorithmNewPoint(genome) {
    var [x, y] = [Math.floor(Math.random() * (algorithmWidth + 1)), Math.floor(Math.random() * (algorithmHeight + 1))];
    genome.chromosomes.push([x, y]);
}




var algorithmChart = new Chart("algorithmChart", {
    type: "line",
    data: {
        labels: algorithmxValues,
        datasets: [{
            label: 'Genetic Algorithm Best Fitness',
            fill: false,
            lineTension: 0,
            borderColor: "rgba(0,0,255,1)",
            data: algorithmResults,

        }
        ]
    },
    options: {
        responsive: true,
        legend: {},
        elements: {
            point: {
                radius: 0
            }
        },
        changeScale: true,
        scales: {
            yAxes: [{
                ticks: { min: 0, max: 2000 },
                scaleLabel: {
                    display: true,
                    labelString: 'Shortest Path Length'
                }
            }],
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Generation'
                }
            }]
        }

    }
});