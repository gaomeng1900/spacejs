export default {
    initWebGL: (canvas, width=10, height=10, clearColor=[0,0,0,0]) => {

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
            gl.clearColor(...clearColor)
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

    bindArrayBuffer(gl, shaderProgram, name, data) {
        let a = gl.getAttribLocation(shaderProgram, name)
        if (a < 0 ) {
            console.error("无法定位 attribute")
            return
        }
        // 缓存 buffer
        let buffer
        if (shaderProgram._buffers[name]) {
            buffer = shaderProgram._buffers[name]
        } else {
            buffer = gl.createBuffer()
            shaderProgram._buffers[name] = buffer
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        gl.vertexAttribPointer(a, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(a)
    },

    bindElemArrayBuffer(gl, data, buffer) {
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

    uMat(gl, shaderProgram, name, data) {
        let u = gl.getUniformLocation(shaderProgram, name)
        if (u < 0 ) {
            console.error("无法定位 uniform")
            return
        }
        gl.uniformMatrix4fv(u, false, data)
    }
}
