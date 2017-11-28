// Snowflake Fragment Shader

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 paintcolor_var;


void main() {
    gl_FragColor = paintcolor_var;
}

