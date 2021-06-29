//PLAYERCHANGEABLE-------------------------------------------------------------------
var STARTINGPOINTS = 5;

//GLOBALS----------------------------------------------------------------------------
var PlayerCanvas = document.getElementById("playercanvas");
var AlgorithmCanvas = document.getElementById("algorithmcanvas");
var width = PlayerCanvas.getBoundingClientRect().width;
var height = PlayerCanvas.getBoundingClientRect().height;
var startingVertices = [];
var playerVertices = [];
//INITIALIZING FUNCTIONS-------------------------------------------------------------
document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        prims(playerVertices);
    }
}


function initializePoints(){
    for(var i =0;i<STARTINGPOINTS;i++){
        var [x,y] = [Math.floor(Math.random() * (width+1)),Math.floor(Math.random() * (height+1))];
        drawPoint(x,y,"blue",PlayerCanvas);
        drawPoint(x,y,"blue",AlgorithmCanvas);
        startingVertices.push([x,y]);
}
}

//initializePoints()


//CANVAS FUNCTIONS-------------------------------------------------------------------
function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x,y]
}

PlayerCanvas.addEventListener("mousedown", function(e)
{
    var [x,y] = getMousePosition(PlayerCanvas, e);
    drawPoint(x,y,"red",PlayerCanvas)
    playerVertices.push([x, y]);
});

function connectPoints(start,end){
    var ctx = PlayerCanvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);
    ctx.lineTo(end[0], end[1]);
    ctx.stroke();
}

function drawPoint(x,y,colour,canvas){
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.rect(x-2.5, y-2.5, 5, 5);
    ctx.fillStyle = colour;
    ctx.fill();

}
//GENETIC ALGORITHM---------------------------------------------------------------------
class Genome{
    path = [];
    chromosomes = [];
    fitness;
}





//PRIMS ALGORITHM----------------------------------------------------------------------
function prims(points) {
    var reached = [];
    var unreached = [];
    for (var k = 0; k < startingVertices.length; k++) {
        unreached.push(startingVertices[k]);
      }
    for (var k = 0; k < points.length; k++) {
      unreached.push(points[k]);
    }
    reached.push(unreached[0]);
    unreached.splice(0, 1);
  
    while (unreached.length > 0) {
      var record = width+height;
      var rIndex; // reached index
      var uIndex; // unreached index
  
      for (var i = 0; i < reached.length; i++) {
        for (var j = 0; j < unreached.length; j++) {
          var v1 = reached[i];
          var v2 = unreached[j];
          var d = Math.hypot(v1[0]-v2[0], v1[1]-v2[1]);
          if (d < record) {
            record = d;
            rIndex = i;
            uIndex = j;
          }
        }
      }
      connectPoints(reached[rIndex],unreached[uIndex]);
      reached.push(unreached[uIndex]);
      unreached.splice(uIndex, 1);
    }

  }


  function main(){
    initializePoints();
  }
  






