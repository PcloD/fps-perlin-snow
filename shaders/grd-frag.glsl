// Ground Fragment Shader

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 paintcolor_var;
varying vec4 vertex_pos;
varying vec4 world_position;

// for nosie3D
// float snoise(vec3 v)
{% noise3D %}

// for linearFog
{% linearFog %}

void main() {
    vec3 color = vec3(180., 235., 255.);
    vec4 fogColor = vec4(color.rgb / 255., 1.);

    float scale = 6.;

    vec3 lookup = vec3((vertex_pos.xyz / vertex_pos.w) * scale);
    float noiseVal = (snoise(vec3(lookup)) + 1.) / 2.;

    noiseVal = (noiseVal / 10.) + .95;

    vec4 paintcolor = vec4(noiseVal, noiseVal, noiseVal, 1.);

    gl_FragColor = linearFog(
            world_position,
            paintcolor,
            fogColor,
            0., 40.);
}

