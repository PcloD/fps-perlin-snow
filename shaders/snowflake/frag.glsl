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
    vec4 texcolor = texture2D(tex, texcoord_var);
    texcolor = vec4(texcolor.rgb, 1.);

    vec3 fcolor = vec3(180., 235., 255.);
    vec4 fogColor = vec4(fcolor.rgb / 255., 1.);

    gl_FragColor = linearFog(
            world_position,
            texcolor,
            fogColor,
            0., 40.);
}

