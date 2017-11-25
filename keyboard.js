"use strict"

class Keyboard {
    constructor() {
    }

    handler(evt) {
        var ch = keyFromEvent(evt);

        // Note: Keys like [Esc] may be handled inconsistently between
        // browsers. Alas! So we only deal with printable ASCII here.
        switch (ch) {
            case ' ':  // Space: toggle rotation
                rotflag = !rotflag;
                break;
            case '1':  // '1'-'6': toggle faces
                drawfaces[0] = !drawfaces[0];
                break;
            case '2':
                drawfaces[1] = !drawfaces[1];
                break;
            case '3':
                drawfaces[2] = !drawfaces[2];
                break;
            case '4':
                drawfaces[3] = !drawfaces[3];
                break;
            case '5':
                drawfaces[4] = !drawfaces[4];
                break;
            case '6':
                drawfaces[5] = !drawfaces[5];
                break;
            default:
                return;
        }

        postRedisplay();
    }
}
