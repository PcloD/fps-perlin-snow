// Classes Definitions
class Ground {
    constructor(shader) {
        this.texobj = loadTexture(gl, './assets/snow-2.png');

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

        for (const slider of sliders) {
            const loc = gl.getUniformLocation(prog, slider.id);
            const val = parseFloat(slider.value);
            gl.uniform1f(loc, val);
        }
    }

    setTexture(prog) {
        let loc = gl.getUniformLocation(prog, "snow_tex");
        gl.uniform1i(loc, this.texobj.number);
        gl.activeTexture(gl.TEXTURE0 + this.texobj.number);
        gl.bindTexture(gl.TEXTURE_2D, this.texobj.texture);
    }
}


