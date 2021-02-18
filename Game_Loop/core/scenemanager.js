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

    GAMEOBJECTSBYID = {}

    GAMELOOP

    /**
     * 
     * @param {GameObject} gameObject : GameObject type object 
     * @param {number} layer : layer defaults to layer 4, termed the 'actor layer'
     * @param {number} priority : higher priority gets drawn later, with objects of same priority the order is unpredicatable (not exactly, but...)
     */
    includeInScene = function (gameObject, layer = 4, priority = 0) {
        let element = new LayerElement(gameObject.name, gameObject, priority)
        this.LAYERS[layer].elements.push(element)

        // sorting array by ascending priority; higher priority gets drawn later, with objects of same priority the order is unpredicatable (not exactly, but)
        this.LAYERS[layer].elements.sort(function (a, b) { return a.priority - b.priority; })

        this.GAMEOBJECTSBYID[gameObject.id] = gameObject
    }
    removeFromScene = function (gameObject, layer = -1) {
        // gameObject.remove() // gameobject cleanup chance, must be overwritten

        // Remove from layer
        if (layer === -1) {
            // go through all layers
            for (let i = 0; index < this.LAYERS.length; i++) {
                const layer = this.LAYERS[i];

                for (let j = 0; j < layer.length; j++) {
                    const element = layer[i][j];
                    if (element.gameObject.id === gameObject.id) {
                        console.log(layer)
                        layerElement = this.LAYERS[i].elements.splice(j, 1)
                        console.log(layer)
                        console.log(layerElement)
                        return 
                    }
                }
            }
        }
        // Remove from id list
        
    }
    // returns all gameObjects found by name of gameobject (the searched elements are LayerElements wrapping gameobject)
    findGameObjects = function (name, layer = 4) {
        const matches = []
        if (layer > -1 || layer < this.LAYERS.length) {

            this.LAYERS[layer].elements.forEach(e => {
                if (e.name === name) { matches.push(e.gameObject) }
            })

        }
        return matches
    }

    // returns all gameObjects found by name of gameobject (the searched elements are LayerElements wrapping gameobject)
    findGameObjectByID = function (id) {
        return this.GAMEOBJECTSBYID[id]
    }

}