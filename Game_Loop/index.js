/// Very, very alpha. :D

let canvas, ctx
const scenemanager = new SceneManager()

window.addEventListener("load", function () { setup() })

function setup() {

    // scene manager hold layers, and the gameloop; 
    // the gameloop takes care of 'updating', then rendering all 'gameobjects' 
    //      * by 'looping' through all layers contained.
    // The gameloop the beats the HEART, which should always be queries to make gameplay as framerate independent as possibleh
    scenemanager.GAMELOOP = new GameLoop(scenemanager)

    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    scenemanager.GAMELOOP.doLoop() // starts the game looping 

    _adjustCanvas() // makes the canvas the size of the renderable part of browser window

    const player1 = createPlayer("Olfert", ["W", "S", "A", "D"], { x: 150, y: 200 }, 4, 4, -.1, "resources/images/Player/p2_stand.png")
    const player2 = createPlayer("Oline", ["h", "e", "d", "f"], { x: 270, y: 100 }, 6, 7, .4, "resources/images/Player/p3_jump.png")
    const player3 = createPlayer("Peter", ["U", "J", "H", "K"], { x: 352, y: 122 }, 12, 4, 0, "resources/images/Player/p1_hurt.png")

    scenemanager.includeInScene(player1, 4, 4)
    scenemanager.includeInScene(player2, 4, 5)
    scenemanager.includeInScene(player3, 4, 2)

    GAMEINPUT.startDetectingInput()
    GAMEINPUT.subscribeToKeyDown(player1)
    GAMEINPUT.subscribeToKeyDown(player2)
    GAMEINPUT.subscribeToKeyDown(player3)
    

    textRenderers = createPlayerHelpText() // used for creating and placing the text

    scenemanager.includeInScene(textRenderers[0], 5)
    scenemanager.includeInScene(textRenderers[1], 3)
    scenemanager.includeInScene(textRenderers[2], 3)

    createSmallUtilityGameObjects()
    createBackground()

    console.log(GAMEINPUT)
    console.log(scenemanager)
}

function createPlayer(name, keySet, position, xChange, yChange, rotSpeed, spriteSource) {
    let newGO = new GameObject(name,
        {
            rotateSpeed: rotSpeed,
            keys: keySet,
            xChange: xChange,
            yChange: yChange,
            health: 10,
            playerInput: function (key, gameObject) {
                if (key == gameObject.qualia.keys[0]) { gameObject.qualia.yChange -= 4 }
                if (key == gameObject.qualia.keys[1]) { gameObject.qualia.yChange += 4 }
                if (key == gameObject.qualia.keys[2]) { gameObject.qualia.xChange -= 4 }
                if (key == gameObject.qualia.keys[3]) { gameObject.qualia.xChange += 4 }
            },
            update: function (gameObject) {
                gameObject.transform.move(this.xChange * HEART.deltaTime, this.yChange * HEART.deltaTime)
                gameObject.transform.rotate(gameObject.qualia.rotateSpeed)
                // restrain player position within screen 
                keepPlayerOnScreen(gameObject)
            }
        })

    newGO.sprite = new Sprite(spriteSource, newGO)
    newGO.transform.newPosition(position.x, position.y)

    return newGO
}

// adjustment ensures that object is on screen by inserting it on the reverse side, oldschool
function keepPlayerOnScreen(gameObject) {
    if (gameObject.transform.y > ctx.canvas.height) { gameObject.transform.y = 0 }
    else if (gameObject.transform.y < 0) { gameObject.transform.y = ctx.canvas.height }
    if (gameObject.transform.x > ctx.canvas.width) { gameObject.transform.x = 0 }
    else if (gameObject.transform.x < 0) { gameObject.transform.x = ctx.canvas.width }
}

