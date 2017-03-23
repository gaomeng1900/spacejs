import Material from "./Material"
// shader segment
import vs_head from "./shaderSegment/head.vs"
import vs_main_lambert from "./shaderSegment/main_lambert.vs"

import fs_head from "./shaderSegment/head.fs"
import fs_main_lambert from "./shaderSegment/main_lambert.fs"

import glUtil from "../WebGL/util"

export default class BasicMaterial extends Material {
    constructor(props) {
        super(props)
    }

    makeShader(gl, hasTex = true) { // 暂时全部启用纹理
        this.vs = vs_head + "\n" + vs_main_lambert
        this.fs = fs_head + "\n" + fs_main_lambert
        this.shaderProgram = glUtil.makeShader(this.vs, this.fs, gl)
    }
}
