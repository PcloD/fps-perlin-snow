// Classes Definitions
class Ground {
    constructor(shader) {
        this.texobj = loadTexture(gl, 'assets/moon-icon.png');

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
        const prog = this.shader.get();
        gl.useProgram(prog);

        this.setTexture(prog);

        let fogColorLoc = gl.getUniformLocation(prog, 'fogColor');
        gl.uniform4fv(fogColorLoc, FOG_COLOR);

        let snowColorLoc = gl.getUniformLocation(prog, 'snowColor');
        gl.uniform4fv(snowColorLoc, SNOW_COLOR);

        let darkSnowColorLoc = gl.getUniformLocation(prog, 'darkSnowColor');
        gl.uniform4fv(darkSnowColorLoc, DARK_SNOW_COLOR);

        let loc = gl.getUniformLocation(prog, 'snow_tex');
        if (loc != -1) {
            console.log("can't find tex0 location...")
            gl.uniform1i(loc, 0);  // Shader channel 0
        }
    }

    setTexture(prog) {
        let loc = gl.getUniformLocation(prog, "snow_tex");
        gl.uniform1i(loc, this.texobj.number);
        gl.activeTexture(gl.TEXTURE0 + this.texobj.number);
        gl.bindTexture(gl.TEXTURE_2D, this.texobj.texture);
    }
}


