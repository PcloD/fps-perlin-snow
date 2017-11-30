// Ground Vertex Shader

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 vertex_attr;
attribute vec4 color_attr;

{% varying %}

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

