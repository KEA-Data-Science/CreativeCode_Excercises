// the underscore prefix to names tries to indicate
// that these functions are not intended for direct use

// Note for creation of renderable types; types must have a field that is a function called 'render'
// It is advised to hook into the GameObject class or at least the Transform2D class
// If you don't hook into the GameObject structure, you need to figure out your own way of updating your renderable
// (if you hook into the GameObject structure, simply supply the renderable the gameobject.sprite 
// - and update the gameobject.transform to adjust renderable )
//
// Note: scaling does not work for sprite yet

///
const CANVASDEFAULTS = {
    fontSize: 16,
    backgroundFillStyle: "lightblue",
    sizePropertionOfInnerWindowX: 1,
    sizePropertionOfInnerWindowY: 1
}

class Sprite {
    constructor(src, gameObject) {
        this.src = src
        this.gameObject = gameObject
        this.image = new Image()
        this.image.src = this.src

        this.render = function () {
            _drawSprite(this.image, this.gameObject)
        }
    }
}

/// modification to RenderText and text drawing: possibility to render unstroked text

class RenderText {
    constructor(textString, gameObject, size = CANVASDEFAULTS.fontSize, font = "italic " + size + "px Unknown Font, sans-serif", textAlignment = "center", strokeStyle = "black") {
        this.text = textString
        this.font = font
        this.size = size
        this.textAlignment = textAlignment
        this.strokeStyle = strokeStyle
        this.fillStyle = strokeStyle //fillStyle defaults to provided strokeStyle, which defaults to 'black'
        this.filledText = true // stroked text is default
        this.strokedText = false
        this.gameObject = gameObject

        this.render = function () {
            _drawText(this)
        }
    }
}

class Circle {
    constructor(gameObject, radius, parentAdjustment = { x: 0, y: 0 }, filled = true, stroked = false, fillStyle = "#212121", strokeStyle = "black") {
        this.gameObject = gameObject,
            this.transform = gameObject.transform, // the 'positional' that keeps track of spatial information
            this.parentAdjustment = parentAdjustment,
            this.radius = radius,
            this.fillStyle = fillStyle,
            this.stroked = stroked,
            this.filled = filled,
            this.strokeStyle = strokeStyle,

            this.render = function () {
                _drawCircle(this)
            }
    }
}

class Rectangle {
    constructor(gameObject,width,height,parentAdjustment = { x: 0, y: 0 }, filled = true, stroked = false, fillStyle = "#212121", strokeStyle = "black"){
        this.gameObject = gameObject,
        this.width = width,
        this.height = height,
        this.parentAdjustment = parentAdjustment,
        this.filled = filled,
        this.stroked = stroked,
        this.fillStyle = fillStyle,
        this.strokeStyle = strokeStyle,

        this.render = function (){
            _drawRectangle(this)
        }
    }
}

function _drawRectangle(rectangle){    

    actualWidth = rectangle.width * rectangle.gameObject.transform.scale    
    actualHeight = rectangle.height * rectangle.gameObject.transform.scale

    startX = (rectangle.gameObject.transform.x + rectangle.parentAdjustment.x) - actualWidth/2
    startY = rectangle.gameObject.transform.y + rectangle.parentAdjustment.y  - actualHeight/2

    ctx.save()
    ctx.beginPath()
    _rotateForDraw(rectangle,rectangle.gameObject)    

    if(rectangle.filled){
        ctx.fillStyle = rectangle.fillStyle
        ctx.rect(startX,startY,actualWidth,actualHeight)
        ctx.fill()
    }

    if(rectangle.stroked){
        ctx.strokeStyle = rectangle.strokeStyle
        ctx.rect(startX,startY,actualWidth,actualHeight)
        ctx.stroke()
    }   

    ctx.restore()
}

function _drawCircle(circle) {

    actualX = circle.transform.x + circle.parentAdjustment.x
    actualY = circle.transform.y + circle.parentAdjustment.y

    ctx.save()
    ctx.beginPath()
    ctx.arc(actualX, actualY, circle.radius * circle.transform.scale, 2 * Math.PI,false)

    if (circle.filled) {
        ctx.fillStyle = circle.fillStyle
        ctx.fill()
    }
    if (circle.stroked) {
        ctx.strokeStyle = circle.strokeStyle
        ctx.stroke()
    }
    ctx.restore()
}

function _drawText(renderText) {
    ctx.save()
    ctx.beginPath()
    ctx.font = renderText.font
    ctx.textAlign = renderText.textAlignment;
    if (renderText.filledText) {
        ctx.fillStyle = renderText.fillStyle
        ctx.fillText(renderText.text, renderText.gameObject.transform.x, renderText.gameObject.transform.y)
    } 
    if (renderText.strokedText){
        ctx.strokeStyle = renderText.strokeStyle
        ctx.strokeText(renderText.text, renderText.gameObject.transform.x, renderText.gameObject.transform.y)
    }
    ctx.restore()
}

function _drawSprite(image, gameObject) {

    if (gameObject.activeInScene) {
        ctx.save()

        if (gameObject.transform.rotation != 0) { // this is actually dumb, because it would prevent negative rotations... hmm
            _rotateForDraw(image, gameObject)
        }
        ctx.drawImage(image, gameObject.transform.x - image.width/2, gameObject.transform.y-image.height/2)

        ctx.restore()
    } else {
        console.log("Sprite::drawSprit rendering requested on INACTIVE GameObject name: " + gameObject.name + " [ID: " + gameObject.id + "] This is a mistake, check gameloop code.")
    }
}

// Method should only becalled internally
function _rotateForDraw(image, gameObject) {
    shapeXCenter = gameObject.transform.x 
    shapeYCenter = gameObject.transform.y 

    // move center of canvas to center of image
    ctx.translate(shapeXCenter, shapeYCenter)

    ctx.rotate(gameObject.transform.rotation * (Math.PI / 180))

    ctx.translate(-shapeXCenter, -shapeYCenter)
}

// function defaults to fitting canvas to brower window inner height
function _adjustCanvas(x = 1, y = x) {
    canvas.height = window.innerHeight * x * CANVASDEFAULTS.sizePropertionOfInnerWindowX
    canvas.width = window.innerWidth * y * CANVASDEFAULTS.sizePropertionOfInnerWindowY
}

// clears canvas by drawing on top of it. for whole scene rendering, call adjustCanvas before 
function _clearCanvas() {
    ctx.save()
    ctx.fillStyle = "lightblue"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
}