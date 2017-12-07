// Ground Vertex Shader

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPos;

attribute vec4 vertex_attr;
attribute vec4 color_attr;

// imports
{% varyingParams %}

void main() {

    // Compute vertex position
    vec4 surfpt4 = modelViewMatrix * vertex_attr;
    surfpt_var = surfpt4.xyz / surfpt4.w;

    vec4 pos = projectionMatrix * surfpt4;
    gl_Position = pos;

    // Send paint color and position to fragment shader
    paintcolor_var = color_attr;
    vertex_pos = vertex_attr;
    world_position = modelViewMatrix * vertex_attr;
    camera_pos_var = cameraPos;
}

