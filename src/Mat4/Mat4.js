/**
 * 矩阵库 :P
 * author: Simon/Meng gaomeng1900@gmail.com
 */


/**
 * a1 a2 a3 a4
 * b1 b2 b3 b4
 * c1 c2 c3 c4
 * d1 d2 d3 d4
 *
 *
 */

export default class Mat4 {
    constructor(elems) {
        this.elements = elems || [0,0,0,0,
                                  0,0,0,0,
                                  0,0,0,0,
                                  0,0,0,0,]
        this._count_transpose = 0
    }

    getArray() {
        if (this._count_transpose < 1 || this._count_transpose%2 === 0) {
            console.warn("你可能忘了转置为*列优先*!");
        }
        return new Float32Array(this.elements)
    }

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

    print() {
        console.log("START===========");
        console.log(this.elements.slice(0,4))
        console.log(this.elements.slice(4,8))
        console.log(this.elements.slice(8,12))
        console.log(this.elements.slice(12,16))
        console.log("END=============");
    }

    setIdentity() {
        this.elements = [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1.
        ]
        return this
    }

    setTranslate(x, y, z) {
        this.elements = [
            1,0,0,x,
            0,1,0,y,
            0,0,1,z,
            0,0,0,1,
        ]
        return this
    }

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
        let i

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
}
