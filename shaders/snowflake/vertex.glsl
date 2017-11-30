// Snowflake Vertex Shader

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec4 vertex_attr;
attribute vec4 color_attr;

// imports
{% varyingParams %}

void main() {
    // Compute projected vertex position
    gl_Position = projectionMatrix * modelViewMatrix * vertex_attr;

    // Send paint color and position to fragment shader
    paintcolor_var = color_attr;
    world_position = modelViewMatrix * vertex_attr;
}

