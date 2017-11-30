// bpLight
// Compute color based on Blinn-Phong Illumination Model.
vec4 sparkle(
    vec4 lightcolor,
    vec4 lightpos4,  // Homogeneous form
    vec4 paintcolor,
    vec3 surfpt,
    vec3 surfnorm) {

    return ((vec4( surfnorm, 1. ) / 9.) + .9) * paintcolor;
}
