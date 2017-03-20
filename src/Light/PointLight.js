import Light from "./Light"

export default class PointLight extends Light {
    constructor(pos, color, intensity) {
        super()
        this.type = "pointLight"
        this.pos = pos
        this.color = color
        this.intensity = intensity
    }
}
