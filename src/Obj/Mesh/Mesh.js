import Obj from "../Obj"
import vs from "./Mesh.vs"
import fs from "./Mesh.fs"
import glUtil from "../../WebGL/util"

export default class Mesh extends Obj{
    constructor(geom, material) {
        super(geom, material)
        this.vs = vs
        this.fs = fs

        // 会提示上下文错误
        // TODO: THREE是怎么做的
        // let _tmpGL = glUtil.initWebGL(document.createElement("canvas"))
        // this.shaderProgram = glUtil.makeShader(vs, fs, _tmpGL)
    }

    // updateShader(gl) {
    //     this.shaderProgram = util.makeShader(vs, fs, gl)
    //     gl.useProgram(shaderProgram)
    // }

    // draw(gl, lights, ) {
    //
    // }
}
