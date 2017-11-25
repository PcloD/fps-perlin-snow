class Mouse {
    constructor(canvasId) {
        // Mouse
        this.pos = vec2.fromValues(0., 0.);           // vec2: mouse pos in pixels

        this.isDown = false;          // Boolean: is mouse button pressed?

        this.canvasId = canvasId;
    }

    // saveMousePos
    // Given event object, save mouse position in global mousepos, in pixels
    // right, up from center of canvas.
    savePos(evt) {
        const mouseposCanvas = getMousePos(getCanvas(this.canvasId), evt);
        this.pos[0] = mouseposCanvas[0] - canvaswidth/2;
        this.pos[1] = canvasheight/2 - mouseposCanvas[1];
    }


    onDown(evt) {
        this.savePos(evt);
        this.isDown = true;
        postRedisplay();
    }


    onUp(evt) {
        this.savePos(evt);
        this.isDown = false;
        postRedisplay();
    }


    onMove(evt) {
        this.savePos(evt);
        postRedisplay();
    }
}
