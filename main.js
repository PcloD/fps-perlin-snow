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


// saveMousePos
// Given event object, save mouse position in global mousepos, in pixels
// right, up from center of canvas.
function saveMousePos(evt) {
    var mousepos_canvas = getMousePos(getCanvas(savedcanvasid), evt);
    mousepos[0] = mousepos_canvas[0] - canvaswidth/2;
    mousepos[1] = canvasheight/2 - mousepos_canvas[1];
}


function myMouseDown(evt) {
    saveMousePos(evt);
    mousedown = true;
    postRedisplay();
}


function myMouseUp(evt) {
    saveMousePos(evt);
    mousedown = false;
    postRedisplay();
}


function myMouseMove(evt) {
    saveMousePos(evt);
    postRedisplay();
}


function myKeyboard(evt) {
    var ch = keyFromEvent(evt);

    // Note: Keys like [Esc] may be handled inconsistently between
    // browsers. Alas! So we only deal with printable ASCII here.

    switch (ch) {
        case ' ':  // Space: toggle rotation
            rotflag = !rotflag;
            break;
        case '1':  // '1'-'6': toggle faces
            drawfaces[0] = !drawfaces[0];
            break;
        case '2':
            drawfaces[1] = !drawfaces[1];
            break;
        case '3':
            drawfaces[2] = !drawfaces[2];
            break;
        case '4':
            drawfaces[3] = !drawfaces[3];
            break;
        case '5':
            drawfaces[4] = !drawfaces[4];
            break;
        case '6':
            drawfaces[5] = !drawfaces[5];
            break;
        default:
            return;
    }

    postRedisplay();
}

