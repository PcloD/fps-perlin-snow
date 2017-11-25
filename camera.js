class Camera {
    constructor() {
        this.matrix = mat4.create();
        mat4.translate(this.matrix,
            this.matrix, [0., 0., -4.]);

        this.angle = 0.;
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

        const turnfactor = 0.0001;
        let turn = mat4.create();

        mat4.rotate(turn, turn,
            turnfactor * angle,
            axis
        );

        mat4.multiply(this.matrix, turn, this.matrix);
    }
}
