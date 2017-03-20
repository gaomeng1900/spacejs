export default class Geom {
    constructor() {
        this._name = "Geom"
        this.vertices = new Float32Array([])
        this.colors   = new Float32Array([])
        this.normals  = new Float32Array([])
        this.indices  = new Uint8Array([])
    }
}
