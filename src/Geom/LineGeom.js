import Vec2 from "../Math/Vec2"
import Vec3 from "../Math/Vec3"
import Face from "../Face"
import Geom from "./Geom"

export default class LineGeom extends Geom {
    constructor(keyPoints) {
        super()

        this.drawMode = "LINE_STRIP"

        this.keyPoints = keyPoints
        this.initFromKeyPoints()
    }

    initFromKeyPoints() {
        let _vertices = this.keyPoints.reduce((acc, key) => {
            return acc.concat(key.getArray())
        }, [])
        this.vertices = new Float32Array(_vertices)

        let _indices = []
        this.drawCount = this.keyPoints.length
        for (let i = 0; i < this.drawCount; i++) {
            _indices.push(i)
        }
        // TODO: 为什么 UNSIGNED_BYTE + int16 不能正常工作
        this.indices = new Uint32Array(_indices)
    }
}
