// Snowflake Fragment Shader

#ifdef GL_ES
precision mediump float;
#endif

// imports
{% varyingParams %}
{% linearFog %}

uniform sampler2D tex;

void main() {
    // Texture mapping
    vec4 texcolor = texture2D(tex, texcoord_var).rgba;

    gl_FragColor = linearFog(
            world_position,
            texcolor,
            fog_color_var,
            0., 40.);
}

