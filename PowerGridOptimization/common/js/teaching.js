//GLOBALS
var exampleVertices = [[200, 50], [50, 350], [350, 350]];


//STEP1----------------------------------------------------------------------------
//STEP 1 GLOBALS
var step1Canvas = document.getElementById("step1canvas");
var step1PlayerPoint = [];
var step1StartingLength;

function initializeStep1Points() {
    let results = prims([], exampleVertices);
    drawPath(exampleVertices, [], results.path, step1Canvas, "");
    step1StartingLength = Math.round(results.fitness * 100) / 100;
    document.getElementById("step1fitness").innerHTML = "Starting Fitness: " + step1StartingLength + " pixels.";
    document.getElementById("step1currentfitness").innerHTML = "Current Fitness: " + step1StartingLength + " pixels.";
}

function calculateStep1Results() {
    let attempt = prims(step1PlayerPoint, exampleVertices);
    drawPath(exampleVertices, step1PlayerPoint, attempt.path, step1Canvas, "blue");
    document.getElementById("step1currentfitness").innerHTML = "Current Fitness: " + Math.round(attempt.fitness * 100) / 100 + " pixels.";
    if ((Math.round(attempt.fitness * 100) / 100) < step1StartingLength) {
        document.getElementById("step1canvas").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
        $("#step2").fadeIn("slow");
    } else { document.getElementById("step1canvas").style = "box-shadow: 0px 0px 20px 5px rgb(251, 0, 0);"; }
}

step1Canvas.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                var [x, y] = getMousePosition(step1Canvas, e);
                step1PlayerPoint.splice(0, step1PlayerPoint.length);
                step1PlayerPoint.push([x, y]);
                calculateStep1Results();
                return;
        }
    }
});
step1Canvas.addEventListener('contextmenu', event => event.preventDefault());


//STEP2----------------------------------------------------------------------------
//STEP2 GLOBALS
var step2Canvas = document.getElementById("step2canvas");
var STEP2POPULATION = 10;
var step2Locked = true;
var step2StartingLength;


function initializeStep2Points() {
    let results = prims([], exampleVertices);
    drawPath(exampleVertices, [], results.path, step2Canvas, "");
    step2StartingLength = Math.round(results.fitness * 100) / 100;
    document.getElementById("step2fitness").innerHTML = "Starting Fitness: " + step2StartingLength + " pixels.";
}

async function step2GeneticAlgorithm() {
    if (step2Locked == true) {
        step2Locked = false;
        document.getElementById("step2results").innerHTML ="";
        for (var i = 0; i < STEP2POPULATION; i++) {
            var [x, y] = [Math.floor(Math.random() * (400 + 1)), Math.floor(Math.random() * (400 + 1))];
            var results = prims([[x, y]], exampleVertices);
            drawPath(exampleVertices, [[x, y]], results.path, step2Canvas, "blue");
            if (results.fitness > step2StartingLength) {
                var style = "color:#a81616;";
            } else { style = "color: #22c740;" }
            document.getElementById("step2results").innerHTML += "<p>Genome " + (i + 1) + " Fitness: <span style='" + style + "'>" + Math.round(results.fitness * 100) / 100 + " pixels.</span></p>";
            await new Promise(r => setTimeout(r, 100));
        }
        document.getElementById("step2canvas").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
        $("#step3").fadeIn("slow");
        step2Locked = true;
    }
}

step2Canvas.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                step2GeneticAlgorithm();
                return;
        }
    }
});

//STEP3----------------------------------------------------------------------------
//STEP 3 GLOBALS
var step3Canvas = document.getElementById("step3canvas");
var STEP3GENERATIONS = 10;
var STEP3POPULATIONS = 10;
var step3StartingLength;
var step3Locked = true;
var step3GenomesKilled = 2;
var step3Population = [];

function initializeStep3Points() {
    let results = prims([], exampleVertices);
    drawPath(exampleVertices, [], results.path, step3Canvas, "");
    step3StartingLength = Math.round(results.fitness * 100) / 100;
    document.getElementById("step3fitness").innerHTML = "Starting Fitness: " + step3StartingLength + " pixels.";
}

function createStep3Genome() {
    let newGenome = new Genome();
    var [x, y] = [Math.floor(Math.random() * (400 + 1)), Math.floor(Math.random() * (400 + 1))];
    newGenome.chromosomes = [[x, y]];
    let results = prims([[x, y]], exampleVertices);
    newGenome.path = [...results.path];
    newGenome.fitness = results.fitness;
    step3Population.push(newGenome);
}

