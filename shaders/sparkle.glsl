// bpLight
// Compute color based on Blinn-Phong Illumination Model.
vec4 sparkle(
    vec4 lightcolor,
    vec4 lightpos4,  // Homogeneous form
    vec4 paintcolor,
    vec3 surfpt,
    vec3 surfnorm) {


    vec4 final = ((vec4(surfnorm, 1.) / 10.) + .9) * paintcolor;

    return final;
}
