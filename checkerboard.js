// Classes Definitions
class Checkerboard {
    constructor() {
        var BLACK = [.95, .95, .95];
        var WHITE = [1., 1., 1.];

        this.colors = [BLACK, WHITE];

        this.numTiles = 60;
        this.tileSize = 0.5;
    }

    show() {
        pushMvMatrix(gl);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, -Math.PI / 90., [1., 0., 0.]);

        let gap = this.tileSize;

        for (let r = 0; r < this.numTiles; ++r) {
            // Draw a row of the checkerboard
            pushMvMatrix(gl);
            for (let c = 0; c < this.numTiles; ++c) {
                let color = this.colors[(c+r) % 2];

                mat4.translate(gl.mvMatrix, gl.mvMatrix,
                    [gap, 0.0 , 0.]);
                drawSquare(gl, this.tileSize, color[0], color[1], color[2], 1.);

            }
            popMvMatrix(gl);

            // Move to next column
            mat4.translate(gl.mvMatrix, gl.mvMatrix,
                [0., gap , 0.]);


        }

        popMvMatrix(gl);
    }
}

