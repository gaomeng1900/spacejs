import Mat4 from "../Math/Mat4"
import Vec3 from "../Math/Vec3"
import Material from "../Material/Material"
// 物体, 虚基类
export default class Obj {
    constructor(geom, material) {
        this.geom = geom
        this.material = material

        this.pos = new Vec3() // 其实就是 translate

        this.rotateMat = new Mat4().setRotate(0, 0, 1, 0)
        this.scaleMat = new Mat4().setScale(1, 1, 1)
        this.mMat = new Mat4()
        this.nMat = new Mat4()
    }

    rotateY(alpha) {
        this.rotateMat = new Mat4().setRotate(alpha, 0, 1, 0).mult(this.rotateMat)
    }

    rotateX(alpha) {
        this.rotateMat = new Mat4().setRotate(alpha, 1, 0, 0).mult(this.rotateMat)
    }

    rotateZ(alpha) {
        this.rotateMat = new Mat4().setRotate(alpha, 0, 0, 1).mult(this.rotateMat)
    }

    scale(x, y, z) {
        this.scaleMat = new Mat4().setScale(x, y, z)
    }

    updateMat() {
        let _translateMat = new Mat4().setTranslate(this.pos.x, this.pos.y, this.pos.z)
        let _scaleMat = this.scaleMat.clone()
        let _rotateMat = this.rotateMat.clone()
        this.mMat = _translateMat.mult(_rotateMat.mult(_scaleMat))
        this.nMat = new Mat4().setInverseOf(this.mMat).transpose()
    }
}
