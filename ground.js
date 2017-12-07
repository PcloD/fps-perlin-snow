// Classes Definitions
class Ground {
    constructor(shader) {
        this.color = [1., 1., 1.];
        this.size = WORLD_SIZE;

        this.shader = shader;
    }

    show() {
        this.setShaderProg();

        pushMvMatrix(gl);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [1., 0., 0.]);
        // Place and draw object
        drawSquare(gl, this.size, ...this.color, 1.);
        popMvMatrix(gl);
    }

    setShaderProg() {
        const prog = this.shader.get();
        console.log(prog);
        gl.useProgram(prog);

        let fogColorLoc = gl.getUniformLocation(prog, 'fogColor');
        gl.uniform4fv(fogColorLoc, FOG_COLOR);

        let snowColorLoc = gl.getUniformLocation(prog, 'snowColor');
        gl.uniform4fv(snowColorLoc, SNOW_COLOR);
    }

}


