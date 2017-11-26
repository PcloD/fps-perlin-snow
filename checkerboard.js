// Classes Definitions
class Checkerboard {
    constructor() {
        var BLACK = [.95, .95, .95];
        var WHITE = [1., 1., 1.];

        this.colors = [BLACK, WHITE];

        this.size = 100.;
    }

    show() {
        const color = this.colors[0];
        drawSquare(gl, this.size, color[0], color[1], color[2], 1.);
    }

    size() {
        console.log(this.size);
        return this.size;
    }

    height() {
        return this.size();
    }

    width() {
        return this.size();
    }
}

