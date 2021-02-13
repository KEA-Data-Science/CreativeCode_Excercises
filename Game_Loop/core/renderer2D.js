// the underscore prefix to names tries to indicate
// that these functions are not intended for direct use

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

class RenderText {
    constructor(textString, gameObject, size = 16, font = "italic " + size + "px Unknown Font, sans-serif", textAlignment = "center", strokeStyle = "black") {
        this.text = textString
        this.font = font
        this.size = size
        this.textAlignment = textAlignment
        this.strokeStyle = strokeStyle
        this.filledText = false // stroked text is default
        this.gameObject = gameObject

        this.render = function () {
            _drawText(this)
        }
    }
}

function _drawText(renderText) {
    ctx.save()
    ctx.font = renderText.font
    ctx.strokeStyle = renderText.strokeStyle
    ctx.textAlign = renderText.textAlignment;
    if (renderText.filledText) {
        ctx.fillText(renderText.text, renderText.gameObject.transform.x, renderText.gameObject.transform.y)
    } else {
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
        ctx.drawImage(image, gameObject.transform.x, gameObject.transform.y)

        ctx.restore()
    } else {
        console.log("Sprite::drawSprit rendering requested on INACTIVE GameObject name: " + gameObject.name + " [ID: " + gameObject.id+"] This is a mistake, check gameloop code." )
    }
}

// Method 
function _rotateForDraw(image, gameObject) {
    shapeXCenter = gameObject.transform.x + (image.width / 2)
    shapeYCenter = gameObject.transform.y + (image.height / 2)

    // move center of canvas to center of image
    ctx.translate(shapeXCenter, shapeYCenter)

    ctx.rotate(gameObject.transform.rotation * (Math.PI / 180))

    ctx.translate(-shapeXCenter, -shapeYCenter)
}

// function defaults to fitting canvas to brower window inner height
function _adjustCanvas(x = 1, y = x) {
    canvas.height = window.innerHeight * x
    canvas.width = window.innerWidth * y
}

// clears canvas by drawing on top of it. for whole scene rendering, call adjustCanvas before 
function _clearCanvas() {
    ctx.save()
    ctx.fillStyle = "lightblue"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.restore()
}