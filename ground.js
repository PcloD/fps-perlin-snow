// Classes Definitions
class Ground {
    constructor(shader) {
        this.color = [1., 1., 1.];
        this.size = WORLD_SIZE;

        this.shader = shader;
    }

    show() {
        drawSquare(gl, this.size, ...this.color, 1.);
    }
}