async function step3GeneticAlgorithm() {
    if (step3Locked == true) {
        step3Locked = false;
        step3Population.splice(0, step3Population.length);
        initializeStep3Points();
        var table = document.getElementById("step3results");
        for (var i = 0; i < STEP3GENERATIONS; i++) {
            step3Population.splice(step3Population.length - step3GenomesKilled, step3GenomesKilled);
            for (var j = step3Population.length; j < STEP3POPULATIONS; j++) {
                createStep3Genome();
            }
            step3Population.sort(function (a, b) { return a.fitness - b.fitness; });
            var row = table.getElementsByTagName("tr")[i + 1];
            drawPath(exampleVertices, step3Population[0].chromosomes, step3Population[0].path, step3Canvas, "blue");
            for (var k = 0; k < STEP3POPULATIONS; k++) {
                if (step3Population[k].fitness > step3StartingLength) {
                    var style = "color:#a81616;";
                } else { style = "color: #22c740;" }
                row.getElementsByTagName("td")[k].innerHTML = "<td>" + "<span style='" + style + "'>" + Math.round(step3Population[k].fitness * 100) / 100 + "</span>" + "</td>";
                await new Promise(r => setTimeout(r, 20));
            }
        }
        document.getElementById("step3canvas").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
        $("#step4").fadeIn("slow");
        step3Locked = true;
    }
}

step3Canvas.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                step3GeneticAlgorithm()
                return;
        }
    }
});

//STEP 3 TABLE
function createResultsTable() {
    var table = document.getElementById("step3results");
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    tr.appendChild(td);
    for (var i = 0; i < STEP3POPULATIONS; i++) {
        td = document.createElement('td');
        td.appendChild(document.createTextNode('Genome: ' + (i + 1)));
        tr.appendChild(td);
    }
    table.appendChild(tr);
    for (var i = 0; i < STEP3POPULATIONS; i++) {
        var th = document.createElement('th');
        var tr = document.createElement('tr');
        th.appendChild(document.createTextNode('Generation: ' + (i + 1)));
        tr.appendChild(th);
        for (var j = 0; j < STEP3GENERATIONS; j++) {
            var td = document.createElement('td');
            //td.appendChild(document.createTextNode(''));
            tr.appendChild(td);
            table.appendChild(tr);
        }
    }
}


//STEP 4---------------------------------------------------------------------------

//STEP 4 GLOBALS
var xValues = [];
var STEP4GENERATIONS = 50;
var STEP4POPULATION = 15;
var step4GenomesKilled = 2;

function initializeStep4Points() {
    for (let i = 0; i < STEP4GENERATIONS; i++) {
        xValues.push(i);
    }
    myChart.update();
    let results = prims([], exampleVertices);
    drawPath(exampleVertices, [], results.path, CanvasNoMutation, "");
    drawPath(exampleVertices, [], results.path, CanvasMutation, "");
}

function resetStep4Population(population) {
    population.splice(0, population.length);
    for (var i = 0; i < STEP4POPULATION; i++) {
        createStep4Genome(population);
    }
}

function createStep4Genome(population) {
    let newGenome = new Genome();
    let [x, y] = [Math.floor(Math.random() * (400 + 1)), Math.floor(Math.random() * (400 + 1))];
    newGenome.chromosomes = [[x, y]];
    let results = prims([[x, y]], exampleVertices);
    newGenome.path = [...results.path];
    newGenome.fitness = results.fitness;
    population.push(newGenome);
}


//STEP 4 NO MUTATION
var noMutation = [];
var CanvasNoMutation = document.getElementById("canvasnomutation");
var step4NoMutation = [];
var step4LockedNoMutation = true;

async function step4NoMutationGenetic() {
    if (step4LockedNoMutation == true) {
        step4LockedNoMutation = false;
        noMutation.splice(0, noMutation.length);
        resetStep4Population(step4NoMutation);
        resetCanvas(CanvasNoMutation, exampleVertices);
        for (var i = 0; i < STEP4GENERATIONS; i++) {
            step4NoMutation.splice(step4NoMutation.length - step4GenomesKilled, step4GenomesKilled);
            for (var j = step4NoMutation.length; j < STEP4POPULATION; j++) {
                createStep4Genome(step4NoMutation);
            }
            step4NoMutation.sort(function (a, b) { return a.fitness - b.fitness; });
            drawPath(exampleVertices, step4NoMutation[0].chromosomes, step4NoMutation[0].path, CanvasNoMutation, "rgba(0,0,255,1)");
            noMutation.push(step4NoMutation[0].fitness);
            myChart.update();
            await new Promise(r => setTimeout(r, 30));
        }
        step4LockedNoMutation = true;
    }
}

