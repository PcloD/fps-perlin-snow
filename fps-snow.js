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

        this.checkerboard = new Checkerboard();

        this._centerCameraOnCheckerboard();

        // GL States
        gl.enable(gl.DEPTH_TEST);
    }

    display() {
        gl.useProgram(this.mainShader);

        gl.clearColor(135 / 255., 206 / 255., 235. / 255, 1.);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Camera transformation
        mat4.identity(gl.mvMatrix);
        mat4.multiply(gl.mvMatrix, gl.mvMatrix, this.camera.matrix);


        mat4.rotate(gl.mvMatrix, gl.mvMatrix, Math.PI / 2., [1., 0., 0.]);
        // Place and draw object
        this.checkerboard.show();

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

    _centerCameraOnCheckerboard() {
        const center = [-this.checkerboard.height() / 2., -2. ,-this.checkerboard.width() / 2. ];
        this.camera.translate(center);
    }
}

