//STEP1----------------------------------------------------------------------------
var step1Canvas = document.getElementById("step1canvas");
var step1Vertices = [[200, 50], [50, 350], [350, 350]];
var step1Points = [];
var step1StartingLength;

function initializeStep1Points() {
    step1Points.splice(0, step1Points.length);
    resetCanvas(step1Canvas, step1Vertices);
    for (var i = 0; i < step1Vertices.length; i++) {
        drawPoint(step1Vertices[i][0], step1Vertices[i][1], "white", step1Canvas);
    }
    let results = prims([], step1Vertices);
    drawStep1Path([], results.path, step1Canvas);
    step1StartingLength = Math.round(results.fitness * 100) / 100;
    document.getElementById("step1fitness").innerHTML = "Starting Fitness: " + step1StartingLength + " pixels.";
    document.getElementById("step1currentfitness").innerHTML = "Current Fitness: " + step1StartingLength + " pixels.";
}

function calculateStep1Results() {
    results = prims(step1Points, step1Vertices);
    drawStep1Path(step1Points, results.path, step1Canvas);
    document.getElementById("step1currentfitness").innerHTML = "Current Fitness: " + Math.round(results.fitness * 100) / 100 + " pixels.";
    if ((Math.round(results.fitness * 100) / 100) < step1StartingLength) {
        document.getElementById("step1canvas").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
        $("#step2").fadeIn("slow");
        // $('html,body').animate({scrollTop: document.body.scrollHeight},"slow");
    } else { document.getElementById("step1canvas").style = "box-shadow: 0px 0px 20px 5px rgb(251, 0, 0);"; }
    return results.fitness;
}
step1Canvas.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                var [x, y] = getMousePosition(step1Canvas, e);
                step1Points.splice(0, step1Points.length);
                step1Points.push([x, y]);
                calculateStep1Results();
                return;
        }
    }
});
step1Canvas.addEventListener('contextmenu', event => event.preventDefault());

function drawStep1Path(extrapoint, path, canvas) {
    resetCanvas(canvas, step1Vertices);
    for (let i = 0; i < extrapoint.length; i++) {
        drawPoint(extrapoint[i][0], extrapoint[i][1], "blue", canvas);
    }
    for (let i = 0; i < path.length; i++) {
        connectPoints(path[i][0], path[i][1], canvas);
    }
}

//STEP2----------------------------------------------------------------------------
var step2Canvas = document.getElementById("step2canvas");
var step2Vertices = [[200, 50], [50, 350], [350, 350]];
var step2StartingLength;
var STEP2POPULATION = 10;
var lockedstep2 = true;

function initializeStep2Points() {
    resetCanvas(step2Canvas, step2Vertices);
    for (var i = 0; i < step2Vertices.length; i++) {
        drawPoint(step2Vertices[i][0], step2Vertices[i][1], "white", step2Canvas);
    }
    let results = prims([], step2Vertices);
    drawStep2Path([], results.path, step2Canvas);
    step2StartingLength = Math.round(results.fitness * 100) / 100;
    document.getElementById("step2fitness").innerHTML = "Starting Fitness: " + step2StartingLength + " pixels.";
}

function drawStep2Path(extrapoint, path, canvas) {
    resetCanvas(canvas, step2Vertices);
    for (let i = 0; i < extrapoint.length; i++) {
        drawPoint(extrapoint[i][0], extrapoint[i][1], "blue", canvas);
    }
    for (let i = 0; i < path.length; i++) {
        connectPoints(path[i][0], path[i][1], canvas);
    }
}

