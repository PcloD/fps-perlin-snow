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

// Returns values between 0->1
float noise(vec3 lookup) {
    return (snoise(lookup) + 1.) / 2.;
}


float calcFNoiseVal(vec3 lookup) {
    float currScale = .7;

    const int ZOOM_LEVELS = 6;
    float total = 0.;

    for(int i = 1; i < ZOOM_LEVELS; ++i) {
        vec3 scaledLookup = vec3((lookup.xy) * currScale, 137.);

        total += noise(scaledLookup) / pow(float(i), 1.5);
        currScale *= 3.;
        scaledLookup += 137.;
    }

    return (total / 10.) + .95;
}


float calcFlakeOrientation(vec3 lookup) {
    float scale = 6.;

    return snoise(vec3((lookup.xy) * scale, 1.));
}


void main() {
    vec3 color = vec3(180., 235., 255.);
    vec4 fogColor = vec4(color.rgb / 255., 1.);
    vec4 snowColor = vec4(1., 250./ 255., 243. / 255., 1.);

    vec3 lookup = vertex_pos.xyz / vertex_pos.w;

    float reflectionNoise = calcFlakeOrientation(lookup);
    float colorNoise = calcFNoiseVal(lookup);

    vec3 surfnorm = normalize(vec3(reflectionNoise, 1., reflectionNoise));
    vec4 snowNoiseColor = vec4((snowColor * colorNoise).xyz, 1.);

    // Light-source color & position/direction
    //vec4 lightcolor = vec4(255. / 255., 254. / 255., 226. / 255., 1. );  // White
    vec4 lightcolor = vec4(.97, 1., 1., 1.);  // White
    vec4 lightpos4 =  vec4(-1., 2., 5., 1.);

    // Apply Blinn-Phong Illumination Model
    //vec4 litcolor = bpLight(
    //lightcolor,
    //lightpos4,
    //snowColor,
    //surfpt_var,
    //surfnorm);

    vec4 colorWithFog = linearFog(
            world_position,
            snowNoiseColor,
            fogColor,
            0., 40.);

    // Send color to framebuffer
    gl_FragColor = vec4(colorWithFog.rgb, 1.0);
}

