import glUtil from "./WebGL/util"
import Mat4 from "./Math/Mat4"
import Vec3 from "./Math/Vec3"
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
        const gl = this.gl
        // 重置
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        // 更新view mat(相机可能在移动呀)
        cam.updateVMat()
        // 遍历scene里的所有Mesh, 分别绑定着色器, 计算各种矩阵, 传入并绘制
        scene.objs.forEach(obj => {
            obj.draw(gl, scene, cam)
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
