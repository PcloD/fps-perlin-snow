class Mouse {
    constructor(canvas) {
        // Mouse
        this.pos = vec2.fromValues(0., 0.);           // vec2: mouse pos in pixels
        this.prev = [];
        this.prev[0] = this.pos[0] + .01;
        this.prev[1] = this.pos[1] + .01;

        this.isDown = false;          // Boolean: is mouse button pressed?

        this.canvas = canvas;
    }

    // saveMousePos
    // Given event object, save mouse position in global mousepos, in pixels
    // right, up from center of canvas.
    savePos(evt) {
        const mouseposCanvas = this.canvas.getMousePos(evt);


        this.pos[0] = mouseposCanvas[0] - this.canvas.width/2;
        this.pos[1] = this.canvas.height/2 - mouseposCanvas[1];
    }

    savePrev() {
        this.prev[0] = this.pos[0];
        this.prev[1] = this.pos[1];
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

    getVel(time) {
        let scale = 1.;
        return [ scale*(-this.prev[0] + this.pos[0]) / time, scale * (-this.prev[1] + this.pos[1]) / time]
    }
}
