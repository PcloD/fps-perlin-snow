// WebGL General
var gl;                 // WebGL rendering context
var fpsSnow;            // Program Logic Object

// Canvas
var savedcanvasid;      // ID of our canvas element
var canvaswidth;        // Canvas width & height (pixels)
var canvasheight;

// Shaders
var shaderprog1;        // Shader program object

var cameramatrix;

// Object
var rotflag;            // True if rotating
var rotangle;           // Rotation angle (rad)
var rotspeed;           // Rotation speed (rad/sec)
var drawfaces;          // Array of 6 Booleans: faces 1-6 of cube drawn?

var ground;
