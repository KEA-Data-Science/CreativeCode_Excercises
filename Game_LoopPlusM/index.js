/// Very, very alpha. :D
// Namespace aliasing for Matter.js
const BODIES = Matter.Bodies

let ctx
// scene manager hold layers, and the gameloop;
// the gameloop takes care of 'updating' (first physics, then business logic), then rendering all 'gameobjects'
//      * by 'looping' through all layers contained.
// The gameloop the beats the HEART, which should always be queries to make gameplay as framerate independent as possible
const SCENEMANAGER = new SceneManager()

let pattern // pattens behave in a way (when rotated) that I don't understand yet

window.addEventListener("load", function () { setup() })

function setup() {

    let canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    createBackground()
    createMouseDownListener()

    // Creating walls
    let image = new Image()
    image.src = "resources/images/Player/lollipopWhiteRed.png"
    image.onload = function () {
        pattern = ctx.createPattern(image, "repeat")
        createRect("Floor", ctx.canvas.width / 2, ctx.canvas.height * 0.9, ctx.canvas.width - 10, 60, { isStatic: true })
        createRect("Right Wall", ctx.canvas.width - 60, ctx.canvas.height * 0.5, ctx.canvas.width * 0.35, 60, { isStatic: true, angle: (2 * Math.PI / 180) * 45 })
        createRect("Left Wall", 60, ctx.canvas.height * 0.5, ctx.canvas.width * 0.35, 60, { isStatic: true, angle: (2 * Math.PI / 180) * 45 })
    }

    // Creating polygon spawner
    let polygonSpawner = new GameObject("Polygon Spawner", {
        nextCreation: HEART.timeSinceStart + 1.6, // timeSinceStart measures time since scene started looping, 1.600 is in miliseconds
        update: function (gameObject) {
            if (gameObject.qualia.nextCreation < HEART.timeSinceStart) {
                GLOBJECTS.createRegularPolygon("Interval Polygon", ctx.canvas.height * Math.random(), -10, Math.ceil(10 * Math.random()) + 2, Math.random() * 100)
                gameObject.qualia.nextCreation = HEART.timeSinceStart + 1.2
            }
        }
    })
    SCENEMANAGER.includeInScene(polygonSpawner, 0) //including the spawner on norender-layer (0)

    SCENEMANAGER.GAMELOOP.doLoop() // starts the game looping
    GAMEINPUT.startDetectingInput()
}

function createMouseDownListener() {
    console.log("Creating moosedown controller. Very exciting for the moose.")
    let mouseDownListener = new GameObject("Mouse Listener", {
        update: function (gameObject) { },
        playerInput: function (mouseClick, gameObject) {
            // just checking remove functionality
            foundObjects = SCENEMANAGER.findGameObjects("Poly", true)
            SCENEMANAGER.removeFromScene(foundObjects[foundObjects.length - 1])
        }

    })
    SCENEMANAGER.includeInScene(mouseDownListener, 0)
    GAMEINPUT.subscribeToMouseDown(mouseDownListener)
}

function createRect(name, startX, startY, width, height, options = {}) {

    let squary = new GameObject(name, { // the gameobject with the business logic for each square
        update: function (gameObject) {
            gameObject.transform.position.x = gameObject.qualia.body.position.x
            gameObject.transform.position.y = gameObject.qualia.body.position.y
            gameObject.transform.rotation = (gameObject.qualia.body.angle * 57.29578)
        },
        body: BODIES.rectangle(startX, startY, width, height, options)
    }, true, startX, startY)

    squary.name += " " + squary.id // updating name for debugging purps
    squary.sprite = new Rectangle(squary, width, height) // this is the drawn sprite
    // squary.sprite.filled = false
    squary.sprite.fillStyle = pattern

    squary.sprite.strokeStyle = "red"
    squary.sprite.stroked = true

    SCENEMANAGER.includeInScene(squary)
}


// https://brm.io/matter-js/docs/classes/Bodies.html#method_fromVertices

// Create background objects and text:
// Version Text Group
// Sun
// Moving Clouds
function createBackground() {

    // create logo group: a parent object, hav
    logoObject = new GameObject("Version Bar Text Object", { update: function () { } })
    logoObject.sprite = new RenderText("Game Loop 5th Run", logoObject, 20)
    logoObject.sprite.fillStyle = "white"
    logoObject.sprite.filledText = true
    SCENEMANAGER.includeInScene(logoObject, 5, 2)

    logoBackground = new GameObject("Version Bar Backgroud", {
        childGameObject: logoObject,
        update: function (gameObject) {
            const x = ctx.canvas.width - 135
            const y = ctx.canvas.height - 25
            gameObject.transform.newPosition(x, y)
            gameObject.qualia.childGameObject.transform.newPosition(x, y)
        }
    })
    logoBackground.sprite = new Rectangle(logoBackground, 250, 40)
    logoBackground.sprite.fillStyle = "blue"
    SCENEMANAGER.includeInScene(logoBackground, 5, 0)

    // create sun
    sunObject = new GameObject("The Sun", {
        update: function (gameObject) {
            gameObject.transform.newPosition(ctx.canvas.width * 0.8, ctx.canvas.height * 0.2)
        }
    })
    sunObject.sprite = new Circle(sunObject, 100)
    sunObject.sprite.fillStyle = "yellow"
    sunObject.sprite.stroked = true
    sunObject.sprite.strokeStyle = "white"
    SCENEMANAGER.includeInScene(sunObject, 1)

    //spread clouds

    let cloudSources = [
        "resources/images/clouds/cumulus-big1.png",
        "resources/images/clouds/cumulus-big2.png",
        "resources/images/clouds/cumulus-big3.png",
        "resources/images/clouds/cumulus-huge.png",
        "resources/images/clouds/cumulus-small1.png"
    ]

    let numberOfClouds = ctx.canvas.height * 0.02
    for (let i = 0; i < numberOfClouds; i++) {

        cloud = new GameObject("Cloud " + i,
            {
                xChange: 0,
                yChange: 0,
                update: function (gameObject) {
                    // keeping clouds on screen 
                    if (gameObject.transform.position.x - 100 > ctx.canvas.width) {
                        gameObject.transform.position.x = -50
                        gameObject.transform.position.y = Math.random() * ctx.canvas.height
                    }
                    // update cloud position
                    gameObject.transform.move(
                        gameObject.qualia.xChange * HEART.deltaTime,
                        gameObject.qualia.yChange * HEART.deltaTime)
                }
            })

        cloud.sprite = new Sprite(cloudSources[i % cloudSources.length], cloud)
        cloud.transform.newPosition(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height)
        xDirection = Math.random() > .85 ? -1 : 1
        cloud.qualia.xChange = Math.random() * 50 * xDirection

        SCENEMANAGER.includeInScene(cloud, 2)
    }
}