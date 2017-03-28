import glUtil from "./WebGL/util"
import Mat4 from "./Math/Mat4"
import Vec3 from "./Math/Vec3"
import Vec4 from "./Math/Vec4"
import Color from "./Math/Color"
import CubeGeom from "./Geom/CubeGeom"
import ConeGeom from "./Geom/ConeGeom"
import SphereGeom from "./Geom/SphereGeom"
import PlaneGeom from "./Geom/PlaneGeom"
import LineGeom from "./Geom/LineGeom"
import Scene from "./Scene"
import PointLight from "./Light/PointLight"
import AmbientLight from "./Light/AmbientLight"
import Material from "./Material/Material"
import BasicMaterial from "./Material/BasicMaterial"
import LineMaterial from "./Material/LineMaterial"
import Texture from "./Material/Texture"
import Mesh from "./Obj/Mesh"
import Line from "./Obj/Line"
import Camera from "./Camera"

// test
import CustomGeom from "./Geom/CustomGeom"

const renderer_conf_default = {
    canvas: document.createElement("canvas"),
    clearColor: new Color(1, 1, 1, 1)
}

const bufferObj = []
let FOB

// const SQ2 = Math.sqrt(2)

const OFFSCREEN_WIDTH = 1000
const OFFSCREEN_HEIGHT = 1000

class Renderer {
    constructor(props) {
        this.conf = {
            renderer_conf_default,
            ...props,
        }
        const conf = this.conf
        // 初始化GL
        this.gl = glUtil.initWebGL(conf.canvas, conf.width,
                                   conf.height, conf.clearColor)
    }

    render(scene, cam) {
        // const gl = this.gl
        // // 重置
        // gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        // // 更新view mat(相机可能在移动呀)
        // cam.updateVMat()
        //
        // if (!scene.texture) {
        //     scene.texture = gl.createTexture()
        // }
        // // 画出点光源的shadowmap
        // let bufferObj = glUtil.initFramebufferObject(gl, scene.texture, OFFSCREEN_WIDTH, OFFSCREEN_HEIGHT)
        //
        // // NOTE: 下面这两个如果不同时出现会出现错误
        // gl.activeTexture(gl.TEXTURE7) // Set a texture object to the texture unit
        // gl.bindTexture(gl.TEXTURE_2D, bufferObj.texture)
        //
        // gl.clearColor(0, 0, 1, 1)
        // gl.enable(gl.DEPTH_TEST)
        // gl.bindFramebuffer(gl.FRAMEBUFFER, bufferObj) // Change the drawing destination to FBO
        // gl.viewport(0, 0, OFFSCREEN_HEIGHT, OFFSCREEN_HEIGHT) // Set view port for FBO
        // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // Clear FBO
        // scene.lights.forEach(light => {
        //     if (light.type === "pointLight") {
        //         scene.objs.forEach(obj => {
        //             obj.drawShadow(gl, light)
        //             // obj.drawShadowN(gl, light, 0)
        //         })
        //     }
        // })

        const gl = this.gl
        // 重置
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        // 更新view mat(相机可能在移动呀)
        cam.updateVMat()

        // 更新 模型矩阵, 模型逆转置矩阵
        scene.objs.forEach(obj => {
            obj.updateMat()
        })

        if (!scene.shadowTextures) {
            scene.shadowTextures = []
            for (let i = 0; i < 6; i++) {
                scene.shadowTextures.push(gl.createTexture())
            }
        }
        // test: texture cube
        if (!scene.shadow_texture_cube) {
            scene.shadow_texture_cube = gl.createTexture()
        }
        // 画六张shadowmap
        for (let i = 0; i < 6; i++) {
            // 画出点光源的shadowmap
            // 完全没有必要弄一个奇怪的立方体
            // let _shadowArticulation = 2048
            // let _width, _height
            // if (i < 4) {
            //     _width = _shadowArticulation
            //     _height = SQ2 * _shadowArticulation / 2
            // } else {
            //     _width = _shadowArticulation
            //     _height = _shadowArticulation
            // }
            //
            // if (!bufferObj[i]) {
            //     bufferObj[i] = glUtil.initFramebufferObject(gl, scene.shadowTextures[i], _width, _height)
            // }
            // 正立方体多方便
            if (!bufferObj[i]) {
                bufferObj[i] = glUtil.initFramebufferObject(gl, scene.shadowTextures[i], OFFSCREEN_WIDTH, OFFSCREEN_WIDTH)
            }

            // NOTE: 下面这两个如果不同时出现会出现错误
            gl.activeTexture(gl["TEXTURE" + (7 + i)]) // Set a texture object to the texture unit
            gl.bindTexture(gl.TEXTURE_2D, bufferObj[i].texture)

            gl.clearColor(0, 0, 1, 1)
            gl.enable(gl.DEPTH_TEST)
            gl.bindFramebuffer(gl.FRAMEBUFFER, bufferObj[i]) // Change the drawing destination to FBO

            gl.viewport(0, 0, OFFSCREEN_WIDTH, OFFSCREEN_WIDTH) // Set view port for FBO
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // Clear FBO
            scene.lights.forEach(light => {
                // light.bufferObj = light.bufferObj ? light.bufferObj : []
                // if (!light.bufferObj[i]) {
                //     light.bufferObj[i] = glUtil.initFramebufferObject(gl, scene.shadowTextures[i], _width, _height)
                // }
                // // NOTE: 下面这两个如果不同时出现会出现错误
                // gl.activeTexture(gl["TEXTURE" + (7 + i)]) // Set a texture object to the texture unit
                // gl.bindTexture(gl.TEXTURE_2D, light.bufferObj[i].texture)
                //
                // gl.clearColor(0, 0, 0, 1)
                // gl.enable(gl.DEPTH_TEST)
                // gl.bindFramebuffer(gl.FRAMEBUFFER, light.bufferObj[i]) // Change the drawing destination to FBO
                //
                // gl.viewport(0, 0, _width, _height) // Set view port for FBO
                // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // Clear FBO

                if (light.type === "pointLight") {
                    scene.objs.forEach(obj => {
                        // obj.drawShadow(gl, light)
                        obj.drawShadowN(gl, light, i)
                    })
                }
            })
        }


        // 画一个cubemap



        // gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null) // Change the drawing destination to color buffer
        gl.clearColor(...this.conf.clearColor.getArray())
        gl.viewport(0, 0, this.conf.canvas.width, this.conf.canvas.height)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // Clear color and depth buffer
        // 遍历scene里的所有Mesh, 分别绑定着色器, 计算各种矩阵, 传入并绘制
        scene.objs.forEach(obj => {
            obj.draw(gl, scene, cam)
        })
    }
}

export default {
    Vec3: Vec3,
    Vec4: Vec4,
    Mat4: Mat4,
    Color:Color,
    Renderer: Renderer,
    Camera: Camera,
    Scene: Scene,
    PointLight: PointLight,
    AmbientLight: AmbientLight,
    CubeGeom: CubeGeom,
    ConeGeom: ConeGeom,
    SphereGeom: SphereGeom,
    PlaneGeom: PlaneGeom,
    LineGeom: LineGeom,
    Material: Material,
    BasicMaterial: BasicMaterial,
    LineMaterial: LineMaterial,
    Texture: Texture,
    Mesh: Mesh,
    Line: Line,

    // test
    CustomGeom: CustomGeom,
}
