import util from "../../webGL-util"
import Mat4 from "../../Mat4/Mat4"

import vs from "./shader.vs"
import fs from "./shader.fs"

const gl = util.initWebGL(document.getElementById("canvas"))

const shaderProgram = util.makeShader(vs, fs, gl)

gl.useProgram(shaderProgram)

// ** 传入带偏移的ArrayBugger
let vertices = new Float32Array([
    // x, y, s, t
    // .5,  .5,  1.0,  1.0,
    // .5,  -.5, 1.0,  -1.0,
    // -.5, -.5, -1.0, -1.0,
    // -.5, .5,  -1.0, 1.0,
    -0.5,  0.5,   0.5, 0.5,
    -0.5, -0.5,   0.0, 0.0,
     0.5,  0.5,   1.0, 1.0,
    //  0.5, -0.,   1.0, 0.0,
])
let verticesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

let a_Position = gl.getAttribLocation(shaderProgram, "a_Position")
let a_TexCoord = gl.getAttribLocation(shaderProgram, "a_TexCoord")

console.log(a_Position, a_TexCoord);

const FSIZE = vertices.BYTES_PER_ELEMENT
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4*FSIZE, 0)
gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 4*FSIZE, 2*FSIZE)
gl.enableVertexAttribArray(a_Position)
gl.enableVertexAttribArray(a_TexCoord)

// ** 传入纹理
let texture = gl.createTexture()
let u_Sampler = gl.getUniformLocation(shaderProgram, "u_Sampler")

console.log(u_Sampler);

import img_src from "./pattern.png"
console.log(img_src);
const img = new Image()
// console.log(img);
img.onload = () => {
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
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
    // 讲0号纹理传递给着色器
    gl.uniform1i(u_Sampler, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3)
}
img.src = img_src

// let t1 = new Mat4()._setLookAt(-1, -2, 3, 4, 5, -6, 1, 1, 1)
// console.log(t0);
// console.log(t1);
// console.log(t0.equalTo(t1));

// let t2 = new Mat4([
//     1,2,3,0,
//     1,2,3,0,
//     1,2,3,0,
//     0,0,0,1,
// ])
// let t3 = t2.translate(1, 2, 3)
// console.log(t3);
// let t4 = new Mat4().setTranslate(1,2,3)
// let t5 = t2.mult(t4)
// console.log(t5);

// function draw() {
//     // requestAnimationFrame(draw)
//     gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
//     gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
// }
//
// draw()
