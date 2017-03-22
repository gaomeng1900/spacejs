import Vec2 from "../Math/Vec2"
import Vec3 from "../Math/Vec3"
import Face from "../Face"
import Geom from "./Geom"

export default class SphereGeom extends Geom {
    constructor(radius, widthSeg, heightSeg) {
        super()

        widthSeg = widthSeg < 3 ? 3 : widthSeg
        heightSeg = heightSeg < 2 ? 2 : heightSeg

        let deltaLat = Math.PI / heightSeg // 一共1880度
        let deltaLon = Math.PI * 2 / widthSeg // 一共360

        let lat = 0
        let lon = 0

        let _vertices = []
        let _normals = []
        let _faceUvs = []
        let _indices = []
        for (lat = 0; lat <= heightSeg; lat++) { // 点数比seg多一个
            let alpha = lat * deltaLat - Math.PI / 2
            for (lon = 0; lon <= widthSeg; lon++) {
                let beta = lon * deltaLon

                let x = Math.cos(beta) * Math.cos(alpha)
                let y = Math.sin(alpha)
                let z = Math.sin(beta) * Math.cos(alpha)

                // let u = x*0.5 + 0.5
                // let v = y*0.5 + 0.5
                let u = 1.0 - 1.0 * lon / widthSeg
                let v = 1.0 * lat / heightSeg

                // 做出弧形反光效果
                _normals.push(x, y, z)
                _faceUvs.push(u, v)
                _vertices.push(x*radius, y*radius, z*radius)
            }
        }

        // 组装顶点!!!
        for (lat = 1; lat <= heightSeg; lat++) { // 点数比seg多一个
            for (lon = 0; lon < widthSeg; lon++) {
                _indices.push(
                    lon + (lat-1) * widthSeg,
                    lon + (lat) * widthSeg,
                    lon + (lat) * widthSeg + 1,

                    lon + (lat) * widthSeg,
                    lon + (lat+1) * widthSeg + 1,
                    lon + (lat) * widthSeg + 1,

                )
            }
        }

        this.vertices = new Float32Array(_vertices)
        this.normals = new Float32Array(_normals)
        this.uvMap = new Float32Array(_faceUvs)
        this.indices = new Uint32Array(_indices)
        this.drawCount = _indices.length
    }

}
