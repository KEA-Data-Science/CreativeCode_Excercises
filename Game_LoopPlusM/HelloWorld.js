let ctx
const SCENEMANAGER = new SceneManager()

window.addEventListener("load",function () { setup()})

function setup() {
    let canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    let helloWorld = new GameObject("Hello World Object",
        {
            update: function (gameObject) {
                newX = ctx.canvas.width / 2
                newY = ctx.canvas.height / 2
                gameObject.transform.newPosition(newX, newY)
            }
        }
    )
    helloWorld.sprite = new RenderText("Hello World",helloWorld,45)

    SCENEMANAGER.includeInScene(helloWorld)
    SCENEMANAGER.GAMELOOP.doLoop()
}