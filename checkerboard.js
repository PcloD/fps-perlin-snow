// Classes Definitions
class Checkerboard {
    constructor(size) {
        var BLACK = [.95, .95, .95];
        var WHITE = [1., 1., 1.];

        this.colors = [BLACK, WHITE];

        this.size = size;
    }

    show() {
        const color = this.colors[0];
        drawSquare(gl, this.size, ...color, 1.);
    }
}

