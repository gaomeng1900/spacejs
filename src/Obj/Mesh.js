import Obj from "./Obj"
import glUtil from "../WebGL/util"
import Mat4 from "../Math/Mat4"

const SQ2 = Math.sqrt(2)

export default class Mesh extends Obj{
    constructor(geom, material) {
        super(geom, material)
        // THREE: drawMode, clone, rayCast
        this._hasBind = 0
    }

    draw(gl, scene, cam) {
        const geom = this.geom
        const material = this.material
        // 更新 模型矩阵, 模型逆转置矩阵
        // this.updateMat()

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
            // 如果传这个的话, 需要保证aColor是活跃的
            // glUtil.anf(gl, shaderProgram, "aColor", ...material.color.getArray())
            glUtil.bindTextureWithColor(gl, shaderProgram, "uSampler", material.color)
        }

        // 顶点顺序
        glUtil.bindElemArrayBuffer(gl, geom.indices)
        if (!this._hasBind) {
            this._hasBind = true
        }

        // 光
        scene.lights.forEach(light => {
            if (light.type === "pointLight") {
                // 点光源
                glUtil.unf(gl, shaderProgram, "uPointLightPos", light.pos.x, light.pos.y, light.pos.z)
                glUtil.unf(gl, shaderProgram, "uPointLightColor", ...light.color.getArray())
                // shadow map

            }
            if (light.type === "ambientLight") {
                // 环境光
                glUtil.unf(gl, shaderProgram, "uAmbientLight", ...light.color.getArray())
            }
        })

        // 高光
        glUtil.unf(gl, shaderProgram, "uViewPos", cam.pos.x, cam.pos.y, cam.pos.z)
        glUtil.unf(gl, shaderProgram, "uShininess", 10.0)

        // 阴影
        // glUtil.bindTextureWithUnit(gl, shaderProgram, "uShadowMap", 7, scene.texture)
        // glUtil.uMat(gl, shaderProgram, "uProjMatFromLight", this.pMatFromLight.getArray())
        for (let i = 0; i < 6; i++) {
            glUtil.bindTextureWithUnit(gl, shaderProgram, "uShadowMap" + i, 7 + i, scene.shadowTextures[i])
            glUtil.uMat(gl, shaderProgram, "uProjMatFromLight" + i, this["pMatFromLight" + i].getArray())
        }

        // 矩阵
        glUtil.uMat(gl, shaderProgram, "uModelMat", this.mMat.getArray())
        glUtil.uMat(gl, shaderProgram, "uNormalMat", this.nMat.getArray())

        let pMat = cam.pMat.clone()
        let vMat = cam.vMat.clone()
        glUtil.uMat(gl, shaderProgram, "uProjMat", pMat.mult(vMat).mult(this.mMat).getArray())

        gl.drawElements(gl[geom.drawMode], geom.drawCount, gl[geom.drawType], geom.drawOffset)
    }

    drawShadow(gl, light) {
        const geom = this.geom
        const material = this.material
        // 更新 模型矩阵, 模型逆转置矩阵
        this.updateMat()

        let shaderProgram = material.programShadow
        gl.useProgram(shaderProgram)

        // 顶点
        glUtil.bindArrayBuffer(gl, shaderProgram, "aPosition", geom.vertices)

        // 顶点顺序
        glUtil.bindElemArrayBuffer(gl, geom.indices)

        // 矩阵
        // 如果是点光源, 就让这个光照向这个物体
        let pMat = new Mat4().setPerspective(90, 1, 0.1, 100)
        let vMat = new Mat4().setLookAt(...light.pos.getArray(),
                                        0, 0, 0,
                                        0, 1, 0, // TODO: 可能和视线重合
                                        )
        let pMatFromLight = pMat.mult(vMat).mult(this.mMat)
        this.pMatFromLight = pMatFromLight

        glUtil.uMat(gl, shaderProgram, "uProjMatFromLight", pMatFromLight.getArray())

        gl.drawElements(gl[geom.drawMode], geom.drawCount, gl[geom.drawType], geom.drawOffset)
    }

    drawShadowN(gl, light, n) {
        const geom = this.geom
        const material = this.material
        // // 更新 模型矩阵, 模型逆转置矩阵
        // this.updateMat()

        let shaderProgram = material.programShadow
        gl.useProgram(shaderProgram)

        // 顶点
        glUtil.bindArrayBuffer(gl, shaderProgram, "aPosition", geom.vertices)

        // 顶点顺序
        glUtil.bindElemArrayBuffer(gl, geom.indices)

        // 矩阵
        // NOTE: 能不能缓存!!!
        let pMatFromLight = light.getMatFromLight(this.mMat, n)
        this["pMatFromLight" + n] = pMatFromLight
        glUtil.uMat(gl, shaderProgram, "uProjMatFromLight", pMatFromLight.getArray())

        gl.drawElements(gl[geom.drawMode], geom.drawCount, gl[geom.drawType], geom.drawOffset)
    }

}
