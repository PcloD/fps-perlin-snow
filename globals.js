
// Global Variables
var gl;                 // WebGL rendering context
var fpsSnow;            // Program Logic Object

const sliders = [];

const NUM_SNOWFLAKES = 1;
const WORLD_SIZE = 100.;
const VIEW_DISTANCE = 50.0;

const FOG_COLOR = [0./ 255, 28./ 255, 70./ 255, 1.];
const SNOW_COLOR = [1.,1.,1.,1.];
const greyness = 230.;
const DARK_SNOW_COLOR = [greyness / 255.,greyness / 255.,greyness / 255.,1.];
