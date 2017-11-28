"use strict"
// fps-snow.js
// CS 381 Project


// Getting shader code
$(document).ready(() => {
    noise.seed(Math.random());

    let canvas = "can1";

    let fragShader;
    let vertexShader;
    let noiseCode;

    let vertGet = $.get('shaders/vertex.glsl', (vertex) => {
        vertexShader = vertex;
    });

    let fragGet = $.get('shaders/frag.glsl', (frag) => {
        fragShader = frag;
    });

    let noiseGet = $.get('assets/noise3D.glsl', (noise) => {
        noiseCode = noise;
    })

    $.when(vertGet, fragGet, noiseGet).done(() => {
        vertexShader = insert(vertexShader , noiseCode, 'noise3D');
        fragShader = insert(fragShader, noiseCode, 'noise3D');
        fpsSnow = new FpsSnow(canvas, vertexShader, fragShader);
    });
});


let insert = (src, insertCode, marker) => {
    marker = '{% ' + marker +' %}';
    const segments = src.split(marker);

    return segments[0] + insertCode + segments[1];
}

