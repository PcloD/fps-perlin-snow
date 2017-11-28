class Snowflake {
    constructor(worldSize) {
        this.worldSize = worldSize;
        this.reset();
        this.size = .3;
        this.color = [1., 1., 1.];

        this.gravity = 1.5;
    }

    show() {
        pushMvMatrix(gl);
        mat4.translate(gl.mvMatrix, gl.mvMatrix, this.position);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [0., 1., 0.]);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [0., 1., 0.]);
        drawSquare(gl, this.size, ...this.color, 1.);
        popMvMatrix(gl);
    }

    update(time, cameraPos) {
        const scale = .001;
        this.position[1] -= this.gravity * time;
        const noiseVal = noise.simplex3(scale * this.position[0], scale *  this.position[1], scale *  this.position[2]) * time;
        this.position[0] -= noiseVal;
        this.position[2] -= noiseVal;

        if (this.position[1] < -2. * this.size || this.isOutOfRange(cameraPos)) {
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

    isOutOfRange(checkPos) {
        let calcDist = (x, y) => (x-y) * (x-y);

        let distance = calcDist(this.position[0], checkPos[0]) +
            calcDist(this.position[1], checkPos[1]) +
            calcDist(this.position[2], checkPos[2]);

        return distance > VIEW_DISTANCE * VIEW_DISTANCE;
    }
}
