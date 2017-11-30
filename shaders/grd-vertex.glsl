// Ground Vertex Shader

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 vertex_attr;
attribute vec4 color_attr;

varying vec4 paintcolor_var;
varying vec3 surfpt_var;
varying vec4 vertex_pos;
varying vec4 world_position;


void main() {

    // Compute vertex position
    vec4 surfpt4 = modelViewMatrix * vertex_attr;
    surfpt_var = surfpt4.xyz / surfpt4.w;

    gl_Position = projectionMatrix * surfpt4;

    // Send paint color and position to fragment shader
    paintcolor_var = color_attr;
    vertex_pos = vertex_attr;
    world_position = modelViewMatrix * vertex_attr;
}

