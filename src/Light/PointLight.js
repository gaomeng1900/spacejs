
import Mat4 from "../Math/Mat4"
import Light from "./Light"

const SQ2 = Math.sqrt(2)
const alpha = Math.atan(SQ2 / 2) * 180 / Math.PI * 2


// TODO: 完全可以使用正方体来分割shadowmap



export default class PointLight extends Light {
    constructor(pos, color, intensity) {
        super()
        this.type = "pointLight"
        this.pos = pos
        this.color = color
        this.intensity = intensity

        this.updateVMat()

        // this.pMatA = new Mat4().setPerspective(90, SQ2, 0.1, 100 * SQ2 / 2) // 注意far对齐
        // this.pMatB = new Mat4().setPerspective(alpha, 1, 0.1, 100) // 注意far对齐
        // NOTE: 完全没有必要弄成上面那个样子嘛fuck!!!!
        this.pMat = new Mat4().setPerspective(90, 1, 0.1, 100)
    }

    getMatFromLight(mMat, n) {
        // return new Mat4().setIdentity()
        let pMatFromLight, pMat, vMat
        // NOTE: 用6个矩阵拼满各个方向
        // switch (n) {
        //     case 0:
        //         pMat = new Mat4().setPerspective(90, SQ2, 0.1, 100 * SQ2 / 2) // 注意far对齐
        //         vMat = new Mat4().setLookAt(...this.pos.getArray(),
        //                                          this.pos.x - 1, this.pos.y + 1, this.pos.z,
        //                                          1, 1, 0)// TODO: 可能和视线重合
        //         pMatFromLight = pMat.mult(vMat).mult(mMat)
        //         break;
        //     case 1:
        //         pMat = new Mat4().setPerspective(90, SQ2, 0.1, 100 * SQ2 / 2) // 注意far对齐
        //         vMat = new Mat4().setLookAt(...this.pos.getArray(),
        //                                          this.pos.x + 1, this.pos.y + 1, this.pos.z,
        //                                          -1, 1, 0)// TODO: 可能和视线重合
        //         pMatFromLight = pMat.mult(vMat).mult(mMat)
        //         break;
        //     case 2:
        //         pMat = new Mat4().setPerspective(90, SQ2, 0.1, 100 * SQ2 / 2) // 注意far对齐
        //         vMat = new Mat4().setLookAt(...this.pos.getArray(),
        //                                          this.pos.x + 1, this.pos.y - 1, this.pos.z,
        //                                          1, 1, 0)// TODO: 可能和视线重合
        //         pMatFromLight = pMat.mult(vMat).mult(mMat)
        //         break;
        //     case 3:
        //         pMat = new Mat4().setPerspective(90, SQ2, 0.1, 100 * SQ2 / 2) // 注意far对齐
        //         vMat = new Mat4().setLookAt(...this.pos.getArray(),
        //                                          this.pos.x - 1, this.pos.y - 1, this.pos.z,
        //                                          -1, 1, 0)// TODO: 可能和视线重合
        //         pMatFromLight = pMat.mult(vMat).mult(mMat)
        //         break;
        //     case 4:
        //         pMat = new Mat4().setPerspective(alpha, 1, 0.1, 100) // 注意far对齐
        //         vMat = new Mat4().setLookAt(...this.pos.getArray(),
        //                                          this.pos.x, this.pos.y, this.pos.z + 1,
        //                                          1, 1, 0)// TODO: 可能和视线重合
        //         pMatFromLight = pMat.mult(vMat).mult(mMat)
        //         break;
        //     case 5:
        //         pMat = new Mat4().setPerspective(alpha, 1, 0.1, 100) // 注意far对齐
        //         vMat = new Mat4().setLookAt(...this.pos.getArray(),
        //                                          this.pos.x, this.pos.y, this.pos.z - 1,
        //                                          1, 1, 0)// TODO: 可能和视线重合
        //         pMatFromLight = pMat.mult(vMat).mult(mMat)
        //         break;
        //     default:
        //         console.error("未选择光线方向序号")
        // }
        switch (n) {
            case 0:
                pMat = this.pMat.clone()
                vMat = this.vMat0
                pMatFromLight = pMat.mult(vMat).mult(mMat)
                break;
            case 1:
                pMat = this.pMat.clone()
                vMat = this.vMat1
                pMatFromLight = pMat.mult(vMat).mult(mMat)
                break;
            case 2:
                pMat = this.pMat.clone()
                vMat = this.vMat2
                pMatFromLight = pMat.mult(vMat).mult(mMat)
                break;
            case 3:
                pMat = this.pMat.clone()
                vMat = this.vMat3
                pMatFromLight = pMat.mult(vMat).mult(mMat)
                break;
            case 4:
                pMat = this.pMat.clone()
                vMat = this.vMat4
                pMatFromLight = pMat.mult(vMat).mult(mMat)
                break;
            case 5:
                pMat = this.pMat.clone()
                vMat = this.vMat5
                pMatFromLight = pMat.mult(vMat).mult(mMat)
                break;
            default:
                console.error("未选择光线方向序号")
        }
        return pMatFromLight

        // this.pMatFromLight0 = pMatFromLight0
        //
        // let pMat1 = new Mat4().setPerspective(90, SQ2, 0.1, 100 * SQ2 / 2) // 注意far对齐
        // let vMat1 = new Mat4().setLookAt(...light.pos.getArray(),
        //                                  light.pos.x + 1, light.pos.y + 1, light.pos.z,
        //                                  -1, 1, 0)// TODO: 可能和视线重合
        // let pMatFromLight1 = pMat1.mult(vMat1).mult(this.mMat)
        // this.pMatFromLight1 = pMatFromLight1
        //
        // let pMat2 = new Mat4().setPerspective(90, SQ2, 0.1, 100 * SQ2 / 2) // 注意far对齐
        // let vMat2 = new Mat4().setLookAt(...light.pos.getArray(),
        //                                  light.pos.x + 1, light.pos.y - 1, light.pos.z,
        //                                  1, 1, 0)// TODO: 可能和视线重合
        // let pMatFromLight2 = pMat2.mult(vMat2).mult(this.mMat)
        // this.pMatFromLight2 = pMatFromLight2
        //
        // let pMat3 = new Mat4().setPerspective(90, SQ2, 0.1, 100 * SQ2 / 2) // 注意far对齐
        // let vMat3 = new Mat4().setLookAt(...light.pos.getArray(),
        //                                  light.pos.x - 1, light.pos.y - 1, light.pos.z,
        //                                  -1, 1, 0)// TODO: 可能和视线重合
        // let pMatFromLight3 = pMat3.mult(vMat3).mult(this.mMat)
        // this.pMatFromLight3 = pMatFromLight3
        //
        //
        //
        // let pMat4 = new Mat4().setPerspective(alpha, 1, 0.1, 100) // 注意far对齐
        // let vMat4 = new Mat4().setLookAt(...light.pos.getArray(),
        //                                  light.pos.x, light.pos.y, light.pos.z + 1,
        //                                  1, 1, 0)// TODO: 可能和视线重合
        // let pMatFromLight4 = pMat4.mult(vMat4).mult(this.mMat)
        // this.pMatFromLight4 = pMatFromLight4
        //
        // let pMat5 = new Mat4().setPerspective(alpha, 1, 0.1, 100) // 注意far对齐
        // let vMat5 = new Mat4().setLookAt(...light.pos.getArray(),
        //                                  light.pos.x, light.pos.y, light.pos.z - 1,
        //                                  1, 1, 0)// TODO: 可能和视线重合
        // let pMatFromLight5 = pMat5.mult(vMat5).mult(this.mMat)
        // this.pMatFromLight5 = pMatFromLight5
    }

    updateVMat() {
        this.vMat0 = new Mat4().setLookAt(...this.pos.getArray(),
                                         this.pos.x - 1, this.pos.y + 1, this.pos.z,
                                         1, 1, 0)
        this.vMat1 = new Mat4().setLookAt(...this.pos.getArray(),
                                         this.pos.x + 1, this.pos.y + 1, this.pos.z,
                                         -1, 1, 0)
        this.vMat2 = new Mat4().setLookAt(...this.pos.getArray(),
                                         this.pos.x + 1, this.pos.y - 1, this.pos.z,
                                         1, 1, 0)
        this.vMat3 = new Mat4().setLookAt(...this.pos.getArray(),
                                         this.pos.x - 1, this.pos.y - 1, this.pos.z,
                                         -1, 1, 0)
        this.vMat4 = new Mat4().setLookAt(...this.pos.getArray(),
                                         this.pos.x, this.pos.y, this.pos.z + 1,
                                         1, 1, 0)
        this.vMat5 = new Mat4().setLookAt(...this.pos.getArray(),
                                         this.pos.x, this.pos.y, this.pos.z - 1,
                                         1, 1, 0)
    }
}
