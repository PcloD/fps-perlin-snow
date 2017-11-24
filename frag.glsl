// Fragment Shader #1

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 paintcolor_var;

void main()
{
    // Final color is paint color
    gl_FragColor = paintcolor_var;
}
