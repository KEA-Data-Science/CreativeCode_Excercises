/// Very, very alpha. :D

let canvas, ctx
const scenemanager = new SceneManager()
const gameloop = new GameLoop(scenemanager)

let player1 // GameObject type thing, specified in createPlayer1
let player2 // see comment for 1
let player1keys = ["W", "S", "A", "D"]
let player2keys = ["h", "e", "d", "f"]


window.addEventListener("load", function () { setup() })

function setup() {

    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    player1 = createPlayer1(player1)
    player2 = createPlayer2(player2)
    textRenderers = createHelpText()

    GAMEINPUT.startDetectingInput()
    GAMEINPUT.subscribeToKeyPress(player1.qualia.playerInput)
    GAMEINPUT.subscribeToKeyPress(player2.qualia.playerInput)

    scenemanager.includeInLayer(player1)
    scenemanager.includeInLayer(player2)
    scenemanager.includeInLayer(textRenderers[0])
    scenemanager.includeInLayer(textRenderers[1])

    setInterval(gameloop.doLoop, 30)
}

function createPlayer1() { // this is is stupid, but I'm noob at js and can't get the reference to the containing object to work, please help :p 
    let __player = new GameObject("Olfert",
        {
            xChange: 10,
            yChange: 10,
            health: 10,
            playerInput: function (key) {
                if (key == player1keys[0]) { player1.qualia.yChange -= 4 } // this is not right by any means, but I cna figure out how to refer directly to xChange and yChange this.xChange will not work
                if (key == player1keys[1]) { player1.qualia.yChange += 4 }
                if (key == player1keys[2]) { player1.qualia.xChange -= 4 }
                if (key == player1keys[3]) { player1.qualia.xChange += 4 }
            },
            update: function (gameObject) {
                gameObject.transform.move(this.xChange * HEART.deltaTime, this.yChange * HEART.deltaTime)
                // restrain player position within screen 
                keepPlayerOnScreen(gameObject)
            }
        })

    __player.sprite = new Sprite("resources/images/Player/p2_stand.png", __player)
    __player.transform.newPosition(150, 150)

    return __player
}

function createPlayer2() { // see comment for player one
    let __player = new GameObject("Oline",
        {
            xChange: 8,
            yChange: 12,
            health: 10,
            playerInput: function (key) {
                if (key == player2keys[0]) { player2.qualia.yChange -= 6 } // this is not right by any means, but I cna figure out how to refer directly to xChange and yChange this.xChange will not work
                if (key == player2keys[1]) { player2.qualia.yChange += 6 }
                if (key == player2keys[2]) { player2.qualia.xChange -= 6 }
                if (key == player2keys[3]) { player2.qualia.xChange += 6 }
                //console.log("Input reached player: " + key)
            },
            update: function (gameObject) {
                //console.log("GameObject says hello!")
                gameObject.transform.move(this.xChange * HEART.deltaTime, this.yChange * HEART.deltaTime)
                // console.log(this.xChange + " " + this.yChange)
                // restrain player position within screen 
                keepPlayerOnScreen(gameObject)
            }
        })

    __player.sprite = new Sprite("resources/images/Player/p3_jump.png", __player)
    __player.transform.newPosition(100, 100)

    return __player
}

function createHelpText() {
    let textP1Keys = new GameObject("text1", { update: function (gameObject) { } })
    textP1Keys.transform.newPosition(200, 670)
    let textRender1 = new RenderText("PURPLE: W A S D", textP1Keys, 24)
    textP1Keys.sprite = textRender1

    let textP2Keys = new GameObject("text2", { update: function (gameObject) { } })
    let textRender2 = new RenderText("RED: NUMPAD 8 5 4 6", textP2Keys, 24)
    textP2Keys.transform.newPosition(200, 720)
    textRender2.filledText = true
    textP2Keys.sprite = textRender2

    return [textP1Keys, textP2Keys]
}

// adjustment ensures that object is on screen by inserting it on the reverse side, oldschool
function keepPlayerOnScreen(gameObject) {
    if (gameObject.transform.y > ctx.canvas.height) { gameObject.transform.y = 0 }
    else if (gameObject.transform.y < 0) { gameObject.transform.y = ctx.canvas.height }
    if (gameObject.transform.x > ctx.canvas.width) { gameObject.transform.x = 0 }
    else if (gameObject.transform.x < 0) { gameObject.transform.x = ctx.canvas.width }
}