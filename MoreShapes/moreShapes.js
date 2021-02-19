let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

canvas.height = window.innerHeight
canvas.width = window.innerWidth

console.log(ctx.canvas.height + " " + ctx.canvas.width)

let xCenter = canvas.width / 2
let yCenter = canvas.height / 2

let radius = canvas.height / 4

//  document.onkeypress = myKeyPress
window.addEventListener("keydown", interpretKey)

window.addEventListener("load", setup)

function setup(){
drawScene()
}



let lastKeyStroke = '-'
let score = 0


let x = 100
let y = 100
//drawScene()

function interpretKey(e) {
    let keynum;

    if (window.event) { // IE                  
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera                 
        keynum = e.which;
    }

    lastKeyStroke = String.fromCharCode(keynum)
    console.log(lastKeyStroke);

    // check to see if one of wasd keys are pressed, add to score if so
    if ("WASD".includes(lastKeyStroke)) {if(score<=360) score++ } else {if(score>0) score--}

    drawScene() // redraws entire scene
}

function drawScene() {
    requestAnimationFrame(drawScene)
    clearCanvas()
    drawBackground()
    drawText()

    emptyBox = new EmptyBox(x,y)

    delete emptyBox

}

function clearCanvas() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.save()
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
}


function drawBackground() {
    ctx.beginPath()
    ctx.arc(xCenter, yCenter, radius, 0, (2 * Math.PI)*(score/360), false)
    ctx.fillStyle = "lightblue"
    ctx.fill()

    ctx.beginPath()
    ctx.rect(x,y,60,60)

    ctx.fill()

    x+=Math.random()* 10
    y+= Math.random() *10

    if(x>ctx.canvas.width){x = Math.random()*ctx.canvas.width}
    if(y>ctx.canvas.height){y = Math.random()*ctx.canvas.height}

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