//GLOBALS----------------------------------------------------------------------------
var ExampleCanvas = document.getElementById("examplecanvas");
var exampleVertices = [[200, 50], [50, 350], [350, 350]];
var playerVertice = [];
var exampleStartingLength;


//INITIALIZING FUNCTIONS-------------------------------------------------------------
function initializeExamplePoints() {
    playerVertice.splice(0, playerVertice.length);
    resetCanvas(ExampleCanvas, exampleVertices);
    for (var i = 0; i < exampleVertices.length; i++) {
        drawPoint(exampleVertices[i][0], exampleVertices[i][1], "white", ExampleCanvas);
    }
    let results = prims([], exampleVertices);
    drawExamplePath([], results.path, ExampleCanvas);
    exampleStartingLength = Math.round(results.fitness * 100) / 100;
    document.getElementById("examplefitness").innerHTML = "Starting Fitness: " + exampleStartingLength + " pixels.";
    document.getElementById("examplecurrentfitness").innerHTML = "Current Fitness: " + exampleStartingLength + " pixels.";
}

//PLAYER FUNCTIONS-------------------------------------------------------------------
function calculateExampleResults() {
    results = prims(playerVertice, exampleVertices);
    drawExamplePath(playerVertice, results.path, ExampleCanvas);
    document.getElementById("examplecurrentfitness").innerHTML = "Current Fitness: " + Math.round(results.fitness * 100) / 100 + " pixels.";
    if ((Math.round(results.fitness * 100) / 100) < exampleStartingLength) {
        document.getElementById("examplecanvas").style = "box-shadow: 0px 0px 20px 5px rgb(0, 251, 0);";
    }else{document.getElementById("examplecanvas").style = "box-shadow: 0px 0px 20px 5px rgb(251, 0, 0);";}
    return results.fitness;
}

ExampleCanvas.addEventListener("mouseup", function (e) {
    if (typeof e === 'object') {
        switch (e.button) {
            case 0:
                var [x, y] = getMousePosition(ExampleCanvas, e);
                playerVertice.splice(0, playerVertice.length);
                playerVertice.push([x, y]);
                calculateExampleResults();
                return;
        }
    }
});
ExampleCanvas.addEventListener('contextmenu', event => event.preventDefault());

//CANVAS FUNCTIONS-------------------------------------------------------------------
function drawExamplePath(extrapoint, path, canvas) {
    console.log("okk");
    resetCanvas(canvas, exampleVertices);
    for (let i = 0; i < extrapoint.length; i++) {
        drawPoint(extrapoint[i][0], extrapoint[i][1], "blue", canvas);
    }
    for (let i = 0; i < path.length; i++) {
        connectPoints(path[i][0], path[i][1], canvas);
    }
}




