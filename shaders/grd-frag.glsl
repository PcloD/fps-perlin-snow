// Ground Fragment Shader

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 paintcolor_var;
varying vec4 vertex_pos;
varying vec4 world_position;
varying vec3 surfpt_var;

// for nosie3D
// float snoise(vec3 v)
{% noise3D %}

// for linearFog
{% linearFog %}

// for bpLight
{% bpLight %}

void main() {
    vec3 color = vec3(180., 235., 255.);
    vec4 fogColor = vec4(color.rgb / 255., 1.);

    float scale = 6.;

    vec3 lookup = vec3((vertex_pos.xyz / vertex_pos.w) * scale);

    float noiseVal = snoise(vec3(lookup));

    vec3 surfnorm = normalize(vec3(noiseVal, 1., noiseVal));

    // Light-source color & position/direction
    //vec4 lightcolor = vec4(255. / 255., 254. / 255., 226. / 255., 1. );  // White
    vec4 lightcolor = vec4(.97, 1., 1., 1.);  // White
    vec4 lightpos4 =  vec4(-1., 2., 5., 1.);

    // Apply Blinn-Phong Illumination Model
    vec4 litcolor = bpLight(
        lightcolor,
        lightpos4,
        paintcolor_var,
        surfpt_var,
        surfnorm);

    vec4 colorWithFog = linearFog(
            world_position,
            litcolor,
            fogColor,
            0., 40.);

    // Send color to framebuffer
    gl_FragColor = vec4(colorWithFog.rgb, 1.0);
}

