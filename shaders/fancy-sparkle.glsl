
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
    return (dist2 > thresh) ? 0.0 : 1.0-dist2 / thresh;
}

float shopf(
        vec3 viewVec,
        vec3 lightDir,
        vec3 normal,
        vec3 world_pos,
        float noise) {
    float val = dot(reflect(-normalize(viewVec), normal), lightDir);
    float specBase = clamp(val, 0., 1.);

    // noise = Noise3D( pos * 0.04).r
    vec3 fp = fract((param1 * world_pos) + (param2 * 15. * noise) + (param3 * viewVec));
    fp *= (1. - fp);

    float val2 =  1. - param4 * 15. * (fp.x + fp.y + fp.z);
    float glitter = clamp(val2, 0., 1.);

    float sparkle = glitter * pow(specBase, param5 * 3.);

    return sparkle;
}

