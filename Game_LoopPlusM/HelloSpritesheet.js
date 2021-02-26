let ctx
const SCENEMANAGER = new SceneManager()

let womanSheetImage = new Image()
womanSheetImage.src = "resources/images/humanfemale/cleric.png"

let walkingSegment = new AnimationSegment("Walking", 33, 4, 32, 62, 6, 6, 1)
let vrtStrokeSegment = new AnimationSegment("Vertical Stroke", 1, 132, 32, 62, 12, 4, 3)
let jumpSegment = new AnimationSegment("Jump", 225, 65, 32, 62, 3, 3, 1)
let crouchSegment = new AnimationSegment("Crouch", 225, 1, 32, 62, 3, 3, 1)

let aniSegmentAtlas = new AnimationAtlas([walkingSegment, vrtStrokeSegment, jumpSegment, crouchSegment])

window.addEventListener("load", function () { setup() })

function setup() {
    let canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    let animatingSheetObject = new GameObject("Ninja Character", {
        update: function (gameObject) { },
        playerInput: function (key, gameObject) {
            if (key === 'A' || key === 'D') { gameObject.sprite.animationName = "Walking" }
            if (key === 'S') { gameObject.sprite.animationName = "Crouch" }
            if (key === 'F') { gameObject.sprite.animationName = "Vertical Stroke" }
            if (key === 'W') { gameObject.sprite.animationName = "Jump" }
        }
    })

    newSpritesheet = new SpriteSheet(animatingSheetObject, womanSheetImage, aniSegmentAtlas)
    newSpritesheet.secondsBetweenFrames = 0.6
    newSpritesheet.animationName = "Walking"

    animatingSheetObject.sprite = newSpritesheet

    SCENEMANAGER.includeInScene(animatingSheetObject)
    GAMEINPUT.subscribeToKeyDown(animatingSheetObject)
    GAMEINPUT.startDetectingInput()
    SCENEMANAGER.GAMELOOP.doLoop()
}