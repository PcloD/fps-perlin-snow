// Ground Vertex Shader

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 fogColor;
uniform vec4 snowColor;
uniform vec4 darkSnowColor;

attribute vec4 vertex_attr;
attribute vec4 color_attr;
attribute vec4 texcoord_attr;

// imports
{% varyingParams %}

void main() {

    // Compute vertex position
    vec4 surfpt4 = modelViewMatrix * vertex_attr;
    surfpt_var = surfpt4.xyz / surfpt4.w;

    vec4 pos = projectionMatrix * surfpt4;
    gl_Position = pos;

    vec3 texcoord = texcoord_attr.stp / texcoord_attr.q;
    texcoord_var = texcoord.st;

    // Send paint color and position to fragment shader
    paintcolor_var = color_attr;
    vertex_pos = vertex_attr;
    world_position = modelViewMatrix * vertex_attr;
    fog_color_var = fogColor;
    snow_color_var = snowColor;
    dark_snow_color_var = darkSnowColor;
}

