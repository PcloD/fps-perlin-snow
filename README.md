This is an attempt to simulate snow using perline noise. Mouse to look around
and wasd to move.

The sparlkes are created using a random unit vector generated using perline
noise and the base color is just 1/fnoise.

All perline noise calculations are done in the shaders using this implimentation:

    https://github.com/ashima/webgl-noise

The lighting is done with a modified bling phong function where only the
anbient and the specular are used.
