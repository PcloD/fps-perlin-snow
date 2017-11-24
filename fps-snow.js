// Getting shader code
$(document).ready(() => {
    let canvas = "can1";

    let fragShader;
    let vertexShader;

    let vertGet = $.get('vertex.glsl', (vertex) => {
        vertexShader = vertex;
    });

    let fragGet = $.get('frag.glsl', (frag) => {
        fragShader = frag;
    });

    $.when(vertGet, fragGet).done(() => {
        console.log(fragShader);
        console.log(vertexShader);
        appMain(canvas, vertexShader, fragShader);
    });
});

// Global variables
var gl;                 // WebGL rendering context

// Canvas
var savedcanvasid;      // ID of our canvas element
var canvaswidth;        // Canvas width & height (pixels)
var canvasheight;

// Mouse
var mousepos;           // vec2: mouse pos in pixels
                        //       right, up from canvas center
var mousedown;          // Boolean: is mouse button pressed?

// Shaders
var shaderprog1;        // Shader program object

var cameramatrix;

// Object
var rotflag;            // True if rotating
var rotangle;           // Rotation angle (rad)
var rotspeed;           // Rotation speed (rad/sec)
var drawfaces;          // Array of 6 Booleans: faces 1-6 of cube drawn?

// appMain
// Our Main program.
// Given ID of canvas.
function appMain(canvasid, vertex, frag)
{
    // Canvas
    savedcanvasid = canvasid;

    // Initialize quoll.js & WebGL
    gl = quollInit(canvasid);
    if (!gl) return;  // Could not intialize; exit

    // Shaders
    shaderprog1 = makeProgramObject(gl, vertex, frag);

    // Register callbacks with quoll.js
    registerDisplay(myDisplay);
    registerReshape(myReshape);
    registerIdle(myIdle);

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
    rotspeed = Math.PI/180. * 100.;
    drawfaces = [];            // Empty Array
    for (var i = 0; i < 6; ++i)
    {
        drawfaces.push(true);  // Add item to Array
    }

    // GL States
    gl.enable(gl.DEPTH_TEST);
}


// drawObject
// Our object drawing function.
// Distance from center of object to edge is (close to) 1.0.
// Uses drawfaces[0-5] as booleans to determine whether respective cube
// faces are drawn.
function drawObject(r, g, b)
{
    // Draw colorful cube

    // +x face
    if (drawfaces[0])
    {
        pushMvMatrix(gl);
            mat4.translate(gl.mvMatrix, gl.mvMatrix,
                [1., 0., 0.]);
            mat4.rotate(gl.mvMatrix, gl.mvMatrix,
                Math.PI/180. * 90., [0., 1., 0.]);
            drawSquare(gl, 2., 1., 0., 0.);
        popMvMatrix(gl);
    }

    // -x face
    if (drawfaces[1])
    {
        pushMvMatrix(gl);
            mat4.translate(gl.mvMatrix, gl.mvMatrix,
                [-1., 0., 0.]);
            mat4.rotate(gl.mvMatrix, gl.mvMatrix,
                Math.PI/180. * 90., [0., 1., 0.]);
            drawSquare(gl, 2., 0., 1., 1.);
        popMvMatrix(gl);
    }

    // +y face
    if (drawfaces[2])
    {
        pushMvMatrix(gl);
            mat4.translate(gl.mvMatrix, gl.mvMatrix,
                [0., 1., 0.]);
            mat4.rotate(gl.mvMatrix, gl.mvMatrix,
                Math.PI/180. * 90., [1., 0., 0.]);
            drawSquare(gl, 2., 0., 1., 0.);
        popMvMatrix(gl);
    }

    // -y face
    if (drawfaces[3])
    {
        pushMvMatrix(gl);
            mat4.translate(gl.mvMatrix, gl.mvMatrix,
                [0., -1., 0.]);
            mat4.rotate(gl.mvMatrix, gl.mvMatrix,
                Math.PI/180. * 90., [1., 0., 0.]);
            drawSquare(gl, 2., 1., 0., 1.);
        popMvMatrix(gl);
    }

    // +z face
    if (drawfaces[4])
    {
        pushMvMatrix(gl);
            mat4.translate(gl.mvMatrix, gl.mvMatrix,
                [0., 0., 1.]);
            drawSquare(gl, 2., 0., 0., 1.);
        popMvMatrix(gl); }

    // -z face
    if (drawfaces[5])
    {
        pushMvMatrix(gl);
            mat4.translate(gl.mvMatrix, gl.mvMatrix,
                [0., 0., -1.]);
            drawSquare(gl, 2., 1., 1., 0.);
        popMvMatrix(gl);
    }
}

