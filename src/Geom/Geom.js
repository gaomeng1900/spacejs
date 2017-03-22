import Face from "../Face"

export default class Geom {
    constructor() {
        this._name = "Geom"

        this.drawMode = "TRIANGLES" // THREE 把drawMode放在了Mesh里面
        this.drawCount = 0 // 找不到THREE放在哪了, 可能是根据drawmode和顶点数动态生成的
        this.drawType = "UNSIGNED_INT" // NOTE: 顶点数超过int8了, 而int16不能正常工作
        this.drawOffset = 0

        this.vertices = new Float32Array([])
        this.normals  = new Float32Array([])
        this.indices  = new Uint16Array([])
        this.uvMap    = new Float32Array([])

        this.faces = []
        // this.faceUvs = []
    }
    update() {
        let _vertices = this.faces.reduce((acc, face) => {
            return acc.concat(face.getAbc())
        }, [])
        this.vertices = new Float32Array(_vertices)

        let _normals = this.faces.reduce((acc, face) => {
            return acc.concat(face.normal.getArray(), face.normal.getArray(), face.normal.getArray())
        }, [])
        this.normals = new Float32Array(_normals)

        let _faceUvs = this.faces.reduce((acc, face) => {
            return acc.concat(face.getUvAbc())
        }, [])
        this.uvMap = new Float32Array(_faceUvs)

        let _indices = []
        this.drawCount = this.vertices.length / 3
        for (let i = 0; i < this.drawCount; i++) {
            _indices.push(i)
        }
        // TODO: 为什么 UNSIGNED_BYTE + int16 不能正常工作
        this.indices = new Uint32Array(_indices)

        // TODO: 生成的顶点太多了, 最好整合一下
        // 不喜欢THREE和WebGL那样先加顶点, 再通过顶点编号来构造面
    }
}
