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

    _adjustCanvas() // makes the canvas the size of the renderable part of browser window

    const player1 = createPlayer("Olfert", ["W", "S", "A", "D"], { x: 150, y: 200 }, 4, 7, -1, "resources/images/Player/p2_stand.png")
    const player2 = createPlayer("Oline", ["h", "e", "d", "f"], { x: 270, y: 100 }, 6, 4, 1, "resources/images/Player/p3_jump.png")
    const player3 = createPlayer("Peter", ["U", "J", "H", "K"], { x: 352, y: 122 }, 16, 4, 0, "resources/images/Player/p1_hurt.png")
    
    GAMEINPUT.startDetectingInput()
    GAMEINPUT.subscribeToKeyDown(player1 )
    GAMEINPUT.subscribeToKeyDown(player2 )
    GAMEINPUT.subscribeToKeyDown(player3 )
    console.log(GAMEINPUT)

    scenemanager.includeInLayer(player1,4, 4)
    scenemanager.includeInLayer(player2,4, 5)
    scenemanager.includeInLayer(player3,4, 2)


    textRenderers = createHelpText() // needed for placing the text

    scenemanager.includeInLayer(textRenderers[0], 5)
    scenemanager.includeInLayer(textRenderers[1], 3)
    scenemanager.includeInLayer(textRenderers[2], 3)

    createTestBackground()

    console.log(scenemanager.findGameObjects("Olfert"))
    console.log(scenemanager.findGameObjectByID(2))

    scenemanager.GAMELOOP.doLoop()
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


function createHelpText() {

    let textP1Keys = new GameObject("text1", {
        update: function (gameObject) {
            gameObject.transform.newPosition(200, ctx.canvas.height - 110)
        }
    })
    let textRender1 = new RenderText("PURPLE: W A S D", textP1Keys, 30)
    textP1Keys.sprite = textRender1
    textRender1.strokeStyle = "#purple"

    let textP2Keys = new GameObject("text2", {
        update: function (gameObject) {
            gameObject.transform.newPosition(200, ctx.canvas.height - 80)
        }
    })
    let textRender2 = new RenderText("GREEN:  U J H K", textP2Keys, 30)
    textRender2.filledText = true
    textRender2.fillStyle = "darkgreen"
    textP2Keys.sprite = textRender2

    let textP3Keys = new GameObject("text3", {
        update: function (gameObject) {
            gameObject.transform.newPosition(200, ctx.canvas.height - 140)
        }
    })
    let textRender3 = new RenderText("RED: NUMPAD 8 5 4 6", textP3Keys, 30)
    textRender3.filledText = true
    textRender3.fillStyle = "darkred"
    textP3Keys.sprite = textRender3

    return [textP1Keys, textP2Keys, textP3Keys]
}

function createTestBackground() {

    rectangleObject = new GameObject("Erecty", {
        update: function (gameObject) {
            gameObject.transform.rotate(1)
        }
    })
    rectangleObject.transform.newPosition(600, 600)
    rectangleObject.sprite = new Rectangle(rectangleObject, 120, 70)

    scenemanager.includeInLayer(rectangleObject, 2)

    circleObject = new GameObject("Circle1", {
        update: function (gameObject) {
            gameObject.transform.newPosition(ctx.canvas.width * 0.2, ctx.canvas.height * 0.8)
            // scaling circle up and down
            if (gameObject.transform.scale > 1) { gameObject.goingUP = false }
            if (gameObject.transform.scale < 0.03) { gameObject.goingUP = true }
            if (gameObject.goingUP) { gameObject.transform.scale = gameObject.transform.scale + 0.01 }
            else { gameObject.transform.scale = gameObject.transform.scale - 0.01 }
        }
    })
    circleObject.goingUP = true // defining new field in gameobject
    circleObject.sprite = new Circle(circleObject, 100)
    circleObject.sprite.fillStyle = "grey"
    circleObject.sprite.stroked = true
    circleObject.sprite.strokeStyle = "darkblue"
    circleObject.transform.newPosition(ctx.canvas.width / 2, ctx.canvas.height / 2)

    scenemanager.includeInLayer(circleObject, 2)


    // let playerCircle = new GameObject("PlayerCircle",
    //     {
    //         update: function (gameObject) {
    //             gameObject.transform.newPosition(gameObject.parentObject.transform.x, gameObject.parentObject.transform.y)
    //         }
    //     })
    // playerCircle.sprite = new Circle(playerCircle, 30,{x:25,y:-25})
    // playerCircle.parentObject = player1
    // scenemanager.includeInLayer(playerCircle, 2)
}

// adjustment ensures that object is on screen by inserting it on the reverse side, oldschool
function keepPlayerOnScreen(gameObject) {
    if (gameObject.transform.y > ctx.canvas.height) { gameObject.transform.y = 0 }
    else if (gameObject.transform.y < 0) { gameObject.transform.y = ctx.canvas.height }
    if (gameObject.transform.x > ctx.canvas.width) { gameObject.transform.x = 0 }
    else if (gameObject.transform.x < 0) { gameObject.transform.x = ctx.canvas.width }
}