async function step2GeneticAlgorithm() {
    if (lockedstep2 == true) {
        lockedstep2 = false;
        document.getElementById("step2currentfitness").innerHTML = '';
        for (var i = 0; i < STEP2POPULATION; i++) {
            var [x, y] = [Math.floor(Math.random() * (400 + 1)), Math.floor(Math.random() * (400 + 1))];
            var results = prims([[x, y]], step2Vertices);
            drawStep2Path([[x, y]], results.path, step2Canvas);
            if (results.fitness > step2StartingLength) {
                var style = "color:#a81616;";
            } else { style = "color: #22c740;" }
            document.getElementById("step2currentfitness").innerHTML += "<p>Genome " + (i + 1) + " Fitness: <span style='" + style + "'>" + Math.round(results.fitness * 100) / 100 + " pixels.</span></p>";
            await new Promise(r => setTimeout(r, 100));
        }
        document.getElementById("step2canvas").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
        $("#step3").fadeIn("slow");
        //$('html,body').animate({scrollTop: document.body.scrollHeight},"slow");
        lockedstep2 = true;
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
var step3Canvas = document.getElementById("step3canvas");
var step3Vertices = [[200, 50], [50, 350], [350, 350]];
var step3StartingLength;
var STEP3GENERATIONS = 10;
var STEP3POPULATIONS = 10;
var lockedstep3 = true;
var step3GenomesKilled = 2;
var step3population = [];

function initializeStep3Points() {
    resetCanvas(step3Canvas, step3Vertices);
    for (var i = 0; i < step3Vertices.length; i++) {
        drawPoint(step3Vertices[i][0], step3Vertices[i][1], "white", step3Canvas);
    }
    let results = prims([], step3Vertices);
    drawStep3Path([], results.path, step3Canvas);
    step3StartingLength = Math.round(results.fitness * 100) / 100;
    document.getElementById("step3fitness").innerHTML = "Starting Fitness: " + step3StartingLength + " pixels.";
    step3population.splice(0, step3population.length);
    for (var i = 0; i < STEP3POPULATIONS; i++) {
        createStep3Genome();
    }
}

function createStep3Genome() {
    let newGenome = new Genome();
    var [x, y] = [Math.floor(Math.random() * (400 + 1)), Math.floor(Math.random() * (400 + 1))];
    newGenome.chromosomes = [[x, y]];
    let results = prims([[x, y]], step3Vertices);
    newGenome.path = [...results.path];
    newGenome.fitness = results.fitness;
    step3population.push(newGenome);
}

function drawStep3Path(extrapoint, path, canvas) {
    resetCanvas(canvas, step3Vertices);
    for (let i = 0; i < extrapoint.length; i++) {
        drawPoint(extrapoint[i][0], extrapoint[i][1], "purple", canvas);
    }
    for (let i = 0; i < path.length; i++) {
        connectPoints(path[i][0], path[i][1], canvas);
    }
}

async function step3GeneticAlgorithm() {
    if (lockedstep3 == true) {
        lockedstep3 = false;
        initializeStep3Points();
        var table = document.getElementById("step3results");
        for (var i = 0; i < STEP3GENERATIONS; i++) {

            step3population.splice(step3population.length - step3GenomesKilled, step3GenomesKilled);
            for (var j = step3population.length; j < STEP3POPULATIONS; j++) {
                createStep3Genome();
            }
            step3population.sort(function (a, b) { return a.fitness - b.fitness; });
            var row = table.getElementsByTagName("tr")[i + 1];
            drawStep3Path(step3population[0].chromosomes, step3population[0].path, step3Canvas);
            for (var k = 0; k < STEP3POPULATIONS; k++) {
                if (step3population[k].fitness > step3StartingLength) {
                    var style = "color:#a81616;";
                } else { style = "color: #22c740;" }
                row.getElementsByTagName("td")[k].innerHTML = "<td>" + "<span style='" + style + "'>" + Math.round(step3population[k].fitness * 100) / 100 + "</span>" + "</td>";
                await new Promise(r => setTimeout(r, 30));
            }
        }
        document.getElementById("step3canvas").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
        $("#step4").fadeIn("slow");
        lockedstep3 = true;
    }
}


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

step3Canvas.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                step3GeneticAlgorithm()
                return;
        }
    }
});

//STEP 4---------------------------------------------------------------------------
var noMutation = [];
var withMutation = [];
var xValues = [];
var CanvasMutation = document.getElementById("canvasmutation");
var CanvasNoMutation = document.getElementById("canvasnomutation");
var step4Vertices = [[200, 50], [50, 350], [350, 350]];
//var step4StartingLength;
var STEP4GENERATIONS = 50;
var STEP4POPULATION = 15;
var step4Mutation = [];
var step4NoMutation = [];
var step4GenomesKilled = 2;
var lockedstep4nomutation = true;
var lockedstep4mutation = true;
var STEP4_MOVE_SIZE = 2;

function initializeStep4Points() {

    for (let i = 0; i < STEP4GENERATIONS; i++) {
        xValues.push(i);
    }
    myChart.update();
    let results = prims([], step4Vertices);
    drawStep4Path([], results.path, CanvasMutation);
    drawStep4Path([], results.path, CanvasNoMutation);
    //step4StartingLength = Math.round(results.fitness * 100) / 100;
    //document.getElementById("step3fitness").innerHTML = "Starting Fitness: " + step3StartingLength + " pixels.";
    resetStep4Population(step4Mutation);
    resetStep4Population(step4NoMutation);
}

function resetStep4Population(population) {
    population.splice(0, population.length);
    for (var i = 0; i < STEP4POPULATION; i++) {
        createStep4Genome(population);
    }
}

