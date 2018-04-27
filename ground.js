// Classes Definitions
class Ground {
    constructor(shader) {
        this.texture = loadTexture(gl, 'assets/snow.jpeg');

        this.color = [1., 1., 1.];
        this.size = WORLD_SIZE;

        this.shader = shader;
    }

    show() {
        pushMvMatrix(gl);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [1., 0., 0.]);
        // Place and draw object
        drawSquare(gl, this.size, ...this.color, 1.);
        popMvMatrix(gl);
    }

    setShaderProg() {
        this.setTextureOptions();

        const prog = this.shader.get();
        gl.useProgram(prog);

        let fogColorLoc = gl.getUniformLocation(prog, 'fogColor');
        gl.uniform4fv(fogColorLoc, FOG_COLOR);

        let snowColorLoc = gl.getUniformLocation(prog, 'snowColor');
        gl.uniform4fv(snowColorLoc, SNOW_COLOR);

        let darkSnowColorLoc = gl.getUniformLocation(prog, 'darkSnowColor');
        gl.uniform4fv(darkSnowColorLoc, DARK_SNOW_COLOR);

        let loc = gl.getUniformLocation(prog, 'tex0');
        if (loc != -1) {
            console.log("can't find tex0 location...")
            gl.uniform1i(loc, 0);  // Shader channel 0
        }

    }

    setTextureOptions() {
    }

}


