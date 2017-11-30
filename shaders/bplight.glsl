// bpLight
// Compute color based on Blinn-Phong Illumination Model.
vec4 bpLight(
    vec4 lightcolor,
    vec4 lightpos4,  // Homogeneous form
    vec4 paintcolor,
    vec3 surfpt,
    vec3 surfnorm) {
    // ***** Scalar Lighting Parameters *****

    float ambientfrac = 0.9;
        // Ambient light color, as fraction of light color
    float shininess = 100.;
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
