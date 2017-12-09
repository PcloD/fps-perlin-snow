class FpsSnow {
    constructor(canvas, ground, camera, yellowman, snowflakes) {
        this.canvas = canvas;
        this.ground = ground;
        this.camera = camera;
        this.snowflakes = snowflakes;
        this.moon = yellowman;

        console.log(this.snowflakes);
        console.log(this.moon);

        this.moon.setTexture();
        for (let i = 0; i < NUM_SNOWFLAKES; ++i) {
            this.snowflakes[i].setTexture();
        }

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

        // GL States
        gl.enable(gl.DEPTH_TEST);

        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
    }

    display() {
        this.clear();
        this.setToView(this.camera.matrix);

        this.ground.setShaderProg();
        this.ground.show();

        this.snowflakes[0].setShaderProg();
        for (const snowflake of this.snowflakes) {
            snowflake.show();
        }
        this.moon.setShaderProg();
        this.moon.show();
        gl.flush();
    }

    setToView(matrix) {
        // Camera transformation
        mat4.identity(gl.mvMatrix);
        mat4.multiply(gl.mvMatrix, gl.mvMatrix, matrix);
    }

    clear() {
        gl.clearColor(...FOG_COLOR);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
            0.1, 500.             // Near & far distances
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
