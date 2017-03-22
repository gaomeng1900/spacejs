import Vec2 from "../Math/Vec2"
import Vec3 from "../Math/Vec3"
import Face from "../Face"
import Geom from "./Geom"

export default class ConeGeom extends Geom {
    constructor(radius, seg, height) {
        super()
        seg = seg < 3 ? 3 : seg

        let apex = new Vec3(0,height,0)

        let b_v = []
        let alpha = 0
        let delta = Math.PI * 2 / seg
        let i
        for (i = 0; i < seg; i++) {
            b_v.push(new Vec3(radius * Math.cos(alpha), 0, radius * Math.sin(alpha)))
            alpha += delta
        }

        let face
        let bottom_face_count = seg - 2
        for (i = 0; i < bottom_face_count; i++) {
            if (i === 0) {
                face = new Face( b_v[0], b_v[1], b_v[2] )
            } else {
                face = new Face( b_v[i+1], b_v[i+2], b_v[0] )
            }
            this.faces.push(face)
        }

        for (i = 0; i < seg; i++) {
            if (i === seg - 1) {
                face = new Face( b_v[i], apex, b_v[0] )
            } else {
                face = new Face( b_v[i], apex, b_v[i+1] )
            }
            this.faces.push(face)
        }

        this.initFromFaces()
    }
}
