"use strict"
// fps-snow.js
// CS 381 Project


// Getting shader code
$(document).ready(() => {
    noise.seed(Math.random());

    let sfShader = new Shader('shaders/snowflake', [{
        marker: 'linearFog',
        path: 'shaders/linear-fog.glsl',
        shader: 'fragment'
    }]);

    let grdShader = new Shader('shaders/ground', [{
        marker: 'noise3D',
        path: 'assets/noise3D.glsl',
        shader: 'fragment'
    }, {
        marker: 'linearFog',
        path: 'shaders/linear-fog.glsl',
        shader: 'fragment'
    }, {
        marker: 'bpLight',
        path: 'shaders/bplight.glsl',
        shader: 'fragment'
    }]);

    let gets = [...sfShader.loading(), ...grdShader.loading()];

    $.when(...gets).done(() => {
        const snowflakes = [];
        for (let _ = 0; _ < NUM_SNOWFLAKES; ++_) {
            snowflakes.push(new Snowflake(sfShader));
        }

        console.log(grdShader.fragment)

        fpsSnow = new FpsSnow(
            new Canvas("canvas"),
            new Ground(grdShader),
            snowflakes
        );
    });
});



