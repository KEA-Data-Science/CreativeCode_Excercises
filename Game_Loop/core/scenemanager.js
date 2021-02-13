// Main idea: A scene manager manages all LayerElements in a Scene.
// Create a scenemanager for each scene, and include the gameobjects of devilish design
// Specific responsibilities: 
//  * can include layer-elements and supply them for gameloop for processing
//  * can accept new layer objects, and automatically supply them for gameloop

class SceneManager {
    // should only ever contain LayerElements
    LAYERS = [
        new Layer("norender", []),
        new Layer("background", []),
        new Layer("middleground", []),
        new Layer("actor", []),
        new Layer("foreground", []),
        new Layer("ui", [])
    ] // objects never rendered should be placed in layer 0

    /**
     * 
     * @param {GameObject} gameObject 
     * @param {string or number} layer : layer defaults to layer 3    
     * @param {0-3} priority 
     */
    includeInLayer = function (gameObject, layer = 3, priority = 0) {
        let element = new LayerElement(gameObject.name, gameObject, priority)
        this.LAYERS[layer].elements.push(element)
    }

}