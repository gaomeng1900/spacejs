export default class Vec3 {
    constructor(x=0, y=0, z=0) {
        this.x = x
        this.y = y
        this.z = z
    }

    set(x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    }

    // 获取反向
    getOpp() {
        return new Vec3(-this.x, -this.y, -this.z)
    }
    // 取模
    getMod() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2))
    }
    // 判断是否零向量
    isZero() {
        return this.x === 0 && this.y === 0 && this.z === 0
    }

    add(vec) {
        return new Vec3(this.x + vec.x, this.y + vec.y, this.z + vec.z)
    }

    sub(vec) {
        return new Vec3(this.x - vec.x, this.y - vec.y, this.z - vec.z)
    }

    cross(vec) {
        let a = this
        let b = vec
        let x = a.y * b.z - b.y * a.z
        let y = b.x * a.z - a.x * b.z
        let z = a.x * b.y - b.x * a.y
        return new Vec3(x, y, z)
    }


    // 化为单位向量
    unit() {
        let mod = this.getMod();
        // console.log('mod', mod);
        if (mod === 0) {
            throw new Error('无法化为单位向量: ', JSON.stringify(this))
        }
        return this.mult(1/mod);
    }

    // 乘积
    product(n) {
        return new Vec3(this.x * n, this.y * n, this.z * n)
    }
    mult(n) {
        return this.product(n)
    }
}
