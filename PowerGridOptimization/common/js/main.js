var PlayerCanvas = document.getElementById("playercanvas");
var AlgorithmCanvas = document.getElementById("algorithmcanvas");
var width = PlayerCanvas.getBoundingClientRect().width;
var height = PlayerCanvas.getBoundingClientRect().height;


function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x,y]
}

PlayerCanvas.addEventListener("mousedown", function(e)
{
    var [x,y] = getMousePosition(PlayerCanvas, e);
    console.log("Coordinate x: " + x, 
                "Coordinate y: " + y);
});
