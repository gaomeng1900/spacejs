import Material from "./Material"

// shader segment
import vs_head from "./shaderSegment/vs_head.vs"
import vs_main_line from "./shaderSegment/vs_main_line.vs"

import fs_head from "./shaderSegment/fs_head.fs"
import fs_main_line from "./shaderSegment/fs_main_line.fs"

import glUtil from "../WebGL/util"

export default class LineMaterial extends Material {
    constructor(props) {
        super(props)
    }

    makeShader(gl, hasTex) { // 暂时全部启用纹理
        this.vs = vs_head + "\n" + vs_main_line
        this.fs = fs_head + "\n" + fs_main_line
        this.shaderProgram = glUtil.makeShader(this.vs, this.fs, gl)
    }
}
