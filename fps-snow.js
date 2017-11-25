class FpsSnow {
    constructor(canvasid, vertex, frag) {
        // Canvas
        savedcanvasid = canvasid;

        // Initialize quoll.js & WebGL
        gl = quollInit(canvasid);
        if (!gl) return;  // Could not intialize; exit

        // Shaders
        shaderprog1 = makeProgramObject(gl, vertex, frag);

        // Register callbacks with quoll.js
        registerDisplay(this.display);
        registerReshape(this.reshape);
        registerIdle(this.idle);

        canvasFullWindow(true);  // Make canvas fill the window

        // Set up other event handlers
        document.addEventListener('keypress', myKeyboard, false);
        document.addEventListener('mousedown', myMouseDown, false);
        document.addEventListener('mouseup', myMouseUp, false);
        document.addEventListener('mousemove', myMouseMove, false);

        // Mouse
        mousepos = vec2.fromValues(0., 0.);
        mousedown = false;

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
            [mousepos[0]*movescale, mousepos[1]*movescale, 0.]);

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

        if (mousedown) {
            var new_trans = mat4.create();
            mat4.translate(new_trans, new_trans, [0., 0., speed*elapsedtime]);

            mat4.multiply(cameramatrix, new_trans, cameramatrix);
            postRedisplay();
        }

        var turnfactor = 0.00005;
        var turn = mat4.create();

        mat4.rotate(turn, turn,
            turnfactor * Math.sqrt(mousepos[0] * mousepos[0] + mousepos[1] * mousepos[1]),
            [-mousepos[1], mousepos[0], 0.]
        );

        mat4.multiply(cameramatrix, turn, cameramatrix);
        postRedisplay();

        if (rotflag) {
            rotangle += rotspeed * elapsedtime;
            postRedisplay();
        }
    }
}

