import Vec4 from "./Vec4"

export default class Color extends Vec4 {
    constructor(...props) {
        super(...props)
        this.r = this.x
        this.g = this.y
        this.b = this.z
        this.a = this.w

    }

    getArrayInt() {
        return new Uint8Array([
            parseInt(this.r * 255),
            parseInt(this.g * 255),
            parseInt(this.b * 255),
            parseInt(this.a * 255),
        ])
    }

    getArray() {
        return new Float32Array([
            this.r, this.g, this.b, this.a
        ])
    }
}
