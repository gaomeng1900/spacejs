import Vec2 from "./Math/Vec2"

export default class Face {
    constructor(a, b, c, uvA, uvB, uvC) {
        this.a = a
        this.b = b
        this.c = c

        this.uvA = uvA || new Vec2(1, 0)
        this.uvB = uvB || new Vec2(0, 0)
        this.uvC = uvC || new Vec2(0, 1)

        this.normal = b.sub(a).cross(c.sub(b)).unit()
    }

    getAbc() {
        return [...this.a.getArray(), ...this.b.getArray(), ...this.c.getArray()]
    }

    getUvAbc() {
        return [...this.uvA.getArray(), ...this.uvB.getArray(), ...this.uvC.getArray()]
    }
}