function drawStep4Path(extrapoint, path, canvas,colour) {
    resetCanvas(canvas, step4Vertices);
    for (let i = 0; i < extrapoint.length; i++) {
        drawPoint(extrapoint[i][0], extrapoint[i][1], colour, canvas);
    }
    for (let i = 0; i < path.length; i++) {
        connectPoints(path[i][0], path[i][1], canvas);
    }
}

function createStep4Genome(population) {
    let newGenome = new Genome();
    var [x, y] = [Math.floor(Math.random() * (400 + 1)), Math.floor(Math.random() * (400 + 1))];
    newGenome.chromosomes = [[x, y]];
    let results = prims([[x, y]], step4Vertices);
    newGenome.path = [...results.path];
    newGenome.fitness = results.fitness;
    population.push(newGenome);
}

function mutateStep4Genome(population, parent) {
    //console.log(parent);
    let newGenome = new Genome();
    let angle = Math.floor(Math.random() * 361);
    let x = parent.chromosomes[0][0] + STEP4_MOVE_SIZE * Math.sin(angle * (Math.PI / 180));
    if (x >= 400) { x = 400; }
    else if (x <= 0) { x = 0; }
    let y = parent.chromosomes[0][1] + STEP4_MOVE_SIZE * Math.cos(angle * (Math.PI / 180));
    if (y >= 400) { y = 400; }
    else if (y <= 0) { y = 0; }
    newGenome.chromosomes.push([x, y]);
    let results = prims([[x, y]], step4Vertices);
    newGenome.path = [...results.path];
    newGenome.fitness = results.fitness;
    population.push(newGenome);
}


async function step4NoMutationGenetic() {
    if (lockedstep4nomutation == true) {
        lockedstep4nomutation = false;
        noMutation.splice(0, noMutation.length);
        step4NoMutation.splice(0, step4NoMutation.length);
        resetStep4Population(step4NoMutation);
        resetCanvas(CanvasNoMutation, step4Vertices);
        for (var i = 0; i < STEP4GENERATIONS; i++) {
            step4NoMutation.splice(step4NoMutation.length - step4GenomesKilled, step4GenomesKilled);
            for (var j = step4NoMutation.length; j < STEP4POPULATION; j++) {
                createStep4Genome(step4NoMutation);
            }
            step4NoMutation.sort(function (a, b) { return a.fitness - b.fitness; });
            drawStep4Path(step4NoMutation[0].chromosomes, step4NoMutation[0].path, CanvasNoMutation,"rgba(0,0,255,1)");
            noMutation.push(step4NoMutation[0].fitness);
            myChart.update();
            //console.log(step4NoMutation[0].fitness);
            await new Promise(r => setTimeout(r, 30));
        }
        lockedstep4nomutation = true;
    }
}

async function step4MutationGenetic() {
    if (lockedstep4mutation == true) {
        lockedstep4mutation = false;
        step4Mutation.splice(0, step4Mutation.length);
        withMutation.splice(0, withMutation.length);
        resetStep4Population(step4Mutation);
        resetCanvas(CanvasMutation, step4Vertices);
        for (var i = 0; i < STEP4GENERATIONS; i++) {
            step4Mutation.splice(step4Mutation.length - step4GenomesKilled, step4GenomesKilled);
            for (var j = step4Mutation.length; j < STEP4POPULATION; j++) {
                mutateStep4Genome(step4Mutation, step4Mutation[0]);
            }
            step4Mutation.sort(function (a, b) { return a.fitness - b.fitness; });
            drawStep4Path(step4Mutation[0].chromosomes, step4Mutation[0].path, CanvasMutation,"rgba(255,0,255,1)");
            withMutation.push(step4Mutation[0].fitness);
            myChart.update();
            //console.log(step4Mutation[0].fitness);
            await new Promise(r => setTimeout(r, 30));
        }
        lockedstep4mutation = true;
    }
}

CanvasNoMutation.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                step4NoMutationGenetic();
                if(document.getElementById("canvasmutation").style.boxShadow == "rgb(0, 251, 0) 0px 0px 20px 5px"){
                    $("#step5").fadeIn("slow");
                }
                document.getElementById("canvasnomutation").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
                return;
        }
    }
});

CanvasMutation.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                step4MutationGenetic();
                if(document.getElementById("canvasnomutation").style.boxShadow == "rgb(0, 251, 0) 0px 0px 20px 5px"){
                    $("#step5").fadeIn("slow");
                }
                document.getElementById("canvasmutation").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
                return;
        }
    }
});



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
