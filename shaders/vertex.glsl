// Vertex Shader #1

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 vertex_attr;
attribute vec4 color_attr;

varying vec4 paintcolor_var;
varying vec4 vertex_pos;
varying vec4 world_position;


void main()
{
    // Compute projected vertex position
    gl_Position = projectionMatrix * modelViewMatrix * vertex_attr;

    // Send paint color and position to fragment shader
    paintcolor_var = color_attr;
    vertex_pos = vertex_attr;
    world_position = modelViewMatrix * vertex_attr;
}

