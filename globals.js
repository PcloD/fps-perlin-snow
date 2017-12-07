
// Global Variables
var gl;                 // WebGL rendering context
var fpsSnow;            // Program Logic Object

const NUM_SNOWFLAKES = 200;
const WORLD_SIZE = 100.;
const VIEW_DISTANCE = 50.0;

const FOG_COLOR = [180./255., 235./255., 255./255., 1.];
const SNOW_COLOR = [180./255., 235./255., 255./255., 1.];
const DARK_SNOW_COLOR = [170./255., 215./255., 245./255., 1.];
