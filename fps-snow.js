class FpsSnow {
    constructor(canvasId, vertex, frag) {
        this.canvas = new Canvas(canvasId)

        // Initialize quoll.js & WebGL
        gl = quollInit(this.canvas.id);
        if (!gl) return;  // Could not intialize; exit

        // Shaders
        this.mainShader = makeProgramObject(gl, vertex, frag);

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

        const worldSize = 100.;
        this.checkerboard = new Checkerboard(worldSize);

        const NUM_SNOWFLAKES = 1000;

        this.snowflakes = [];
        for (let _ = 0; _ < NUM_SNOWFLAKES; ++_) {
            this.snowflakes.push(new Snowflake(worldSize));
        }

        // GL States
        gl.enable(gl.DEPTH_TEST);
    }

    display() {
        gl.useProgram(this.mainShader);
        let r = 180;
        let g = 235;
        let b = 255;
        gl.clearColor(r / 255., g / 255., b / 255, 1.);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Camera transformation
        mat4.identity(gl.mvMatrix);
        mat4.multiply(gl.mvMatrix, gl.mvMatrix, this.camera.matrix);

        pushMvMatrix(gl);
        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [1., 0., 0.]);
        // Place and draw object
        this.checkerboard.show();
        popMvMatrix(gl);

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
            snowflake.update();
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

