// Moon class. Confusing name is intentional
// and part of the dev team culture.
// It is understood that it is bad practice.

class NightSun {
    constructor(shader){
        this.location();

        this.texobj = loadTexture(gl, 'assets/moon-icon.png');

        this.size = 25.;
        this.color=[1., 0., .5];
        this.shader = shader;
    }

    show() {
        pushMvMatrix(gl);
        mat4.translate(gl.mvMatrix, gl.mvMatrix, this.position);
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

    setShaderProg(){
        const prog = this.shader.get();
        gl.useProgram(prog);

        this.setTexture(prog);
        let fogColorLoc = gl.getUniformLocation(prog, 'fogColor');
        gl.uniform4fv(fogColorLoc, FOG_COLOR);
    }

    setTexture(prog) {
        let loc = gl.getUniformLocation(prog, "tex");
        gl.uniform1i(loc, this.texobj.number);
        gl.activeTexture(gl.TEXTURE0 + this.texobj.number);
        gl.bindTexture(gl.TEXTURE_2D, this.texobj.texture);
    }

    location(){
        this.position = whereAmI(gl.mvMatrix);
        this.position[2] -= 300;
        this.position[1] += 140;
        this.position[0] += 170;
    }
}
