// Ground Fragment Shader

#ifdef GL_ES
precision mediump float;
#endif

uniform float param0;
uniform float param1;
uniform float param2;
uniform float param3;
uniform float param4;
uniform float param5;

// imports
{% varyingParams %}
{% noise3D %}
{% linearFog %}
{% fancySparkle %}
{% bpLight %}

const float PI = 3.1415926535897932384626433832795;

uniform sampler2D snow_tex;


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
    float f = 1. - y * y;

    vec3 translatedLookup = scaledLookup + 1387.;
    float a = noise(translatedLookup * scale) * 2. * PI;
    float x = f * cos(a);
    float z = f * sin(a);

    return normalize(vec3(x, y, z));
}


float getShopfSparkle() {
    vec4 lightpos4 =  vec4(5000., -5000., 5000., 1.);
    vec3 lightdir = (lightpos4.w == 0.) ?
         normalize(lightpos4.xyz) :
         normalize(lightpos4.xyz/lightpos4.w - surfpt_var);

    vec3 viewVec = normalize(-surfpt_var);
    float sparkle = shopf(
        viewVec,                           //vec3 viewVec,
        lightdir,                          //vec3 lightDir,
        vec3(0., 0., 1.),                  //vec3 normal,
        vec3(vertex_pos.xyz),                //vec3 world_pos,
        snoise(world_position.xyz * param0)      //float noise
    );

    return sparkle;
}

float getFancySparkle() {
    vec3 viewVec = normalize(-surfpt_var);

    float sparkle = fancySparkle(
        .7, 10.0, //float sparkle_size, float sparkle_dens,
        vertex_pos.xyz,//vec3 world_pos,
        viewVec,//vec3 view,
        0.2,//float view_dep,
        vec3(0., 0., 1.)
    );

    return sparkle;
}


void main() {
    // Look up the texture and mix with background color
    vec4 texcolor = texture2D(snow_tex, texcoord_var * 8.);
    vec4 snowColor = mix(texcolor, fog_color_var, .5);

    vec4 withSparkle = mix(
        vec4(snowColor.rgb, 1.0),
        vec4(1., 1., 1., 1.),
        getShopfSparkle()
    );

    vec4 colorWithFog = linearFog(
        world_position,
        withSparkle,
        fog_color_var,
        0., 40.);

    gl_FragColor = colorWithFog;
}

