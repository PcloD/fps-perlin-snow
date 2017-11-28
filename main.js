"use strict"
// fps-snow.js
// CS 381 Project


// Getting shader code
$(document).ready(() => {
    noise.seed(Math.random());

    let sfShader = new Shader('shaders/sf-vertex.glsl', 'shaders/sf-frag.glsl');
    let grdShader = new Shader('shaders/grd-vertex.glsl', 'shaders/grd-frag.glsl');

    let noiseCode;
    let noiseGet = $.get('assets/noise3D.glsl', (noise) => {
        noiseCode = noise;
    });

    let gets = [...sfShader.loading(), ...grdShader.loading(), noiseGet];
    $.when(...gets).done(() => {
        grdShader.insert('noise3D', noiseCode, 'fragment');
        sfShader.insert('noise3D', noiseCode, 'fragment');

        grdShader.insert('noise3D', noiseCode, 'vertex');
        sfShader.insert('noise3D', noiseCode, 'vertex');

        const snowflakes = [];
        for (let _ = 0; _ < NUM_SNOWFLAKES; ++_) {
            snowflakes.push(new Snowflake(sfShader));
        }

        fpsSnow = new FpsSnow(
            new Canvas("canvas"),
            new Ground(grdShader),
            snowflakes
        );
    });
});



