class Snowflake {
    constructor(shader) {
        this.reset();
        this.size = .1;
        this.color = [1., 1., 1.];
        this.gravity = .7;
        this.shader = shader;
    }

    makeTexture(){
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        var tempImg = new Uint8Array([0, 128, 255, 255]);

        var level = 0;
        var internalFormat = gl.RGBA;
        var width = 1;
        var height = 1;
        var border = 0;
        var imgFormat = gl.RGBA;
        var imgType = gl.UNSIGNED_BYTE;
        var pixels = tempImg;
        gl.texImage2D(gl.TEXTURE_2D,
            level, internalFormat,
            width, height, border,
            imgFormat, imgType, pixels);
        gl.generateMipmap(gl.TEXTURE_2D);
        this.texture_2D = gl.TEXTURE_2D;
        let image = new Image();
        image.onload = function(parent) {
            var level = 0;
            var internalFormat = gl.RGBA;
            var imgFormat = gl.RGBA;
            var imgType = gl.UNSIGNED_BYTE;
            var pixels = image;
            gl.texImage2D(parent.texture_2D,
                          level, internalFormat,
                          imgFormat, imgType, pixels);
            gl.generateMipmap(parent.texture_2D);
        };
        image.src = 'assets/snowflake-small.png';
        this.image = image;
    }

    setTexture() {
        this.texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        this.makeTexture();
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

    setShaderProg() {
        const prog = this.shader.get();
        gl.useProgram(prog);
        this.image.onload(this);

        let fogColorLoc = gl.getUniformLocation(prog, 'fogColor');
        gl.uniform4fv(fogColorLoc, FOG_COLOR);
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
        const scale = .01;
        this.position[1] -= this.gravity * time;
        const baseWind = .005;
        const diff = Math.cos(this.position[1] * .5) * scale;
        this.position[0] -= baseWind + diff;
        this.position[2] -= baseWind + diff;

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
