import Color from "../Math/Color"

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
    }

    makeShader(gl) {
        console.warn("你在调用虚函数")
    }

    clone() {}
}
