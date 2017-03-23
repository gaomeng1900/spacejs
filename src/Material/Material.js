import Color from "../Math/Color"
import uuid from "uuid"

const conf_default = {
    color: new Color(1.0, .0, .0, 1.0)
}

export default class Material {
    constructor(props) {
        let conf = {
            ...conf_default,
            ...props
        }

        this.color = conf.color
        this.map = conf.map
        this.vs
        this.fs
        this.shaderProgram

        this.uuid = uuid()
    }

    makeShader(gl) {}

    // TODO
    clone() {}
}
