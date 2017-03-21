import Obj from "./Obj/Obj"
import Light from "./Light/Light"
import glUtil from "./WebGL/util"

export default class Scene {
    constructor(renderer) {
        this.objs = []
        this.lights = []
        this.renderer = renderer
        this.gl = renderer.gl
    }

    add(...sths) {
        sths.forEach(sth => {
            this._add(sth)
        })
    }

    _add(sth) {
        if (sth instanceof Obj) {
            this.objs.push(sth)
            // TODO: 在这里编译shader?
            // 通过有没有map来决定使用的shader
            // TODO: 要不要统一弄个空map, 取样会对性能造成多大的影响
            sth.material.makeShader(this.gl, true) // 全部启用纹理
            // sth.material.makeShader(this.gl, sth.material.map)
            // sth.shaderProgram = glUtil.makeShader(sth.material.vs, sth.material.fs, this.gl)
        } else if (sth instanceof Light) {
            this.lights.push(sth)
        } else {
            console.error("你add了什么...")
        }
    }
}
