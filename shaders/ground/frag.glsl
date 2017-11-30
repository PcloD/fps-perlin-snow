// Ground Fragment Shader

#ifdef GL_ES
precision mediump float;
#endif

// imports
{% varyingParams %}
{% noise3D %}
{% linearFog %}
{% sparkle %}


const float PI = 3.1415926535897932384626433832795;

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


vec3 calcFlakeOrientation(vec3 lookup) {
    float rngScale = 9.;

    float scale = .5;

    vec3 scaledLookup = vec3((lookup.xy) * scale, 1.);
    float z = abs(noise(scaledLookup));
    float f = 1. - z * z;
    f *= rngScale;

    vec3 translatedLookup = scaledLookup + 1387.;
    float a = noise(translatedLookup) * PI * rngScale;
    float x = f * cos(a);
    float y = f * sin(a);

    return vec3(x, y, z);
}


void main() {
    vec3 color = vec3(180., 235., 255.);
    vec4 fogColor = vec4(color.rgb / 255., 1.);
    vec4 snowColor = vec4(1., 250./ 255., 243. / 255., 1.);

    vec3 lookup = vertex_pos.xyz / vertex_pos.w;

    float colorNoise = calcFNoiseVal(lookup);

    vec3 surfnorm = normalize(calcFlakeOrientation(lookup));

    vec4 snowNoiseColor = vec4((snowColor * colorNoise).xyz, 1.);

    // Light-source color & position/direction
    //vec4 lightcolor = vec4(255. / 255., 254. / 255., 226. / 255., 1. );  // White
    vec4 lightcolor = vec4(.97, 1., 1., 1.);  // White
    vec4 lightpos4 =  vec4(-1., 2., 5., 1.);

    // Apply Blinn-Phong Illumination Model
    vec4 litcolor = sparkle(
    lightcolor,
    lightpos4,
    snowNoiseColor,
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