function drawScene() {
  var levels = 4;

  for (var i = 0; i < levels; ++i) {
    var x = 4*(i-levels/2)
      for (var j = 0; j < levels; ++j) {
        var y = 4 * (j - levels/2);
        for( var k = 0; k < levels; ++k ) {
          var z = 4 * (k - levels/2);
          pushMvMatrix(gl);
          mat4.translate(gl.mvMatrix, gl.mvMatrix, [x, y, z])
          drawObject();
          popMvMatrix(gl);
        }
      }
  }
}

// myIdle
// The idle function.
function myIdle()
{
    var elapsedtime = getElapsedTime(0.1);

    // Fly
    var speed = 1.;

    if (mousedown) {
      var new_trans = mat4.create();
      mat4.translate(new_trans, new_trans, [0., 0., speed*elapsedtime]);

      mat4.multiply(cameramatrix, new_trans, cameramatrix);
      postRedisplay();
    }

    var turnfactor = 0.00005
    var turn = mat4.create();
    mat4.rotate(turn, turn,
        turnfactor * Math.sqrt(mousepos[0] * mousepos[0] + mousepos[1] * mousepos[1]),
        [-mousepos[1], mousepos[0], 0.]
    );

    mat4.multiply(cameramatrix, turn, cameramatrix);
    postRedisplay();

    if (rotflag)
    {
        rotangle += rotspeed * elapsedtime;
        postRedisplay();
    }
}


// myDisplay
// The display function.
function myDisplay()
{
    gl.useProgram(shaderprog1);

    gl.clearColor(0.9, 0.9, 0.9, 1.0);
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

    drawObject();
    popMvMatrix(gl);

    // Draw something that moves with the mouse
    pushMvMatrix(gl);
    var movescale = 0.01;
    mat4.translate(gl.mvMatrix, gl.mvMatrix,
        [mousepos[0]*movescale, mousepos[1]*movescale, 0.]);

    drawSquare(gl, 0.5, (mousedown?1.0:0.0), 0.7, 0.0);
    popMvMatrix(gl);

    drawScene();

    gl.flush();
}


// myReshape
// The reshape callback function. Called by quoll.js.
function myReshape(w, h)
{
    // Save canvas dimensions
    canvaswidth = w;
    canvasheight = h;

    // Set up viewport
    gl.viewport(0, 0, w, h);

    // Set up projection
    mat4.perspective(gl.pMatrix,
                     Math.PI/180. * 60.,  // y field-of-view angle
                     w/h,                 // Viewport aspect ratio
                     0.1, 20.);           // Near & far distances
}


// saveMousePos
// Given event object, save mouse position in global mousepos, in pixels
// right, up from center of canvas.
function saveMousePos(evt)
{
    var mousepos_canvas = getMousePos(getCanvas(savedcanvasid), evt);
    mousepos[0] = mousepos_canvas[0] - canvaswidth/2;
    mousepos[1] = canvasheight/2 - mousepos_canvas[1];
}


function myMouseDown(evt)
{
    saveMousePos(evt);
    mousedown = true;
    postRedisplay();
}


function myMouseUp(evt)
{
    saveMousePos(evt);
    mousedown = false;
    postRedisplay();
}


function myMouseMove(evt)
{
    saveMousePos(evt);
    postRedisplay();
}


function myKeyboard(evt)
{
    var ch = keyFromEvent(evt);

    // Note: Keys like [Esc] may be handled inconsistently between
    // browsers. Alas! So we only deal with printable ASCII here.

    switch (ch)
    {
    case ' ':  // Space: toggle rotation
        rotflag = !rotflag;
        break;
    case '1':  // '1'-'6': toggle faces
        drawfaces[0] = !drawfaces[0];
        postRedisplay();
        break;
    case '2':
        drawfaces[1] = !drawfaces[1];
        postRedisplay();
        break;
    case '3':
        drawfaces[2] = !drawfaces[2];
        postRedisplay();
        break;
    case '4':
        drawfaces[3] = !drawfaces[3];
        postRedisplay();
        break;
    case '5':
        drawfaces[4] = !drawfaces[4];
        postRedisplay();
        break;
    case '6':
        drawfaces[5] = !drawfaces[5];
        postRedisplay();
        break;
    }
}

