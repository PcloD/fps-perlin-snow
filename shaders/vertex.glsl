// Vertex Shader #1

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix;

attribute vec4 vertex_attr;
attribute vec4 color_attr;
attribute vec3 normal_attr;

varying vec4 paintcolor_var;
varying vec3 surfpt_var;
varying vec3 surfnorm_var;

void main()
{
    // Compute vertex position
    vec4 surfpt4 = modelViewMatrix * vertex_attr;
    surfpt_var = surfpt4.xyz / surfpt4.w;
    gl_Position = projectionMatrix * surfpt4;

    // Compute normal
    surfnorm_var = normalize(normalMatrix * normal_attr);

    // Send paint color to fragment shader
    paintcolor_var = color_attr;
}

