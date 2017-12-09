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
