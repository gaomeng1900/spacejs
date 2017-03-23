export default class Texture {
    constructor(src) {
        this.ready = false
        this.load(src)
        this.glTexture = null
    }

    load(src) {
        this.src = src
        this.img = new Image()
        this.img.onload = () => {
            this.ready = true
        }
        this.img.src = this.src
    }
}
