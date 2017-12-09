//Moon Vertex Shader

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec4 fogColor;

attribute vec4 texcoord_attr;
attribute vec4 vertex_attr;
attribute vec4 color_attr;

// imports
{% varyingParams %}

void main() {
  // Compute projected vertex position
  gl_Position = projectionMatrix * modelViewMatrix * vertex_attr;

  // Paint color and postion sent to fragment shader
  paintcolor_var = color_attr;
  world_position = modelViewMatrix * vertex_attr;

  fog_color_var = fogColor;

  // Send texture coord to frag shader;
  vec3 texcoord = texcoord_attr.stp / texcoord_attr.q;
  texcoord_var = texcoord.st;
}
