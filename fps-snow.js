class FpsSnow {
    constructor(canvasId, vertex, frag) {
        // Initialize quoll.js & WebGL
        gl = quollInit(canvasId);
        if (!gl) return;  // Could not intialize; exit

        // Shaders
        shaderprog1 = makeProgramObject(gl, vertex, frag);

        // Mouse event handlers
        this.mouse = new Mouse(canvasId);
        $(document).on('mousedown', this.mouse.onDown.bind(this.mouse));
        $(document).on('mouseup', this.mouse.onUp.bind(this.mouse));
        $(document).on('mousemove', this.mouse.onMove.bind(this.mouse));

        // Keyboard event handlers
        this.keyboard = new Keyboard();
        $(document).on('keypress', this.keyboard.handler.bind(this.keyboard));

        // Register callbacks with quoll.js
        registerDisplay(this.display.bind(this));
        registerReshape(this.reshape.bind(this));
        registerIdle(this.idle.bind(this));

        // Make canvas fill the window
        canvasFullWindow(true);
        cameramatrix = mat4.create();
        mat4.rotate(cameramatrix, cameramatrix, Math.PI/180. * 5, [0., 1., 0.]);
        mat4.translate(cameramatrix, cameramatrix, [0., 0., -4.]);
        // Object
        rotflag = true;
        rotangle = 0.;
        rotspeed = Math.PI/180. * 500.;
        drawfaces = [];            // Empty Array
        for (var i = 0; i < 6; ++i) {
            drawfaces.push(true);  // Add item to Array
        }

        ground = new Ground();

        // GL States
        gl.enable(gl.DEPTH_TEST);
    }

    display() {
        gl.useProgram(shaderprog1);

        gl.clearColor(135 / 255., 206 / 255., 235. / 255, 1.);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Camera transformation
        mat4.identity(gl.mvMatrix);
        mat4.multiply(gl.mvMatrix, gl.mvMatrix, cameramatrix);

        // Place and draw object
        pushMvMatrix(gl);
        mat4.translate(gl.mvMatrix, gl.mvMatrix,
            [0., 0., 0.]);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix,
            rotangle, [0.5, 1., 0.]);
        var objscale = 1.;
        mat4.scale(gl.mvMatrix, gl.mvMatrix,
            [objscale, objscale, objscale]);


        popMvMatrix(gl);
        ground.show();

        // Draw something that moves with the mouse
        pushMvMatrix(gl);
        var movescale = 0.01;
        mat4.translate(gl.mvMatrix, gl.mvMatrix,
            [this.mouse.pos[0]*movescale, this.mouse.pos[1]*movescale, 0.]);

        popMvMatrix(gl);

        gl.flush();
    }

    reshape(w, h) {
        // Save canvas dimensions
        canvaswidth = w;
        canvasheight = h;

        // Set up viewport
        gl.viewport(0, 0, w, h);

        // Set up projection
        mat4.perspective(
            gl.pMatrix,
            Math.PI/180. * 60.,  // y field-of-view angle
            w/h,                 // Viewport aspect ratio
            0.1, 20.
        );           // Near & far distances
    }

    idle() {
        var elapsedtime = getElapsedTime(0.1);

        // Fly
        var speed = 1.;

        if (this.mouse.isDown) {
            var new_trans = mat4.create();
            mat4.translate(new_trans, new_trans, [0., 0., speed*elapsedtime]);

            mat4.multiply(cameramatrix, new_trans, cameramatrix);
            postRedisplay();
        }

        var turnfactor = 0.00005;
        var turn = mat4.create();

        mat4.rotate(turn, turn,
            turnfactor * Math.sqrt(this.mouse.pos[0] * this.mouse.pos[0] + this.mouse.pos[1] * this.mouse.pos[1]),
            [-this.mouse.pos[1], this.mouse.pos[0], 0.]
        );

        mat4.multiply(cameramatrix, turn, cameramatrix);
        postRedisplay();

        if (rotflag) {
            rotangle += rotspeed * elapsedtime;
            postRedisplay();
        }
    }
}

