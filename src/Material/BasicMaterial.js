import Material from "./Material"
// shader segment
import vs_head from "./shaderSegment/head.vs"
import vs_main_color from "./shaderSegment/main_color.vs"
import vs_main_tex from "./shaderSegment/main_tex.vs"

import fs_head from "./shaderSegment/head.fs"
import fs_main_color from "./shaderSegment/main_color.fs"
import fs_main_tex from "./shaderSegment/main_tex.fs"

import glUtil from "../WebGL/util"

export default class BasicMaterial extends Material {
    constructor(props) {
        super(props)
    }

    makeShader(gl, hasTex = true) { // 暂时全部启用纹理
        if (hasTex) {
            this.vs = vs_head + "\n" + vs_main_tex
            this.fs = fs_head + "\n" + fs_main_tex
        } else {
            this.vs = vs_head + "\n" + vs_main_color
            this.fs = fs_head + "\n" + fs_main_color
        }
        this.shaderProgram = glUtil.makeShader(this.vs, this.fs, gl)
    }
}
