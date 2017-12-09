# fps-perlin-snow
#### Group: William Horn, Hal Dimarchi, Frank Cline
#### Github: https://github.com/williamh890/fps-snow

## Overview
This is an attempt to simulate snow using perline noise. Mouse to look around
and wasd to move.

The sparlkes are created using a random unit vector generated using perline
noise and the base color is just 1/fnoise.

The lighting is done with a modified bling phong function where only the
anbient and the specular are used.

## Perline Noise
All perline noise calculations are done in the shaders using this implimentation:

    https://github.com/ashima/webgl-noise

## Running Locally

To run the project start a local server in the root directory, I am partial to python3's
server module.

    python3 -m http.server 8000


