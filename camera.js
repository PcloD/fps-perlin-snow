class Camera {
    constructor() {
        this.matrix = mat4.create();

        mat4.translate(this.matrix,
            this.matrix, [0., -2., 0.]);

        this.vel = [0., 0., 0.];

        this.speed = 0.05;
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

    getVel(isDown) {
        if (isDown.w) {
            this.vel[2] = 1 * this.speed;
        }
        if (isDown.s) {
            this.vel[2] = -1 * this.speed;
        }

        if (!isDown.w && !isDown.s) {
            this.vel[2] = 0.;
        }

        if (isDown.d) {
            this.vel[0] = -1 * this.speed;
        }
        if (isDown.a) {
            this.vel[0] = 1 * this.speed;
        }
        if (!isDown.d && !isDown.a) {
            this.vel[0] = 0.;
        }

        return this.vel;
    }

}
