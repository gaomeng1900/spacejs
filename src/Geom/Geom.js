export default class Geom {
    constructor() {
        this._name = "Geom"

        this.drawMode = "" // THREE 把drawMode放在了Mesh里面
        this.drawCount = 0 // 找不到THREE放在哪了, 可能是根据drawmode和顶点数动态生成的
        this.drawType = ""
        this.drawOffset = 0

        this.vertices = new Float32Array([])
        this.colors   = new Float32Array([])
        this.normals  = new Float32Array([])
        this.indices  = new Uint8Array([])
    }
}
