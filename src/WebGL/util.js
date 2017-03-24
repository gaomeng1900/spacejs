import uuid from "uuid"

// !!! 全局只需要一套Buffer, 可以避免重复创建
const buffers = {}
let COLOR_TEXTURE // 专门给一像素的颜色贴图使用 纹理对象
const texUnit = [] // 纹理单元缓存
let MAX_TEX_UNIT = 0 // 当前环境最大纹理单元数量
// let texture // used in bindTextureWithUnit()
// window.texture

window.buffers = buffers
window.texUnit = texUnit

let framebuffer
let depthBuffer

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
            // NOTE: 启用这个插件,
            // 来让 draw elements 支持 UNSIGNED_INT, 传Uint32入Array
            gl.getExtension("OES_element_index_uint")
            // 获取纹理单元数量, 用来优化缓存
            MAX_TEX_UNIT = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
            console.log("纹理单元数量: ", MAX_TEX_UNIT);
        }


        return gl
    },

    // TODO: 可以直接把uniform和attr挂在program上
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

    // TODO: 使用之后把buffer绑定为null
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

    // 放到 1-7号纹理单元
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
            // NOTE: 这里的缓存机制, 超过七个纹理时只对最后一个单元操作
            // TODO: 这里需要一个更合理的缓存机制, 比方说计数来决定谁留在单元里
            // NOTE: chrome竟然有80个纹理单元!!!
            map.uuid = uuid()
            if (texUnit.length > MAX_TEX_UNIT) {
                texUnit.pop() // 缓存MAX_TEX_UNIT个
            }
            texUnit.push(map.uuid)
            map.unitNum = texUnit.length

            // 开启y轴翻转
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1)
            // 开启unitNum号纹理单元
            gl.activeTexture(gl["TEXTURE" + map.unitNum])
            // 绑定纹理对象
            gl.bindTexture(gl.TEXTURE_2D, texture)
            // 配置纹理参数
            // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
            // 配置纹理图像
            gl.texImage2D(gl.TEXTURE_2D,
                          0,
                          gl.RGBA,
                          gl.RGBA,
                          gl.UNSIGNED_BYTE,
                          map.img
                        )
        } else {
            // NOTE: 每次都要运行着两个, TODO: WHY
            gl.activeTexture(gl["TEXTURE" + map.unitNum])
            // TODO: 似乎全局一个texture 一个Buffer就可以了
            // NOTE: 并不能并不能并不能!!!!!!
            gl.bindTexture(gl.TEXTURE_2D, texture)
        }
        gl.uniform1i(s, map.unitNum)
        // NOTE:这里不能放，不然一号纹理单元会空
        // TODO:WHY
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        // gl.bindTexture(gl.TEXTURE_2D, null);
    },

    bindTextureWithUnit(gl, shaderProgram, name, unitNum, texture) {
        let s = gl.getUniformLocation(shaderProgram, name)
        if (s < 0 ) {
            console.error("无法定位 uniform")
            return
        }
        // if (!window.texture) {
        //     window.texture = gl.createTexture()
        // }

        gl.activeTexture(gl["TEXTURE" + unitNum])
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.uniform1i(s, unitNum)
    },

    // 放到 0号纹理单元
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
    },

    initFramebufferObject(gl, texture, width, height) {
        framebuffer || (framebuffer = gl.createFramebuffer())
        // texture = this.gl.createTexture()
        depthBuffer || (depthBuffer = gl.createRenderbuffer())
        // var framebuffer, texture, depthBuffer;

        // Define the error handling function
        var error = function() {
            if (framebuffer) gl.deleteFramebuffer(framebuffer);
            if (texture) gl.deleteTexture(texture);
            if (depthBuffer) gl.deleteRenderbuffer(depthBuffer);
            return null;
        }

        // Create a frame buffer object (FBO)
        // framebuffer = gl.createFramebuffer();
        if (!framebuffer) {
            console.log('Failed to create frame buffer object');
            return error();
        }

        // Create a texture object and set its size and parameters
        // texture = gl.createTexture(); // Create a texture object
        if (!texture) {
            console.log('Failed to create texture object');
            return error();
        }
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        // Create a renderbuffer object and Set its size and parameters
        // depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
        if (!depthBuffer) {
            console.log('Failed to create renderbuffer object');
            return error();
        }
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

        // Attach the texture and the renderbuffer object to the FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

        // Check if FBO is configured correctly
        // var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        // if (gl.FRAMEBUFFER_COMPLETE !== e) {
        //     console.log('Frame buffer object is incomplete: ' + e.toString());
        //     return error();
        // }

        framebuffer.texture = texture; // keep the required object

        // Unbind the buffer object
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return framebuffer;
    },
}
