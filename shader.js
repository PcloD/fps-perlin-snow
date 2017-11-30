"use strict"

class Shader {
    constructor(basePath, dependencies=[]) {
        const vertexPath = `${basePath}/vertex.glsl`;
        const fragmentPath = `${basePath}/frag.glsl`;
        const varyingPath = `${basePath}/varying.glsl`;

        this.shaderProg = null;

        this.vertGet = $.get(vertexPath, (vertex) => {
            this.vertex = vertex;
        });

        this.fragGet = $.get(fragmentPath, (frag) => {
            this.fragment = frag;
        });

        this.varyingGet = $.get(varyingPath, (varying) => {
            console.log(varying)
            this.varying = varying;
        });

        this.depGets = [];
        for (const dep of dependencies) {
            const {marker, path, shader} = dep;

            let get = $.get(path, (code) => {
                this.insert(marker, code, shader);
            });

            this.depGets.push(get);
        }
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

    make() {
        this.insert('varyingParams', this.varying, 'vertex');
        this.insert('varyingParams', this.varying, 'fragment');
    }

    loading() {
        return [this.fragGet, this.vertGet, this.varyingGet, ...this.depGets];
    }
}

