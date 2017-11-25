class Canvas {
    constructor(id) {
        this.height = 0;
        this.width = 0;

        this.id = id
    }

    getMousePos(evt) {
        return getMousePos(getCanvas(this.id), evt);
    }
}
