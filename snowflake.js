class Snowflake {
    constructor(shader) {
        this.reset();
        this.size = .2;
        this.color = [1., 1., 1.];
        this.gravity = 1.5;

        this.shader = shader;
    }

    show() {
        pushMvMatrix(gl);

        mat4.translate(gl.mvMatrix, gl.mvMatrix, this.position);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [0., 1., 0.]);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [0., 1., 0.]);
        this.billboard();

        drawSquare(gl, this.size, ...this.color, 1.);
        popMvMatrix(gl);
    }

    billboard() {
        var p = whereAmI(gl.mvMatrix);
        // Disregard y because y=0 since it is cylindrical billboarding
        var x = p[0];
        var z = p[2];

        var dotProduct = z / Math.sqrt(x*x + z*z);
        var angle = Math.acos(dotProduct);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, angle, [0., x, 0.]);
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
            Math.random() * WORLD_SIZE - WORLD_SIZE / 2.,
            Math.random() * 100 - 5.,
            Math.random() * WORLD_SIZE - WORLD_SIZE / 2.
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
