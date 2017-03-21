import glUtil from "./WebGL/util"
import Mat4 from "./Math/Mat4"
import Vec3 from "./Math/Vec3"
import Color from "./Math/Color"
import CubeGeom from "./Geom/CubeGeom"
import Scene from "./Scene"
import PointLight from "./Light/PointLight"
import AmbientLight from "./Light/AmbientLight"
import Material from "./Material/Material"
import BasicMaterial from "./Material/BasicMaterial"
import Texture from "./Material/Texture"
import Mesh from "./Obj/Mesh/Mesh"
import Camera from "./Camera"
// import * from "./util"

const renderer_conf_default = {
    canvas: document.createElement("canvas"),
    clearColor: new Color(1, 1, 1, 1)
}

class Renderer {
    constructor(props) {
        this.conf = {
            renderer_conf_default,
            ...props,
        }
        const conf = this.conf
        // 初始化GL
        this.gl = glUtil.initWebGL(conf.canvas, conf.width, conf.height, conf.clearColor)
    }

    render(scene, cam) {
        const gl = this.gl
        // 重置
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        // 更新view mat(相机可能在移动呀)
        cam.updateVMat()
        // 遍历scene里的所有Mesh, 分别绑定着色器, 计算各种矩阵, 传入并绘制
        scene.objs.forEach(obj => {
            // const shaderProgram = obj.shaderProgram
            const geom = obj.geom
            const material = obj.material
            // 更新 模型矩阵, 模型逆转置矩阵
            obj.updateMat()
            // obj.draw(gl, scene.lights, cam)
            // 重复link性能太差
            // let shaderProgram = glUtil.makeShader(obj.vs, obj.fs, gl)
            let shaderProgram = material.shaderProgram
            gl.useProgram(shaderProgram)

            // 顶点
            glUtil.bindArrayBuffer(gl, shaderProgram, "aPosition", geom.vertices)

            // 法线
            glUtil.bindArrayBuffer(gl, shaderProgram, "aNormal", geom.normals)

            // 颜色 与 贴图之类的
            // glUtil.bindArrayBuffer(gl, shaderProgram, "aColor", geom.colors)
            if (material.map && material.map.ready) {
                glUtil.bindArrayBuffer(gl, shaderProgram, "aTexCoord", geom.uvMap, 2)
                glUtil.bindTexture(gl, shaderProgram, "uSampler", material.map)
            } else {
                glUtil.bindTextureWithColor(gl, shaderProgram, "uSampler", material.color)
            }


            // 面
            glUtil.bindElemArrayBuffer(gl, geom.indices, scene._elemArrayBuffer)

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
            glUtil.uMat(gl, shaderProgram, "uModelMat", obj.mMat.getArray())
            glUtil.uMat(gl, shaderProgram, "uNormalMat", obj.nMat.getArray())

            let pMat = cam.pMat.clone()
            let vMat = cam.vMat.clone()
            glUtil.uMat(gl, shaderProgram, "uProjMat", pMat.mult(vMat).mult(obj.mMat).getArray())

            gl.drawElements(gl[geom.drawMode], geom.drawCount, gl[geom.drawType], geom.drawOffset)
        })
    }
}


export default {
    Vec3: Vec3,
    Mat4: Mat4,
    Color:Color,
    Renderer: Renderer,
    Camera: Camera,
    Scene: Scene,
    PointLight: PointLight,
    AmbientLight: AmbientLight,
    CubeGeom: CubeGeom,
    Material: Material,
    BasicMaterial: BasicMaterial,
    Texture: Texture,
    Mesh: Mesh,
}
