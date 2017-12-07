"use strict"

class Shader {
    constructor(basePath, dependencies=[]) {
        const vertexPath = `${basePath}/vertex.glsl`;
        const fragmentPath = `${basePath}/frag.glsl`;
        const varyingPath = `${basePath}/varying.glsl`;

        this.program = null;

        this.vertGet = $.get(vertexPath, (vertex) => {
            this.vertex = vertex;
        });

        this.fragGet = $.get(fragmentPath, (frag) => {
            this.fragment = frag;
        });

        this.varyingGet = $.get(varyingPath, (varying) => {
            this.varying = varying;
        });

        this.depGets = [];
        this.depInserts = [];
        for (const dep of dependencies) {
            const {marker, path, shader} = dep;

            const get = $.get(path, code => {
                this.depInserts.push({
                    'marker': marker,
                    'code': code,
                    'shader': shader
                });
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
        if (!this.program) {
            this.program = makeProgramObject(gl, this.vertex, this.fragment);
        }

        return this.program;
    }

    make() {
        this.insert('varyingParams', this.varying, 'vertex');
        this.insert('varyingParams', this.varying, 'fragment');

        for (const obj of this.depInserts) {
            const {marker, shader, code} = obj;
            this.insert(marker, code, shader);
        }
    }

    loading() {
        const gets = [this.fragGet, this.vertGet, this.varyingGet, ...this.depGets];
        return gets;
    }
}

