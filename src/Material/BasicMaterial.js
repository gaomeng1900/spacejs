import Material from "./Material"
// import vs from "./BasicMaterial.vs"
// import fs from "./BasicMaterial.fs"
// shader segment
import vs_head from "./shaderSegment/vs_head.vs"
import vs_main_color from "./shaderSegment/vs_main_color.vs"
import vs_main_tex from "./shaderSegment/vs_main_tex.vs"

import fs_head from "./shaderSegment/fs_head.fs"
import fs_main_color from "./shaderSegment/fs_main_color.fs"
import fs_main_tex from "./shaderSegment/fs_main_tex.fs"

import glUtil from "../WebGL/util"

export default class BasicMaterial extends Material {
    constructor(props) {
        super(props)

        // TODO: 有没有必要每种material共享一个vs/fs, 和一个shaderProgram
        // this.vs = vs
        // this.fs = fs
    }

    makeShader(gl, hasTex) { // 暂时全部启用纹理
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
