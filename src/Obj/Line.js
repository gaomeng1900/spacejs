import Obj from "./Obj"
import glUtil from "../WebGL/util"

export default class Line extends Obj{
    constructor(geom, material) {
        super(geom, material)
        // THREE: drawMode, clone, rayCast

    }

    draw(gl, scene, cam) {
        const geom = this.geom
        const material = this.material
        // 更新 模型矩阵, 模型逆转置矩阵
        this.updateMat()
        // 重复link性能太差
        let shaderProgram = material.shaderProgram
        gl.useProgram(shaderProgram)

        // 顶点
        glUtil.bindArrayBuffer(gl, shaderProgram, "aPosition", geom.vertices)

        // 顶点顺序
        glUtil.bindElemArrayBuffer(gl, geom.indices)

        // 颜色
        glUtil.anf(gl, shaderProgram, "aColor", ...material.color.getArray())

        // 矩阵
        glUtil.uMat(gl, shaderProgram, "uModelMat", this.mMat.getArray())
        glUtil.uMat(gl, shaderProgram, "uNormalMat", this.nMat.getArray())

        let pMat = cam.pMat.clone()
        let vMat = cam.vMat.clone()
        glUtil.uMat(gl, shaderProgram, "uProjMat", pMat.mult(vMat).mult(this.mMat).getArray())

        gl.drawElements(gl[geom.drawMode], geom.drawCount, gl[geom.drawType], geom.drawOffset)

    }
}
