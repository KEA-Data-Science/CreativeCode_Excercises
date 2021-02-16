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

    GAMELOOP

    /**
     * 
     * @param {GameObject} gameObject 
     * @param {string or number} layer : layer defaults to layer 4, termed the 'actor layer'    
     * @param {0-3} priority 
     */
    includeInLayer = function (gameObject, layer = 4, priority = 0) {
        let element = new LayerElement(gameObject.name, gameObject, priority)
        this.LAYERS[layer].elements.push(element)

        // sorting array by ascending priority; higher priority gets drawn later, with objects of same priority the order is unpredicatable (not exactly, but)
        this.LAYERS[layer].elements.sort(function (a, b) { return a.priority - b.priority; })
    }
    // returns all gameObjects found by name of gameobject (the searched elements are LayerElements wrapping gameobject)
    findGameObjects = function (name, layer = 4) {
        const matches = []
        if (layer > -1 ?? layer < this.LAYERS.length) {

            this.LAYERS[layer].elements.forEach(e => {  
                if(e.name === name){matches.push(e.gameObject)}
            })          
        }
        return matches
    }

        // returns all gameObjects found by name of gameobject (the searched elements are LayerElements wrapping gameobject)
        findGameObjectByID = function (id, layer = 4) {
            let match
            if (layer > -1 ?? layer < this.LAYERS.length) {                        
                this.LAYERS[layer].elements.forEach(e => {  
                    if(e.gameObject.id === id){match = e.gameObject}
                    return match
                })          
            }
            return match
        }

}