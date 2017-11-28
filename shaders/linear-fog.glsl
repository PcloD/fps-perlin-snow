
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