CanvasNoMutation.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                step4NoMutationGenetic();
                if (document.getElementById("canvasmutation").style.boxShadow == "rgb(0, 251, 0) 0px 0px 20px 5px") {
                    $("#step5").fadeIn("slow");
                }
                document.getElementById("canvasnomutation").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
                return;
        }
    }
});

//STEP 4 MUTATION
var withMutation = [];
var CanvasMutation = document.getElementById("canvasmutation");
var step4Mutation = [];
var step4LockedMutation = true;
var STEP4_MOVE_SIZE = 2;


async function step4MutationGenetic() {
    if (step4LockedMutation == true) {
        step4LockedMutation = false;
        withMutation.splice(0, withMutation.length);
        resetStep4Population(step4Mutation);
        resetCanvas(CanvasMutation, exampleVertices);
        for (var i = 0; i < STEP4GENERATIONS; i++) {
            step4Mutation.splice(step4Mutation.length - step4GenomesKilled, step4GenomesKilled);
            for (var j = step4Mutation.length; j < STEP4POPULATION; j++) {
                mutateStep4Genome(step4Mutation, step4Mutation[0]);
            }
            step4Mutation.sort(function (a, b) { return a.fitness - b.fitness; });
            drawPath(exampleVertices, step4Mutation[0].chromosomes, step4Mutation[0].path, CanvasMutation, "rgba(255,0,255,1)");
            withMutation.push(step4Mutation[0].fitness);
            myChart.update();
            await new Promise(r => setTimeout(r, 30));
        }
        step4LockedMutation = true;
    }
}

function mutateStep4Genome(population, parent) {
    let newGenome = new Genome();
    let angle = Math.floor(Math.random() * 361);
    let x = parent.chromosomes[0][0] + STEP4_MOVE_SIZE * Math.sin(angle * (Math.PI / 180));
    if (x >= 400) { x = 400; }
    else if (x <= 0) { x = 0; }
    let y = parent.chromosomes[0][1] + STEP4_MOVE_SIZE * Math.cos(angle * (Math.PI / 180));
    if (y >= 400) { y = 400; }
    else if (y <= 0) { y = 0; }
    newGenome.chromosomes.push([x, y]);
    let results = prims([[x, y]], exampleVertices);
    newGenome.path = [...results.path];
    newGenome.fitness = results.fitness;
    population.push(newGenome);
}


CanvasMutation.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                step4MutationGenetic();
                if (document.getElementById("canvasnomutation").style.boxShadow == "rgb(0, 251, 0) 0px 0px 20px 5px") {
                    $("#step5").fadeIn("slow");
                }
                document.getElementById("canvasmutation").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
                return;
        }
    }
});

