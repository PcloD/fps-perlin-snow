// Fragment Shader #1

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 paintcolor_var;
varying vec3 surfpt_var;
varying vec3 surfnorm_var;

// bpLight
// Compute color based on Blinn-Phong Illumination Model.
vec4 bpLight(
    vec4 lightcolor,
    vec4 lightpos4,  // Homogeneous form
    vec4 paintcolor,
    vec3 surfpt,
    vec3 surfnorm)
{
    // ***** Scalar Lighting Parameters *****

    float ambientfrac = 0.2;
        // Ambient light color, as fraction of light color
    float shininess = 50.;
        // PHONG Model shininess exponent
        // (Blinn-Phong needs 4 times larger)

    // ***** Direction of Light Source (cam coords) *****
    vec3 lightdir;
    if (lightpos4.w == 0.)
        lightdir = normalize(lightpos4.xyz);
    else
        lightdir = normalize(lightpos4.xyz/lightpos4.w - surfpt);

    // ***** Compute the Three Parts of Blinn-Phong Model *****

    // Ambient
    vec4 ambientcolor = ambientfrac * lightcolor * paintcolor;

    // Diffuse
    // Lambert cosine (or 0 if this is negative)
    float lambertcos = max(0., dot(surfnorm, lightdir));
    vec4 diffusecolor = lambertcos * lightcolor * paintcolor;

    // Specular
    vec3 viewdir = normalize(-surfpt);
    vec3 halfway = normalize(viewdir + lightdir);
    float specularcoeff = pow(max(0., dot(surfnorm, halfway)),
                              4.*shininess);
        // Blinn-Phong needs shininiess 4 * [Phong shininess]
    vec4 specularcolor = specularcoeff * lightcolor;

    // ***** Combine the Three Parts *****

    return clamp(ambientcolor + diffusecolor + specularcolor,
                 0., 1.);
}

void main() {
    // Surface normal
    vec3 surfnorm = normalize(surfnorm_var);

    // Light-source color & position/direction
    vec4 lightcolor = vec4(1., 1., 1., 1.);  // White
    vec4 lightpos4 =  vec4(.0, 0., -2.5, 1.);

    // Apply Blinn-Phong Illumination Model
    vec4 litcolor = bpLight(
        lightcolor,
        lightpos4,
        paintcolor_var,
        surfpt_var,
        surfnorm);

    // Send color to framebuffer
    gl_FragColor = vec4(litcolor.rgb, 1.0);
}

