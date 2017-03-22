import Vec2 from "../Math/Vec2"
import Vec3 from "../Math/Vec3"
import Face from "../Face"
import Geom from "./Geom"

export default class Plane extends Geom {
    constructor(width, height) {
        super()

        let _vertices = [
            -width/2, -height/2, 0,
            width/2, -height/2, 0,
            width/2, height/2, 0,
            -width/2, height/2, 0,
        ]

        let _normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ]
        let _faceUvs = [
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ]
        let _indices = [0, 1, 2, 0, 2, 3]

        this.vertices = new Float32Array(_vertices)
        this.normals = new Float32Array(_normals)
        this.uvMap = new Float32Array(_faceUvs)
        this.indices = new Uint32Array(_indices)
        this.drawCount = _indices.length
    }
}
