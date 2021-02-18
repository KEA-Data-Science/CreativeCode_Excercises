function _drawAnimationFrame(spritesheet, animationName, nextFrameNumber, canvasStartX, canvasStartY, scale = 1) {
  let aniSegment = spritesheet.atlas.segments[animationName] // find right animation by name

  // calculate column and row numbers

  let columnNumber = Math.floor(nextFrameNumber / (aniSegment.numberOfRows + 1)) // column is equal to 'frame #' divided by 'number of members in a row' minus 1 
  let rowNumber = (nextFrameNumber - (columnNumber * aniSegment.numberOfRows)) - 1 // row is equal to frame # minus the product of column found times number of members in row minus 1
  //console.log("Frame no: " + nextFrameNumber+"\tColumn: " + columnNumber + "\tRow: "+ rowNumber )
  
  let sheetXStart = aniSegment.startX + aniSegment.fWidth * rowNumber
  let sheetYStart = aniSegment.startY + aniSegment.fHeight * (columnNumber)
  //console.log("Frame Sheet\t X Start: \t"+sheetXStart+"\tY start: "+ sheetYStart)

  ctx.drawImage(spritesheet.image, sheetXStart, sheetYStart, aniSegment.fWidth, aniSegment.fHeight, canvasStartX, canvasStartY, aniSegment.fWidth * scale, aniSegment.fHeight * scale)
}

class SpriteSheet {
  constructor(image, animationAtlas) {
    this.image = image
    this.atlas = animationAtlas
  }
}

class AnimationAtlas {
  constructor(segments) {
    this.segments = {}
    segments.forEach(segment => {
      this.put(segment)
    });
    console.log(segments)
  }

  put = function (segment) {
    this.segments[segment.name] = segment
    console.log(this.segments[segment.name])
  }
}

class AnimationSegment {
  constructor(name, startX, startY, fWidth, fHeight, numberOfFrames, numberOfRows, numberOfColumns) {
    this.name = name
    this.startX = startX
    this.startY = startY
    this.fWidth = fWidth
    this.fHeight = fHeight
    this.numberOfFrames = numberOfFrames
    this.numberOfColumns = numberOfColumns
    this.numberOfRows = numberOfRows
  }
}

window.addEventListener("load", setup)
let canvas, ctx


let clericFrameCounter = 1 // of course only for testing
let clericHitFrameCounter = 1 // of course only for testing
let clericSpriteSheet

function setup() {
  canvas = document.getElementById("canvasElement")
  ctx = canvas.getContext("2d")
  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight

  // Setup of 
  let clericSheetImage = new Image()
  clericSheetImage.src = "cleric.png"
  let walkingSegment = new AnimationSegment("Walking", 33, 4, 32, 62, 6, 6, 1)
  let vrtStrokeSegment = new AnimationSegment("Vertical Stroke", 1, 132, 32, 62, 12, 4, 3)
  let clericAtlas = new AnimationAtlas([walkingSegment, vrtStrokeSegment])
  console.log(clericAtlas)
  clericSpriteSheet = new SpriteSheet(clericSheetImage, clericAtlas)

  console.log(vrtStrokeSegment)


  setInterval(() => {
    _clearCanvas()
    _drawAnimationFrame(clericSpriteSheet, "Walking", clericFrameCounter, 140, 110, 1)
    _drawAnimationFrame(clericSpriteSheet, "Vertical Stroke", clericHitFrameCounter, 120, 120, 1)

    clericFrameCounter++
    clericHitFrameCounter++
    if (clericFrameCounter > clericSpriteSheet.atlas.segments["Walking"].numberOfFrames) { clericFrameCounter = 1 }
    if (clericHitFrameCounter > clericSpriteSheet.atlas.segments["Vertical Stroke"].numberOfFrames) { clericHitFrameCounter = 1 }

    console.log(clericSpriteSheet.atlas.segments["Vertical Stroke"].numberOfFrames)
    console.log(clericHitFrameCounter)

  }, 200)
}

function _clearCanvas() {
  ctx.save()
  ctx.fillStyle = "lightblue"
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.restore()
}






// a sprite sheet will always be an atlas, with easier constructor for single column, single animation sheets
// atlasses have named regions, effectively defining single sprites and animations

// I want number of columns and rows,
// start x and y of frame sequence, frame size, total number of frames, animation frame number to draw

// an AniSprite will know the name of the animation it is playing, have reference to a sprite atlas, know the last framenumber requested for drawing