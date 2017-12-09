"use strict"
// fps-snow.js
// CS 381 Project


// Getting shader code
$(document).ready(() => {
    let sfShader = new Shader('shaders/snowflake', [{
        marker: 'linearFog',
        path: 'shaders/linear-fog.glsl',
        shader: 'fragment'
    }]);

    let moonShader = new Shader('shaders/moon', [{
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
        marker: 'sparkle',
        path: 'shaders/sparkle.glsl',
        shader: 'fragment'
    }, {
        marker: 'bpLight',
        path: 'shaders/bpLight.glsl',
        shader: 'fragment'
    }]);

    let gets = [...sfShader.loading(), ...grdShader.loading(), ...moonShader.loading()];

    $.when(...gets).done(() => {
        // Initialize quoll.js & WebGL
        gl = quollInit("canvas");
        if (!gl) return;  // Could not intialize; exit

        sfShader.make();
        moonShader.make();
        grdShader.make();

        const snowflakes = [];
        for (let _ = 0; _ < NUM_SNOWFLAKES; ++_) {
            snowflakes.push(new Snowflake(sfShader));
        }

        const canvasId = "canvas";
        fpsSnow = new FpsSnow(
            new Canvas(canvasId),
            new Ground(grdShader),
            new Camera(),
            new NightSun(moonShader),
            snowflakes
        );
      });
    });
