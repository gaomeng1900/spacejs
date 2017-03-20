import Obj from "./Obj/Obj"
import Mat4 from "./Math/Mat4"
import Vec3 from "./Math/Vec3"

// TODO: 去掉继承
export default class Camera extends Obj {
    constructor(type, ...props) {
        super()
        this.type = type
        try {
            if (type === "perspective") {
                this.pMat = new Mat4().setPerspective(...props)
                    // props.fov,
                    // props.aspect,
                    // props.near,
                    // props.far

            } else if (type === "ortho") {
                this.pMat = new Mat4().setOrtho(...props)
                //     props.left,
                //     props.right,
                //     props.bottom,
                //     props.top,
                //     props.near,
                //     props.far
                // )
            } else {
                console.error("传入参数错误: type")
            }
        } catch (e) {
            console.error("投影矩阵计算失败, 检查传入参数")
        }

        this.pos = new Vec3(0, 0, 0)
        this.up = new Vec3(0, 1, 0)
        this.center = new Vec3(0, 0, -1)
    }

    updateVMat() {
        this.vMat = new Mat4().setLookAt(
            this.pos.x,
            this.pos.y,
            this.pos.z,
            this.center.x,
            this.center.y,
            this.center.z,
            this.up.x,
            this.up.y,
            this.up.z,
        )
    }
}
