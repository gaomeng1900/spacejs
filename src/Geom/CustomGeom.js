import Vec2 from "../Math/Vec2"
import Vec3 from "../Math/Vec3"
import Face from "../Face"
import Geom from "./Geom"

export default class CustomGeom extends Geom {
    constructor() {
        super()

        // front
        let face
        face = new Face(
            new Vec3(1,1,1),
            new Vec3(-1,1,1),
            new Vec3(-1,-1,1),
            new Vec2(1,0),
            new Vec2(0,0),
            new Vec2(0,1)
        )
        this.faces.push(face)
        face = new Face(
            new Vec3(1,1,1),
            new Vec3(-1,-1,1),
            new Vec3(1,-1,1),
            new Vec2(1,0),
            new Vec2(0,1),
            new Vec2(1,1)
        )
        this.faces.push(face)

        // top
        face = new Face(
            new Vec3(1,1,1),
            new Vec3(1,1,-1),
            new Vec3(-1,1,1),
            new Vec2(0,0),
            new Vec2(0,1),
            new Vec2(1,0)
        )
        this.faces.push(face)
        face = new Face(
            new Vec3(1,1,-1),
            new Vec3(-1,1,-1),
            new Vec3(-1,1,1),
            new Vec2(0,1),
            new Vec2(1,1),
            new Vec2(1,0)
        )
        this.faces.push(face)

        this.initFromFaces()
    }
}
