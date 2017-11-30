// Snowflake Fragment Shader

#ifdef GL_ES
precision mediump float;
#endif

{% varying %}

{% linearFog %}

void main() {
    vec4 paintcolor = vec4(paintcolor_var.rgb, 1.);
    vec3 color = vec3(180., 235., 255.);
    vec4 fogColor = vec4(color.rgb / 255., 1.);

    gl_FragColor = linearFog(
            world_position,
            paintcolor,
            fogColor,
            0., 40.);
}

