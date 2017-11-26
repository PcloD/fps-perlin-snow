class Snowflake {
    constructor(worldSize) {
        this.worldSize = worldSize;
        this.reset();
        this.size = .3;
        this.color = [1., 1., 1.];

        this.gravity = .09;
    }

    show() {
        pushMvMatrix(gl);
        mat4.translate(gl.mvMatrix, gl.mvMatrix, this.position);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [0., 1., 0.]);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [0., 1., 0.]);
        drawSquare(gl, this.size, ...this.color, 1.);
        popMvMatrix(gl);
    }

    update() {
        const scale = .001;
        this.position[1] -= this.gravity;
        const noiseVal = noise.simplex3(scale * this.position[0], scale *  this.position[1], scale *  this.position[2]);
        this.position[0] -= noiseVal;
        this.position[2] -= noiseVal;

        if (this.position[1] < -2. * this.size) {
            this.reset();
        }
    }

    reset() {
        this.position = [
            Math.random() * this.worldSize - this.worldSize / 2.,
            Math.random() * 100 - 5.,
            Math.random() * this.worldSize - this.worldSize / 2.
        ];
    }
}
