import Obj from "../Obj"
// import vs from "./Mesh.vs"
// import fs from "./Mesh.fs"
import glUtil from "../../WebGL/util"

export default class Mesh extends Obj{
    constructor(geom, material) {
        super(geom, material)
        // THREE: drawMode, clone, rayCast

        // 会提示上下文错误
        // THREE是怎么做的
        // -> THREE 也会禁止renderer之间共享, 看来是第一次render的时候编译的
    }
}
