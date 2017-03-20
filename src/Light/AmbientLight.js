import Light from "./Light"

export default class AmbientLight extends Light {
    constructor(color) {
        super()
        this.type = "ambientLight"
        // this.pos = pos
        this.color = color
        // this.intensity = intensity
    }
}
