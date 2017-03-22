import Obj from "./Obj"
import glUtil from "../WebGL/util"

export default class Mesh extends Obj{
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

        // 法线
        glUtil.bindArrayBuffer(gl, shaderProgram, "aNormal", geom.normals)

        // 颜色 与 贴图之类的
        glUtil.bindArrayBuffer(gl, shaderProgram, "aTexCoord", geom.uvMap, 2)
        if (material.map && material.map.ready) {
            glUtil.bindTexture(gl, shaderProgram, "uSampler", material.map)
        } else {
            glUtil.unf(gl, shaderProgram, "aColor", ...material.color.getArray())
            glUtil.bindTextureWithColor(gl, shaderProgram, "uSampler", material.color)
        }

        // 顶点顺序
        glUtil.bindElemArrayBuffer(gl, geom.indices)

        // 光
        scene.lights.forEach(light => {
            if (light.type === "pointLight") {
                // 点光源
                glUtil.unf(gl, shaderProgram, "uPointLightPos", light.pos.x, light.pos.y, light.pos.z)
                glUtil.unf(gl, shaderProgram, "uPointLightColor", ...light.color.getArray())
            }
            if (light.type === "ambientLight") {
                // 环境光
                glUtil.unf(gl, shaderProgram, "uAmbientLight", ...light.color.getArray())
            }
        })

        // 高光
        glUtil.unf(gl, shaderProgram, "uViewPos", cam.pos.x, cam.pos.y, cam.pos.z)
        glUtil.unf(gl, shaderProgram, "uShininess", 20.0)

        // 矩阵
        glUtil.uMat(gl, shaderProgram, "uModelMat", this.mMat.getArray())
        glUtil.uMat(gl, shaderProgram, "uNormalMat", this.nMat.getArray())

        let pMat = cam.pMat.clone()
        let vMat = cam.vMat.clone()
        glUtil.uMat(gl, shaderProgram, "uProjMat", pMat.mult(vMat).mult(this.mMat).getArray())

        gl.drawElements(gl[geom.drawMode], geom.drawCount, gl[geom.drawType], geom.drawOffset)
    }
}