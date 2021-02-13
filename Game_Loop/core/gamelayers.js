class LayerElement {
    constructor(name, gameObject,priority=0) {        
        this.name = name
        this.gameObject = gameObject // should of course be or correspond to a GameObject        
        this.priority // multiple objects in the same spot will have different priority; lower (<) priority gets drawn first
    }
}

class Layer {
    constructor(name,layerElements = []) {
        this.name = name
        this.elements = layerElements // should only contain LayerElements
    }
}