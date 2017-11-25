class Camera {
    constructor() {
        this.matrix = mat4.create();
        mat4.translate(this.matrix,
            this.matrix, [0., 0., -4.]);
    }

    translate(direction) {
        const translation = mat4.create();

        mat4.translate(translation,
            translation, direction);

        mat4.multiply(this.matrix,
            translation, this.matrix);

        postRedisplay();
    }

    rotate(angle, axis) {
        let turnfactor = 0.00005;
        let turn = mat4.create();

        mat4.rotate(turn, turn,
            turnfactor * angle,
            axis
        );

        mat4.multiply(this.matrix, turn, this.matrix);
    }
}
