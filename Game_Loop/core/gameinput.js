const GAMEINPUT = {
    keyPressSubscribers: [],  // should contain only callback methods, taking a single parameter for keystroke
    mouse: [ x = 0, y = 0 ],
    _interpretKey: function (e) {
        let keynum;

        if (window.event) { // IE                  
            keynum = e.keyCode;
        } else if (e.which) { // Netscape/Firefox/Opera                 
            keynum = e.which;
        }

        lastKeyStroke = String.fromCharCode(keynum)
        //console.log(lastKeyStroke)

        GAMEINPUT._informKeyDownSubscribers(lastKeyStroke)
    },
    _interpretMouseMove: function (e) {
        GAMEINPUT.mouse.x = e.pageX
        GAMEINPUT.mouse.y = e.pageY
    },
    _informKeyDownSubscribers: function (keyStroke) {

        for (let index = 0; index < GAMEINPUT.keyPressSubscribers.length; index++) {
            const sub = GAMEINPUT.keyPressSubscribers[index];
            sub.qualia.playerInput(keyStroke, sub)
        }
    },
    subscribeToKeyDown: function (gameObject) {
        if (GAMEINPUT.keyPressSubscribers.indexOf(gameObject) == -1) {
            GAMEINPUT.keyPressSubscribers.push(gameObject)
        }
    },
    unsubscribeFromKeyPress: function (gameObject) {
        indexOfCallback = GAMEINPUT.keyPressSubscribers.indexOf(gameObject)
        if (indexOfCallback != -1) {
            GAMEINPUT.keyPressSubscribers.splice(indexOfCallback, 1)
        } else {
            console.log("Request to unsubscribe callback from keydown press failed. Callback not found")
        }
    },
    startDetectingInput: function () {
        window.addEventListener("keydown", this._interpretKey)
        document.body.addEventListener("mousemove", this._interpretMouseMove)
    }
}