//STEP 4 CHART
var myChart = new Chart("myChart", {
    type: "line",
    data: {
        labels: xValues,
        datasets: [{
            label: 'Without Mutations',
            fill: false,
            lineTension: 0,
            borderColor: "rgba(0,0,255,1)",
            data: noMutation,

        }, {
            label: 'With Mutations',
            fill: false,
            lineTension: 0,
            borderColor: "rgba(255,0,255,1)",
            data: withMutation
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
        scales: {
            yAxes: [{
                ticks: { min: 550, max: 600 },
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



//STEP 5---------------------------------------------------------------------------

//STEP 5 GLOBALS
var step5Points = [];
var STEP5NUMBERPOINTS = 20;
var STEP5POPULATION = 10000;
var step5Frequency = 100;
var step5StartingLength;

//STEP 5 LEFT CANVAS
var leftCanvas = document.getElementById("step5canvasleft");
var bestLeftGenome;

leftCanvas.addEventListener("mouseup", async function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                if (leftCanvas.style.boxShadow != "rgb(0, 251, 0) 0px 0px 20px 5px") {
                    step5LeftCanvasGenetic();
                    await new Promise(r => setTimeout(r, 1));
                    if (rightCanvas.style.boxShadow == "rgb(0, 251, 0) 0px 0px 20px 5px") {
                        middleCanvas.style = "box-shadow: 0px 0px 20px 5px rgb(255, 251, 0)";
                        leftCanvas.style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
                    } else {
                        leftCanvas.style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
                    }

                }
                return;
        }
    }
});

async function step5LeftCanvasGenetic() {
    bestLeftGenome = new Genome();
    let start = prims([], step5Points);
    bestLeftGenome.path = [...start.path];
    bestLeftGenome.fitness = start.fitness;
    for (var i = 0; i < STEP5POPULATION; i++) {
        var [x, y] = [Math.floor(Math.random() * (150 + 1)), Math.floor(Math.random() * (300 + 1))]; //left side
        var results = prims([[x, y]], step5Points);
        if (i % step5Frequency == 0) {
            drawPath(step5Points, [[x, y]], results.path, leftCanvas, "blue");
            await new Promise(r => setTimeout(r, 1));
        }
        if (results.fitness < bestLeftGenome.fitness) {
            bestLeftGenome.fitness = results.fitness;
            bestLeftGenome.path = [...results.path];
            bestLeftGenome.chromosomes = [[x, y]];
        }
    }
    document.getElementById('leftresults').innerHTML = "<br>Path Improvement = " + Math.round((step5StartingLength - bestLeftGenome.fitness) * 100) / 100;
    drawPath(step5Points, bestLeftGenome.chromosomes, bestLeftGenome.path, leftCanvas, "blue");
}

//STEP 5 RIGHT CANVAS
var rightCanvas = document.getElementById("step5canvasright");
var bestRightGenome;

rightCanvas.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                if (rightCanvas.style.boxShadow != "rgb(0, 251, 0) 0px 0px 20px 5px") {
                    if (leftCanvas.style.boxShadow == "rgb(0, 251, 0) 0px 0px 20px 5px") {
                        middleCanvas.style = "box-shadow: 0px 0px 20px 5px rgb(255, 251, 0)";
                        rightCanvas.style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
                    } else {
                        rightCanvas.style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
                    }
                    step5RightCanvasGenetic();
                }
                return;
        }
    }
});

async function step5RightCanvasGenetic() {
    bestRightGenome = new Genome();
    let start = prims([], step5Points);
    bestRightGenome.path = [...start.path];
    bestRightGenome.fitness = start.fitness;
    for (var i = 0; i < STEP5POPULATION; i++) {
        var [x, y] = [Math.floor(Math.random() * (300 + 1 - 150) + 150), Math.floor(Math.random() * (300 + 1))]; //left side
        var results = prims([[x, y]], step5Points);
        if (i % step5Frequency == 0) {
            drawPath(step5Points, [[x, y]], results.path, rightCanvas, "blue");
            await new Promise(r => setTimeout(r, 1));
        }
        if (results.fitness < bestRightGenome.fitness) {
            bestRightGenome.fitness = results.fitness;
            bestRightGenome.path = [...results.path];
            bestRightGenome.chromosomes = [[x, y]];
        }
    }
    document.getElementById('rightresults').innerHTML = "<br>Path Improvement = " + Math.round((step5StartingLength - bestRightGenome.fitness) * 100) / 100;
    drawPath(step5Points, bestRightGenome.chromosomes, bestRightGenome.path, rightCanvas, "blue");
}

//STEP 5 MIDDLE CANVAS
var middleCanvas = document.getElementById("canvascombined");

middleCanvas.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                if (rightCanvas.style.boxShadow == "rgb(0, 251, 0) 0px 0px 20px 5px" && leftCanvas.style.boxShadow == "rgb(0, 251, 0) 0px 0px 20px 5px") {
                    middleCanvas.style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
                    displayMiddleCanvas();
                    $("#step6").fadeIn("slow");
                }
                return;
        }
    }
});

function displayMiddleCanvas() {
    let added_points = bestLeftGenome.chromosomes.concat(bestRightGenome.chromosomes);
    let result = prims(added_points, step5Points)
    drawPath(step5Points, added_points, result.path, middleCanvas, "blue")
    document.getElementById('middleresults').innerHTML = "<br>Path Improvement = " + Math.round((step5StartingLength - result.fitness) * 100) / 100;
}

//STEP 5 SHARED
function initializeStep5Points() {
    leftCanvas.style.boxShadow = "0px 0px 20px 5px rgb(255, 251, 0)";
    rightCanvas.style.boxShadow = "0px 0px 20px 5px rgb(255, 251, 0)";
    middleCanvas.style.boxShadow = "";
    document.getElementById("middleresults").innerHTML = "<br>Path Improvement = -";
    document.getElementById("leftresults").innerHTML = "<br>Path Improvement = -";
    document.getElementById("rightresults").innerHTML = "<br>Path Improvement = -";
    resetCanvas(leftCanvas, []);
    resetCanvas(rightCanvas, []);
    resetCanvas(middleCanvas, []);
    step5Points.splice(0, step5Points.length);
    for (var i = 0; i < STEP5NUMBERPOINTS; i++) {
        var [x, y] = [Math.floor(Math.random() * (300 + 1)), Math.floor(Math.random() * (300 + 1))];
        step5Points.push([x, y]);
    }
    let results = prims([], step5Points);
    step5StartingLength = results.fitness;
    drawPath(step5Points, [], results.path, leftCanvas, "");
    drawPath(step5Points, [], results.path, rightCanvas, "");
    drawPath(step5Points, [], results.path, middleCanvas, "");
}

