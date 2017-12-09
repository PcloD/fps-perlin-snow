// Moon class. Confusing name is intentional
// and part of the dev team culture.
// It is understood that it is bad practice.

class NightSun {
  constructor(shader){
    this.location();
    this.size = 10;
    this.color=[1., 0., .5];
    this.shader = shader;
  }

    static setTexture(){
        let texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

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

        let image = new Image();
        image.onload = function() {
            var level = 0;
            var internalFormat = gl.RGBA;
            var imgFormat = gl.RGBA;
            var imgType = gl.UNSIGNED_BYTE;
            var pixels = image;
            gl.texImage2D(gl.TEXTURE_2D,
                level, internalFormat,
                imgFormat, imgType, pixels);
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        image.src ='assets/sun-icon.png';
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

    let fogColorLoc=gl.getUniformLocation(prog, 'fogColor');
    gl.uniform4fv(fogColorLoc, FOG_COLOR);
  }

  location(){
    this.position = [
      0.,
      20.,
      5.
    ];
  }
}
