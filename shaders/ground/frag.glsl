// Ground Fragment Shader

#ifdef GL_ES
precision mediump float;
#endif
// imports
{% varyingParams %}
{% noise3D %}
{% linearFog %}
{% fancySparkle %}
{% bpLight %}

const float PI = 3.1415926535897932384626433832795;

// Returns values between 0->1
float noise(vec3 lookup) {
    return (snoise(lookup) + 1.) / 2.;
}


float calcFNoiseVal(vec3 lookup, float scale) {
    const int ZOOM_LEVELS = 3;
    float total = 0.;

    for(int i = 1; i < ZOOM_LEVELS; ++i) {
        vec3 scaledLookup = vec3((lookup.xy) * scale, 137.);

        total += noise(scaledLookup) / pow(float(i), 1.5);
        scale *= 3.;
        scaledLookup += 137.;
    }

    return total;
}


vec3 calcFlakeOrientation(vec3 lookup, float scale) {
    vec3 scaledLookup = vec3((lookup.xyz) * scale);

    float y = noise(scaledLookup);
    float f = 1.- y * y;

    vec3 translatedLookup = scaledLookup + 1387.;
    float a = noise(translatedLookup * scale) * 2. * PI;
    float x = f * cos(a);
    float z = f * sin(a);

    return normalize(vec3(x, y, z));
}


void main() {
    vec4 snowColor = vec4(1., 250./ 255., 243. / 255., 1.);

    vec3 lookup = vertex_pos.xyz / vertex_pos.w;

    float fNoiseScale = .5;
    float colorNoise = calcFNoiseVal(lookup, fNoiseScale);

    float specularScale = 15.;
    vec3 sparkleNorm = normalize(calcFlakeOrientation(lookup, specularScale));

    vec4 snowNoiseColor = mix(snow_color_var, dark_snow_color_var, colorNoise);

    // Light-source color & position/direction
    //vec4 lightcolor = vec4(255. / 255., 254. / 255., 226. / 255., 1. );  // White
    vec4 lightcolor = fog_color_var;  // White
    vec4 lightpos4 =  vec4(5000., -5000., 5000., 1.);

    vec4 specularcolor = vec4(1., 1., 1., 1.);

    vec4 camPos = vec4(0., 0., 0., 1.);
    // Apply Blinn-Phong Illumination Model
    vec4 litcolor = bpLightSpecular(
    lightcolor,
    specularcolor,
    lightpos4,
    snowNoiseColor,
    surfpt_var,
    sparkleNorm);

    vec4 colorWithFog = linearFog(
            world_position,
            litcolor,
            fog_color_var,
            0., 40.);

     //gl_FragColor = vec4(colorWithFog.rgb, 1.0);

    gl_FragColor = mix(
        vec4(1., 0., 0., 1.),
        vec4(0., 0., 1., 1.),
        shopf(1., world_position.xyz)
    );
}

