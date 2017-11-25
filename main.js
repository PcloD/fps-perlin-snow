"use strict"
// fps-snow.js
// CS 381 Project


// Getting shader code
$(document).ready(() => {
    let canvas = "can1";

    let fragShader;
    let vertexShader;

    let vertGet = $.get('vertex.glsl', (vertex) => {
        vertexShader = vertex;
    });

    let fragGet = $.get('frag.glsl', (frag) => {
        fragShader = frag;
    });

    $.when(vertGet, fragGet).done(() => {
        fpsSnow = new FpsSnow(canvas, vertexShader, fragShader);
    });
});

