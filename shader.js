"use strict"

class Shader {
    constructor(vertexPath, fragmentPath) {
        this.vertex = '';
        this.fragment = '';

        this.shaderProg = null;

        this.vertGet = $.get(vertexPath, (vertex) => {
            this.vertex = vertex;
        });

        this.fragGet = $.get(fragmentPath, (frag) => {
            this.fragment = frag;
        });
    }

    insert(marker, code, type) {
        marker = '{% ' + marker +' %}';
        if (type === 'vertex') {
            const segments = this.vertex.split(marker);
            this.vertex = segments[0] + code + segments[1];
        }

        if (type === 'fragment') {
            const segments = this.fragment.split(marker);
            this.fragment = segments[0] + code + segments[1];
        }
    }

    get() {
        if (!this.prog) {
            this.prog = makeProgramObject(gl, this.vertex, this.fragment);
        }

        return this.prog;
    }

    loading() {
        return [this.fragGet, this.vertGet];
    }
}

