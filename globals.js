
// Global Variables
var gl;                 // WebGL rendering context
var fpsSnow;            // Program Logic Object

const NUM_SNOWFLAKES = 200;
const WORLD_SIZE = 100.;
const VIEW_DISTANCE = 50.0;

const FOG_COLOR = [30./ 255., 80./ 255., 160./ 255., 1.];
const SNOW_COLOR = [1.,1.,1.,1.];
const DARK_SNOW_COLOR = [181./ 255., 184./ 255., 188./ 255., 1.];
