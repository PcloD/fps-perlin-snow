// Fragment Shader #1

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 paintcolor_var;
varying vec4 vertex_pos;
varying vec4 world_position;



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

void main() {
    vec4 fogColor = vec4(135. / 255., 206. / 255., 235. / 255., 1.);

    gl_FragColor = linearFog(
             world_position,
             paintcolor_var,
             fogColor,
             0., 50.);
}

