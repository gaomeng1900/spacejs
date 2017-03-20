import Obj from "./Obj/Obj"
import Light from "./Light/Light"
import glUtil from "./WebGL/util"

export default class Scene {
    constructor(renderer) {
        this.objs = []
        this.lights = []
        this.renderer = renderer
        this.gl = renderer.gl
        // ELEMENT_ARRAY_BUFFER 的缓存
        // TODO: 写这里好丑呀
        this._elemArrayBuffer = renderer.gl.createBuffer()
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
            sth.shaderProgram = glUtil.makeShader(sth.vs, sth.fs, this.gl)
            // buffer缓存, 避免重复创建buffer
            // TODO: 然而挂这里是不是不太好看
            sth.shaderProgram._buffers = {}
        } else if (sth instanceof Light) {
            this.lights.push(sth)
        } else {
            console.error("你add了什么...")
        }
    }
}
