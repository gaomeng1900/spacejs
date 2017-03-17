/**
 * 矩阵库 :P
 * author: Simon/Meng gaomeng1900@gmail.com
 */

import Vec3 from "../Vec/Vec3"

/**
 * a1 a2 a3 a4
 * b1 b2 b3 b4
 * c1 c2 c3 c4
 * d1 d2 d3 d4
 *
 * 构造函数接受行优先矩阵, 然后转置为列优先,
 * 数组里保存的一直是列优先矩阵
 */

export default class Mat4 {
    constructor(elems) {
        this.elements = elems || [0,0,0,0,
                                  0,0,0,0,
                                  0,0,0,0,
                                  0,0,0,0,]
        this._count_transpose = 0
        this.transpose()
    }

    // 获取Float32Array
    getArray() {
        return new Float32Array(this.elements)
    }

    equalTo(mat4) {
        // TODO: 类型检查
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i] !== mat4.elements[i]) {
                return false
            }
        }
        return true
    }

    // 转置
    transpose() {
        this._count_transpose ++
        let m = this.elements
        this.elements = [
            m[0], m[4], m[8],  m[12],
            m[1], m[5], m[9],  m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15],
        ]
        return this
    }

    // 行优先 友好打印
    print() {
        this.transpose()
        console.log("START===========")
        console.log(this.elements.slice(0,4))
        console.log(this.elements.slice(4,8))
        console.log(this.elements.slice(8,12))
        console.log(this.elements.slice(12,16))
        console.log("END=============")
        this.transpose()
    }

    // 单位矩阵
    setIdentity() {
        this.elements = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1,
        ]
        return this
    }

    // 平移矩阵
    setTranslate(x, y, z) {
        this.elements = [
            1,0,0,x,
            0,1,0,y,
            0,0,1,z,
            0,0,0,1,
        ]
        // 直接修改elements的话不会运行构造函数里的自动转置
        this.transpose()
        return this
    }

    // 缩放矩阵
    setScale(x, y, z) {
        this.elements = [
            x,0,0,0,
            0,y,0,0,
            0,0,z,0,
            0,0,0,1,
        ]
        return this
    }

    // 齐次三维旋转矩阵
    // 并看不懂
    // https://github.com/yukoba/WebGLBook/blob/master/lib/cuon-matrix.js
    // ** 复制来的代码都是列优先的
    setRotate(angle, x, y, z) {
        angle = Math.PI * angle / 180;
        let e = this.elements;

        let s = Math.sin(angle);
        let c = Math.cos(angle);

        if (0 !== x && 0 === y && 0 === z) {
            if (x < 0) {
                s = -s;
            }
            e[0] = 1;  e[4] = 0;  e[ 8] = 0;  e[12] = 0;
            e[1] = 0;  e[5] = c;  e[ 9] =-s;  e[13] = 0;
            e[2] = 0;  e[6] = s;  e[10] = c;  e[14] = 0;
            e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        } else if (0 === x && 0 !== y && 0 === z) {
            if (y < 0) {
                s = -s;
            }
            e[0] = c;  e[4] = 0;  e[ 8] = s;  e[12] = 0;
            e[1] = 0;  e[5] = 1;  e[ 9] = 0;  e[13] = 0;
            e[2] =-s;  e[6] = 0;  e[10] = c;  e[14] = 0;
            e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        } else if (0 === x && 0 === y && 0 !== z) {
            if (z < 0) {
                s = -s;
            }
            e[0] = c;  e[4] =-s;  e[ 8] = 0;  e[12] = 0;
            e[1] = s;  e[5] = c;  e[ 9] = 0;  e[13] = 0;
            e[2] = 0;  e[6] = 0;  e[10] = 1;  e[14] = 0;
            e[3] = 0;  e[7] = 0;  e[11] = 0;  e[15] = 1;
        } else {
            let len = Math.sqrt(x*x + y*y + z*z);
            if (len !== 1) {
                let rlen = 1 / len;
                x *= rlen;
                y *= rlen;
                z *= rlen;
            }
            let nc = 1 - c;
            let xy = x * y;
            let yz = y * z;
            let zx = z * x;
            let xs = x * s;
            let ys = y * s;
            let zs = z * s;

            e[ 0] = x*x*nc +  c;
            e[ 1] = xy *nc + zs;
            e[ 2] = zx *nc - ys;
            e[ 3] = 0;

            e[ 4] = xy *nc - zs;
            e[ 5] = y*y*nc +  c;
            e[ 6] = yz *nc + xs;
            e[ 7] = 0;

            e[ 8] = zx *nc + ys;
            e[ 9] = yz *nc - xs;
            e[10] = z*z*nc +  c;
            e[11] = 0;

            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1;
        }

        return this
    }

    mult(other) {
        // 缓存
        let e = this.elements
        let a = this.elements
        let b = other.elements
        let i // 小心命名域锁定

        // 自乘的时候, 避免引用混乱, 需要复制一份
        if (e === b) {
            b = new Float32Array(16)
            for (i = 0; i < 16; ++i) {
                b[i] = e[i]
            }
        }

        for (i = 0; i < 4; i++) {
            let ai0=a[i]
            let ai1=a[i+4]
            let ai2=a[i+8]
            let ai3=a[i+12]
            e[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3]
            e[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7]
            e[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11]
            e[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15]
        }

        return this
    }

    // 生成视图矩阵
    // 先反向平移, 再反向旋转
    // 难点: 如何根据up向量计算旋转角
    // 万恶的旋转矩阵
    // http://www.360doc.com/content/14/1028/10/19175681_420515511.shtml
    // http://www.voidcn.com/blog/ziyuanxiazai123/article/p-471812.html
    setLookAt(eyeX, eyeY, eyeZ, centerX, centerY, centerZ, upX, upY, upZ) {
        const eye    = new Vec3(eyeX, eyeY, eyeZ)
        const center = new Vec3(centerX, centerY, centerZ)
        const up     = new Vec3(upX, upY, upZ)
        // 反向平移矩阵
        let translateRev = new Mat4().setTranslate(-eyeX, -eyeY, -eyeZ)
        // -Z轴(视线方向)
        let ZRev = center.sub(eye)
        let Z = ZRev.getOpp().unit()
        // console.log(Z);
        // X轴
        let X = Z.cross(up).getOpp().unit()
        // console.log(X);
        // Y轴
        let Y = Z.cross(X).unit()
        // console.log(Y);

        // TODO: 检查不能有任何一个轴为0
        //       即: eye&center不能重合, 视线不能与up重合

        // 注意这里的XYZ已经时右手系了, 如果不是的话需要翻转Y
        let rotateMatrix = new Mat4([
            X.x, Y.x, Z.x, 0,
            X.y, Y.y, Z.y, 0,
            X.z, Y.z, Z.z, 0,
            0,   0,   0,   1,
        ])
        // 求逆(正交矩阵inverse(A) = transpose(A))
        let rotateMatrixRev = rotateMatrix.transpose()

        this.elements = rotateMatrixRev.mult(translateRev).getArray()
        return this
    }

    // 正射投影矩阵
    // ortho: 正,正交
    setOrtho(left, right, bottom, top, near, far) {
        let wR = 1/(right - left)
        let hR = 1/(top - bottom)
        let dR = 1/(far - near)
        this.elements = [
            2*wR, 0, 0, -(right+left)*wR,
            0, 2*hR, 0, -(top+bottom)*hR,
            0, 0, -2*dR, -(far+near)*dR, // dR是负的
            0, 0, 0, 1,
        ]
        this.transpose()
        return this
    }

    /**
     * 透视投影
     * @method setPerspective
     * @param  {Number}  fov    上下视角
     * @param  {Number}  aspect 宽高比
     * @param  {Number}  near
     * @param  {Number}  far
     */
    setPerspective(fov, aspect, near, far) {
        let a = Math.tan(Math.PI*fov/180/2)
        this.elements = [
            1/(aspect*a), 0, 0, 0,
            0, 1/a, 0, 0,
            0, 0, -(far+near)/(far-near), -(2*far*near)/(far-near),
            0, 0, -1, 0,
        ]
        this.transpose()
        return this
    }

    setInverseOf(other) {
        var i, s, d, inv, det;

        s = other.elements;
        d = this.elements;
        inv = new Float32Array(16);

        inv[0]  =   s[5]*s[10]*s[15] - s[5] *s[11]*s[14] - s[9] *s[6]*s[15]
            + s[9]*s[7] *s[14] + s[13]*s[6] *s[11] - s[13]*s[7]*s[10];
        inv[4]  = - s[4]*s[10]*s[15] + s[4] *s[11]*s[14] + s[8] *s[6]*s[15]
            - s[8]*s[7] *s[14] - s[12]*s[6] *s[11] + s[12]*s[7]*s[10];
        inv[8]  =   s[4]*s[9] *s[15] - s[4] *s[11]*s[13] - s[8] *s[5]*s[15]
            + s[8]*s[7] *s[13] + s[12]*s[5] *s[11] - s[12]*s[7]*s[9];
        inv[12] = - s[4]*s[9] *s[14] + s[4] *s[10]*s[13] + s[8] *s[5]*s[14]
            - s[8]*s[6] *s[13] - s[12]*s[5] *s[10] + s[12]*s[6]*s[9];

        inv[1]  = - s[1]*s[10]*s[15] + s[1] *s[11]*s[14] + s[9] *s[2]*s[15]
            - s[9]*s[3] *s[14] - s[13]*s[2] *s[11] + s[13]*s[3]*s[10];
        inv[5]  =   s[0]*s[10]*s[15] - s[0] *s[11]*s[14] - s[8] *s[2]*s[15]
            + s[8]*s[3] *s[14] + s[12]*s[2] *s[11] - s[12]*s[3]*s[10];
        inv[9]  = - s[0]*s[9] *s[15] + s[0] *s[11]*s[13] + s[8] *s[1]*s[15]
            - s[8]*s[3] *s[13] - s[12]*s[1] *s[11] + s[12]*s[3]*s[9];
        inv[13] =   s[0]*s[9] *s[14] - s[0] *s[10]*s[13] - s[8] *s[1]*s[14]
            + s[8]*s[2] *s[13] + s[12]*s[1] *s[10] - s[12]*s[2]*s[9];

        inv[2]  =   s[1]*s[6]*s[15] - s[1] *s[7]*s[14] - s[5] *s[2]*s[15]
            + s[5]*s[3]*s[14] + s[13]*s[2]*s[7]  - s[13]*s[3]*s[6];
        inv[6]  = - s[0]*s[6]*s[15] + s[0] *s[7]*s[14] + s[4] *s[2]*s[15]
            - s[4]*s[3]*s[14] - s[12]*s[2]*s[7]  + s[12]*s[3]*s[6];
        inv[10] =   s[0]*s[5]*s[15] - s[0] *s[7]*s[13] - s[4] *s[1]*s[15]
            + s[4]*s[3]*s[13] + s[12]*s[1]*s[7]  - s[12]*s[3]*s[5];
        inv[14] = - s[0]*s[5]*s[14] + s[0] *s[6]*s[13] + s[4] *s[1]*s[14]
            - s[4]*s[2]*s[13] - s[12]*s[1]*s[6]  + s[12]*s[2]*s[5];

        inv[3]  = - s[1]*s[6]*s[11] + s[1]*s[7]*s[10] + s[5]*s[2]*s[11]
            - s[5]*s[3]*s[10] - s[9]*s[2]*s[7]  + s[9]*s[3]*s[6];
        inv[7]  =   s[0]*s[6]*s[11] - s[0]*s[7]*s[10] - s[4]*s[2]*s[11]
            + s[4]*s[3]*s[10] + s[8]*s[2]*s[7]  - s[8]*s[3]*s[6];
        inv[11] = - s[0]*s[5]*s[11] + s[0]*s[7]*s[9]  + s[4]*s[1]*s[11]
            - s[4]*s[3]*s[9]  - s[8]*s[1]*s[7]  + s[8]*s[3]*s[5];
        inv[15] =   s[0]*s[5]*s[10] - s[0]*s[6]*s[9]  - s[4]*s[1]*s[10]
            + s[4]*s[2]*s[9]  + s[8]*s[1]*s[6]  - s[8]*s[2]*s[5];

        det = s[0]*inv[0] + s[1]*inv[4] + s[2]*inv[8] + s[3]*inv[12];
        if (det === 0) {
            return this;
        }

        det = 1 / det;
        for (i = 0; i < 16; i++) {
            d[i] = inv[i] * det;
        }

        return this;
    }
}
