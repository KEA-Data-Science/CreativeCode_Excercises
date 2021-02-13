const GAMEINPUT = {
    keyPressSubscribers: [],  // should contain only callback methods, taking a single parameter for keystroke
    _interpretKey: function (e) {
        let keynum;

        if (window.event) { // IE                  
            keynum = e.keyCode;
        } else if (e.which) { // Netscape/Firefox/Opera                 
            keynum = e.which;
        }

        lastKeyStroke = String.fromCharCode(keynum)
        console.log(lastKeyStroke)

        GAMEINPUT._informKeyPressSubscribers(lastKeyStroke)
    },
    _informKeyPressSubscribers: function (keyStroke) {
        GAMEINPUT.keyPressSubscribers.forEach(subscriberCallback => {
            subscriberCallback(keyStroke)
        });
    },
    subscribeToKeyPress: function (callback) {
        if (GAMEINPUT.keyPressSubscribers.indexOf(callback) == -1) {
            GAMEINPUT.keyPressSubscribers.push(callback)
        }
    },
    unsubscribeFromKeyPress: function (callback) {
        indexOfCallback = GAMEINPUT.keyPressSubscribers.indexOf(callback)
        if (indexOfCallback != -1) {
            GAMEINPUT.keyPressSubscribers.splice(indexOfCallback, 1)
        }
    },
    startDetectingInput: function () {
        window.addEventListener("keydown", this._interpretKey)
    }
}


