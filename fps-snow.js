class FpsSnow {
    constructor(canvas, ground, snowflakes) {
        this.canvas = canvas;
        this.ground = ground;
        this.snowflakes = snowflakes;

        // Mouse event handlers
        this.mouse = new Mouse(this.canvas);
        $(document).on('mousedown', this.mouse.onDown.bind(this.mouse));
        $(document).on('mouseup', this.mouse.onUp.bind(this.mouse));
        $(document).on('mousemove', this.mouse.onMove.bind(this.mouse));

        // Keyboard event handlers
        this.keyboard = new Keyboard();
        $(document).on('keydown', this.keyboard.onPressed.bind(this.keyboard));
        $(document).on('keyup', this.keyboard.onReleased.bind(this.keyboard));

        // Register callbacks with quoll.js
        registerDisplay(this.display.bind(this));
        registerReshape(this.reshape.bind(this));
        registerIdle(this.idle.bind(this));

        // Make canvas fill the window
        canvasFullWindow(true);

        // Setup camera transformation
        this.camera = new Camera();

        // GL States
        gl.enable(gl.DEPTH_TEST);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
    }

    display() {
        gl.useProgram(this.ground.shader.get());

        // send the camera position to the shader
        let cameraPosLoc = gl.getUniformLocation(this.ground.shader.get(), 'cameraPos');
        gl.uniform3f(cameraPosLoc, ...whereAmI(this.camera.matrix));

        const norm = rgb => [rgb[0] / 255., rgb[1] / 255., rgb[2] / 255.];

        gl.clearColor(...norm([180., 235., 255.]), 1.);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Camera transformation
        mat4.identity(gl.mvMatrix);
        mat4.multiply(gl.mvMatrix, gl.mvMatrix, this.camera.matrix);

        pushMvMatrix(gl);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [1., 0., 0.]);
        // Place and draw object
        this.ground.show();
        popMvMatrix(gl);

        gl.useProgram(this.snowflakes[0].shader.get());
        for (const snowflake of this.snowflakes) {
            snowflake.show();
        }

        gl.flush();
    }

    reshape(w, h) {
        // Save canvas dimensions
        this.canvas.width = w;
        this.canvas.height = h;

        // Set up viewport
        gl.viewport(0, 0, w, h);

        // Set up projection
        mat4.perspective(
            gl.pMatrix,
            Math.PI/180. * 60.,  // y field-of-view angle
            w/h,                 // Viewport aspect ratio
            0.1, 50.             // Near & far distances
        );
    }

    idle() {
        var elapsedtime = getElapsedTime(0.1);

        for (const snowflake of this.snowflakes) {
            snowflake.update(elapsedtime, whereAmI(this.camera.matrix));
        }

        // Perspective rotation
        if (elapsedtime == 0.) {
            return;
        }

        // Fly
        var speed = 3.;

        // Perspective translation
        const cameraVel = this.camera.getVel(this.keyboard.isDown);
        this.camera.translate(cameraVel);

        const mouseVel = this.mouse.getVel(elapsedtime);

        const angle = mouseVel[0];
        const axis = [0., 1., 0.];
        this.camera.rotate(angle, axis);

        this.mouse.savePrev();


        postRedisplay();
    }
}

