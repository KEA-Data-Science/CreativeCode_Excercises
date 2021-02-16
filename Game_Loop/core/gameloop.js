class GameLoop {
    constructor(scenemanager) {
        this.scenemanager = scenemanager
        console.log(scenemanager)
    }
    doLoop = function () {
        
        HEART.beat()

        // Round one: update all object states
        for (let i = 0; i < scenemanager.LAYERS.length; i++) {
            const layer = scenemanager.LAYERS[i];
            for (let j = 0; j < layer.elements.length; j++) {
                layer.elements[j].gameObject.qualia.update(layer.elements[j].gameObject)
                // console.log("UPDATE ON: " + layer.elements[j].gameObject)                                            
            }
        }

        _adjustCanvas() // functions from renderer2D
        _clearCanvas()
        
        // Round two: render all active and renderable objects
        // counter starts at one, because layer 0 is never rendered (it is updated)
        for (let i = 1; i < scenemanager.LAYERS.length; i++) {
            const layer = scenemanager.LAYERS[i];
            for (let j = 0; j < layer.elements.length; j++) {
                if (layer.elements[j].gameObject.activeInScene && !layer.elements[j].gameObject.notRenderable) {

                    layer.elements[j].gameObject.sprite.render()
                   // console.log("RENDER ON Layer: " + i + " " + layer.elements[j].gameObject.name)
                }
            }
        }

        // plan next loop
        setTimeout(scenemanager.GAMELOOP.doLoop,30)     
    }
}
