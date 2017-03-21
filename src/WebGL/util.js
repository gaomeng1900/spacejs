// !!! 全局只需要一套Buffer, 可以避免重复创建
const buffers = {}
const textures = {}

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
        let buffer
        if (buffers[name]) {
            buffer = buffers[name]
        } else {
            buffer = gl.createBuffer()
            buffers[name] = buffer
        }
        // if (shaderProgram._buffers[name]) {
        //     buffer = shaderProgram._buffers[name]
        // } else {
        //     buffer = gl.createBuffer()
        //     shaderProgram._buffers[name] = buffer
        // }
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
        // TODO:
        // !!!!这里需要一个texture缓存, 不然img decode消耗较大
        // // 缓存 buffer
        // let texture
        // if (textures[name]) {
        //     texture = textures[name]
        // } else {
        //     texture = gl.createTexture()
        //     textures[name] = texture
        // }
        // 开启y轴翻转
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
        // 开启0号纹理单元
        gl.activeTexture(gl.TEXTURE0)
        // 绑定纹理对象
        gl.bindTexture(gl.TEXTURE_2D, texture)
        // 配置纹理参数
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
        // 配置纹理图像
        gl.texImage2D(gl.TEXTURE_2D, // TODO: 开销略大
                      0,
                      gl.RGBA,
                      gl.RGBA,
                      gl.UNSIGNED_BYTE,
                      map.img
                    )
        // 讲0号纹理传递给着色器
        gl.uniform1i(s, 0)
    },

    bindTextureWithColor(gl, shaderProgram, name, color) {
        let s = gl.getUniformLocation(shaderProgram, name)
        if (s < 0 ) {
            console.error("无法定位 uniform")
            return
        }
        let texture
        if (textures[name]) {
            texture = textures[name]
        } else {
            texture = gl.createTexture()
            textures[name] = texture
        }
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
