"use strict"

class Keyboard {
    constructor() {
        $(document).on('keydown')
        this.isDown = {
            w: false,
            a: false,
            s: false,
            d: false
        }
    }

    onPressed(evt) {
        let key = String.fromCharCode(evt.keyCode).toLowerCase();
        this.setKeys(key, true);
    }

    onReleased(evt) {
        let key = String.fromCharCode(evt.keyCode).toLowerCase();
        this.setKeys(key, false);
    }

    setKeys(key, value) {
        if (key === 'w')
            this.isDown.w = value;
        if (key === 'a')
            this.isDown.a = value;

        if (key === 's')
            this.isDown.s = value;
        if (key === 'd')
            this.isDown.d = value;
    }
}
