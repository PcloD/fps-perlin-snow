// Ground Fragment Shader

#ifdef GL_ES
precision mediump float;
#endif

// imports
varying vec4 paintcolor_var;
varying vec3 surfpt_var;
varying vec4 vertex_pos;
varying vec4 world_position;
varying vec4 fog_color_var;
varying vec4 snow_color_var;
varying vec4 dark_snow_color_var;



// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i);
    vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                dot(p2,x2), dot(p3,x3) ) );
}


vec4 linearFog(vec4 position,
        vec4 vertexColor,
        vec4 fogColor,
        float fogStart,
        float fogEnd) {
    float dist = 0.;

    dist = length(position.xyz / position.w);
    float fogAmount = (fogEnd - dist) / (fogEnd - fogStart);

    fogAmount = clamp(fogAmount, 0., 1.);

    return mix(fogColor, vertexColor, fogAmount);
}


float fancySparkle(
        float sparkle_size, float sparkle_dens,
        vec3 world_pos,
        vec3 view,
        float view_dep,
        vec3 normal) {

    // Compute Grid Level (scale)
    float z = length(view);
    float e = floor(log2(0.3 * z + 3.0) / 0.3785116);
    float level_z = 0.1 * pow(1.3, e) - 0.2;
    float level = 0.12 / level_z;
    sparkle_dens *= level;

    // Remapping the view vector
    vec3 v = view / z;
    vec3 view_new = v * level_z;
    view_new = sign(view_new) * fract(abs(view_new));

    // Grid lookup position
    vec3 pos = sparkle_dens * world_pos
        + view_dep * normalize(view_new);

    // Generate the grid
    vec3 g_index = floor(pos);
    vec3 P_c = g_index / sparkle_dens;

    // Compute Offset
    vec3 off = vec3(0.75, 0.75, 0.75);
    vec3 P_x = pos - g_index + 0.5 * fract(0.5) - off;

    // Anisotropy
    float dotvn = dot(v, normal);
    vec3 ma = v - dotvn * normal; // Ellipse major axis
    vec3 P_x_proj = dot(P_x, ma) * ma;
    P_x += (abs(dotvn) - 1.0) * P_x_proj / dot(ma, ma);

    // Compute sparkle kernel
    float dist2 = dot(P_x, P_x);
    float thresh = 1.0 - sparkle_size;

    // Mulitply With Lighting
    return (dist2 > thresh) ? 0.0 : 1.0 - (dist2 / thresh);
}


// bpLight
// Compute color based on Blinn-Phong Illumination Model.
vec4 bpLightSpecular(
    vec4 lightcolor,
    vec4 specularcolor,
    vec4 lightpos4,  // Homogeneous form
    vec4 paintcolor,
    vec3 surfpt,
    vec3 specularnorm) {
    // ***** Scalar Lighting Parameters *****

    float ambientfrac = 1.;
        // Ambient light color, as fraction of light color
    float shininess = 100.;
        // Phong Model shininess exponent

    // ***** Direction of Light Source (cam coords) *****
    vec3 lightdir;
    if (lightpos4.w == 0.)
        lightdir = normalize(lightpos4.xyz);
    else
        lightdir = normalize(lightpos4.xyz/lightpos4.w - surfpt);

    // ***** Compute the Three Parts of Phong Model *****

    vec4 color = mix(paintcolor, lightcolor, .48);
    // Ambient
    vec4 ambientcolor = ambientfrac * color;

    vec4 specularcol;
        // Specular
        vec3 viewdir = normalize(-surfpt);
        vec3 reflectlightdir = normalize(reflect(-lightdir, specularnorm));
        float specularcoeff = pow(max(0., dot(viewdir, reflectlightdir)),
                shininess);
        specularcol = specularcoeff * specularcolor;

    // ***** Combine the Three Parts *****

    return clamp(ambientcolor + specularcol,
            0., 1.);

}


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
        sparkleNorm
    );

    vec4 colorWithFog = linearFog(
        world_position,
        litcolor,
        fog_color_var,
        0., 40.
    );

    float sparkleAmount = float fancySparkle(
        1.0, 1.0,        //float sparkle_size, float sparkle_dens,
        world_position,  //vec3 world_pos,
        lightpos4.xyz,   //vec3 view,
        1.0,             //float view_dep,
        vec3(0., 1., 0.)       //vec3 normal
    );

    // Send color to framebuffer
    gl_FragColor = vec4(colorWithFog.rgb, 1.0) * sparkleAmount;
}