function createPlayerHelpText() {

    let pinkPlayerTextObject = new GameObject("text1", {
        update: function (gameObject) {
            gameObject.transform.newPosition(200, ctx.canvas.height - 110)
        }
    })
    let pinkPlayerText = new RenderText("PINK: W A S D", pinkPlayerTextObject, 30)
    pinkPlayerTextObject.sprite = pinkPlayerText
    pinkPlayerText.strokeStyle = "#242424"
    pinkPlayerText.fillStyle = "#f19cb7"
    pinkPlayerText.strokedText = true

    let greenPlayerTextObject = new GameObject("text2", {
        update: function (gameObject) {
            gameObject.transform.newPosition(200, ctx.canvas.height - 80)
        }
    })
    let greenPlayerText = new RenderText("GREEN:  U J H K", greenPlayerTextObject, 30)
    greenPlayerText.fillStyle = "darkgreen"
    greenPlayerTextObject.sprite = greenPlayerText

    let redPlayerTextObject = new GameObject("text3", {
        update: function (gameObject) {
            gameObject.transform.newPosition(200, ctx.canvas.height - 140)
        }
    })
    let redPlayerText = new RenderText("RED: NUMPAD 8 5 4 6", redPlayerTextObject, 30)
    redPlayerText.fillStyle = "darkred"
    redPlayerTextObject.sprite = redPlayerText

    return [pinkPlayerTextObject, greenPlayerTextObject, redPlayerTextObject]
}

createSmallUtilityGameObjects = function () {
    // GO prints pressed keys with console.log
    keycodePrinter = new GameObject("keyprinter",
        {
            update: function (gameObject) { },
            playerInput: function (key, gameObject) { console.log(key) }
        })
    GAMEINPUT.subscribeToKeyDown(keycodePrinter)
    scenemanager.includeInScene(keycodePrinter, 0) // 0 is the nonrendered layer

    // enables timescaling by pressing numpad -/+ (reset with home)
    timeScaler = new GameObject("Time Scale Thing",
        {
            update: function (gameObject) { },
            playerInput: function (key, gameObject) {
                if (key === 'm') { HEART.timeScale -= 0.05 } // numpad -
                if (key === 'k') { HEART.timeScale += 0.05 } // numpad +
                if (key === '$') { HEART.timeScale = 1 } // home 
            }
        })
    scenemanager.includeInScene(timeScaler, 0)
    GAMEINPUT.subscribeToKeyDown(timeScaler)

    // creates customized cursor
    cursorFollow = new GameObject("Cursor Follower",
        {
            update: function (gameObject) {
                gameObject.transform.newPosition(GAMEINPUT.mouse.x, GAMEINPUT.mouse.y)
            }
        })
    cursorFollow.sprite = new Sprite("resources/images/Player/dwarven.png", cursorFollow)
    scenemanager.includeInScene(cursorFollow, 3)
}

function createBackground() {

    // create logo group: a parent object, hav
    logoObject = new GameObject("Version Bar Text Object", { update: function () { } })
    logoObject.sprite = new RenderText("Game Loop 2nd Run", logoObject, 20)
    logoObject.sprite.fillStyle = "white"
    logoObject.sprite.filledText = true
    scenemanager.includeInScene(logoObject, 2, 2)

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
    scenemanager.includeInScene(logoBackground, 2, 0)

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
    scenemanager.includeInScene(sunObject, 1)

    //spread clouds

  let  cloudSources = [
        "resources/images/clouds/cumulus-big1.png",
        "resources/images/clouds/cumulus-big2.png",
        "resources/images/clouds/cumulus-big3.png",
        "resources/images/clouds/cumulus-huge.png",
        "resources/images/clouds/cumulus-small1.png"
    ]

    let numberOfClouds = ctx.canvas.height * 0.01
    for (let i = 0; i < numberOfClouds; i++) {

        cloud = new GameObject("Cloud " + i,
            {
                xChange: 0,
                yChange: 0,
                update: function (gameObject) {
                    // keeping clouds on screen 
                    if (gameObject.transform.x - 100 > ctx.canvas.width) { 
                        gameObject.transform.x = -50
                        gameObject.transform.y = Math.random()*ctx.canvas.height
                     }
                    // update cloud position
                    gameObject.transform.move(
                        gameObject.qualia.xChange * HEART.deltaTime,
                        gameObject.qualia.yChange * HEART.deltaTime)
                }
            })

        cloud.sprite = new Sprite(cloudSources[i%cloudSources.length], cloud)
        cloud.transform.newPosition(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height)
        xDirection = Math.random() > .9 ? -1 : 1
        cloud.qualia.xChange = Math.random() * 50 * xDirection

        scenemanager.includeInScene(cloud, 2)
    }
}