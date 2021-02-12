let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

canvas.height = window.innerHeight
canvas.width = window.innerWidth

console.log(ctx.canvas.height + " " + ctx.canvas.width)

let xCenter = canvas.width / 2
let yCenter = canvas.height / 2

let radius = canvas.height / 4

//  document.onkeypress = myKeyPress
window.addEventListener("keydown", myKeyPress)

let lastKeyStroke = '-'
let score = 0

drawScene()

function myKeyPress(e) {
    var keynum;

    if (window.event) { // IE                  
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera                 
        keynum = e.which;
    }

    lastKeyStroke = String.fromCharCode(keynum)
    console.log(lastKeyStroke);
    score++
    
    drawScene() // redraws entire scene
}

function clearCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.save()
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
}

function drawScene(){
    clearCanvas()
    drawBackground()
    drawText()
}

function drawBackground() {
    ctx.beginPath()
    ctx.arc(xCenter, yCenter, radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = "lightblue"
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(xCenter, yCenter)
    ctx.lineTo(xCenter - radius, yCenter + radius)
    ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle = "blue"
    ctx.moveTo(xCenter, yCenter)
    ctx.lineTo(200, 100)
    ctx.lineTo(150, 150)
    ctx.fill()
}

function drawText() {
    ctx.save()
    ctx.font = "italic " + window.innerHeight / 12 + "px Unknown Font, sans-serif"
    ctx.strokeStyle = "black"
    ctx.textAlign = "center";
    ctx.strokeText("Score " + score, window.innerWidth / 2, 100)
    ctx.restore()
}

//   https://stackoverflow.com/questions/1846599/how-to-find-out-what-character-key-is-pressed