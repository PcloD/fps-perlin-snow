// Moon Fragment Shader

#ifdef GL_ES
precision mediump float;
#endif

// imports
{% varyingParams %}
{% linearFog %}

uniform sampler2D tex;

void main(){
    vec4 texcolor = texture2D(tex, texcoord_var).rgba;

    gl_FragColor = texcolor;
}
