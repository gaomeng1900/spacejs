import uuid from "uuid"

// !!! 全局只需要一套Buffer, 可以避免重复创建
const buffers = {}
let COLOR_TEXTURE
const texUnit = []

export default {
    initWebGL: (canvas, width, height, clearColor) => {

        // 初始化 WebGL 上下文
        // 创建全局变量
        let gl = null

        try {
            // 尝试获取标准上下文，如果失败，回退到试验性上下文
            gl = canvas.getContext("webgl", {antialias:true}) || canvas.getContext("experimental-webgl", {antialias:true})
        }
        catch(e) {}

        // 如果没有GL上下文，马上放弃
        if (!gl) {
            alert("WebGL初始化失败，可能是因为您的浏览器不支持。");
            gl = null
        }

        // 只有在 WebGL 可用的时候才继续
        if (gl) {
            // 设置分辨率
            gl.viewport(0, 0, width, height)
            // 设置清除颜色为黑色，不透明
            gl.clearColor(...clearColor.getArray())
            // 开启“深度测试”, Z-缓存
            gl.enable(gl.DEPTH_TEST)
            // 设置深度测试，近的物体遮挡远的物体
            // gl.depthFunc(gl.LESS)
            // 清除颜色和深度缓存
            gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
        }

        // NOTE: 启用这个插件,
        // 来让 draw elements 支持 UNSIGNED_INT, 传Uint32入Array
        gl.getExtension("OES_element_index_uint")

        return gl
    },

    makeShader: (vs, fx, gl) => {
        let vertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertexShader, vs)
        gl.compileShader(vertexShader)

        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragmentShader, fx)
        gl.compileShader(fragmentShader)

        let shaderProgram = gl.createProgram()
        gl.attachShader(shaderProgram, vertexShader)
        gl.attachShader(shaderProgram, fragmentShader)
        gl.linkProgram(shaderProgram)

        return shaderProgram
    },

    bindArrayBuffer(gl, shaderProgram, name, data, n=3) {
        let a = gl.getAttribLocation(shaderProgram, name)
        if (a < 0 ) {
            console.error("无法定位 attribute")
            return
        }
        // 缓存 buffer
        if (! buffers[name]) {
            buffers[name] = gl.createBuffer()
        }
        let buffer = buffers[name]
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        gl.vertexAttribPointer(a, n, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(a)
    },

    bindElemArrayBuffer(gl, data) {
        let buffer
        if (buffers["ELEMENT_ARRAY_BUFFER"]) {
            buffer = buffers["ELEMENT_ARRAY_BUFFER"]
        } else {
            buffer = gl.createBuffer()
            buffers["ELEMENT_ARRAY_BUFFER"] = buffer
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)
    },

    unf(gl, shaderProgram, name, ...data) {
        let u = gl.getUniformLocation(shaderProgram, name)
        if (u < 0 ) {
            console.error("无法定位 uniform")
            return
        }
        let n = data.length
        gl["uniform"+n+"f"](u, ...data)
    },

    anf(gl, shaderProgram, name, ...data) {
        let a = gl.getAttribLocation(shaderProgram, name)
        if (a < 0 ) {
            console.error("无法定位 attribute")
            return
        }
        let n = data.length
        gl["vertexAttrib"+n+"f"](a, ...data)
    },

    bindTexture(gl, shaderProgram, name, map) {
        let s = gl.getUniformLocation(shaderProgram, name)
        if (s < 0 ) {
            console.error("无法定位 uniform")
            return
        }
        // 缓存 buffer
        let texture
        if (!map.glTexture) {
            map.glTexture = gl.createTexture()
        }
        texture = map.glTexture

        if (! texUnit.includes(map.uuid)) { // NOTE:可能需要Polyfill
            // TODO: uuid放到material里面显然更好
            // NOTE: 这里的缓存机制, 超过七个纹理时只对最后一个单元操作
            // 这里需要一个更合理的缓存机制, 比方说计数来决定谁留在单元里
            map.uuid = uuid()
            if (texUnit.length > 7) {
                texUnit.pop() // 缓存7个
            }
            texUnit.push(map.uuid)
            map.unitNum = texUnit.length

            // 开启y轴翻转
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
            // 开启0号纹理单元
            gl.activeTexture(gl["TEXTURE" + map.unitNum])
            // 绑定纹理对象
            gl.bindTexture(gl.TEXTURE_2D, texture)
            // 配置纹理参数
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            // 配置纹理图像
            gl.texImage2D(gl.TEXTURE_2D, // TODO: 开销略大
                          0,
                          gl.RGBA,
                          gl.RGBA,
                          gl.UNSIGNED_BYTE,
                          map.img
                        )
        }
        gl.uniform1i(s, map.unitNum)
    },

    bindTextureWithColor(gl, shaderProgram, name, color) {
        let s = gl.getUniformLocation(shaderProgram, name)
        if (s < 0 ) {
            console.error("无法定位 uniform")
            return
        }
        // 缓存 buffer
        if (!COLOR_TEXTURE) {
            COLOR_TEXTURE = gl.createTexture()
        }
        let texture = COLOR_TEXTURE
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D,
                      0,
                      gl.RGBA,
                      1, 1, 0,
                      gl.RGBA,
                      gl.UNSIGNED_BYTE,
                      color.getArrayInt()
                  )
        gl.uniform1i(s, 0)
    },

    uMat(gl, shaderProgram, name, data) {
        let u = gl.getUniformLocation(shaderProgram, name)
        if (u < 0 ) {
            console.error("无法定位 uniform")
            return
        }
        gl.uniformMatrix4fv(u, false, data)
    }
}
