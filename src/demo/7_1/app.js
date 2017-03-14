import util from "../../webGL-util"
import Mat4 from "../../Mat4/Mat4"

import vs from "./shader.vs"
import fs from "./shader.fs"

const gl = util.initWebGL(document.getElementById("canvas"))

const shaderProgram = util.makeShader(vs, fs, gl)

gl.useProgram(shaderProgram)

// ** 传入带偏移的ArrayBuffer
let vertices = new Float32Array([
    // x, y, s, t
    0.1, 0.1, 0.1, // 0
    0.1, 0.1, -0.1, // 1
    0.1, -0.1, 0.1, // 2
    0.1, -0.1, -0.1, // 3
    -0.1, 0.1, 0.1, // 4
    -0.1, 0.1, -0.1, // 5
    -0.1, -0.1, 0.1, // 6
    -0.1, -0.1, -0.1 // 7
])
let verticesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

let indices = new Uint8Array([
    0, 1, 2, 1, 2, 3,
    0, 4, 5, 0, 5, 1,
    4, 5, 6, 6, 5, 7,
    7, 6, 2, 7, 2, 3,
    0, 4, 6, 0, 6, 2,
    1, 5, 7, 1, 7, 3,
])
let indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)
// 这个是不用传入的

let a_Position = gl.getAttribLocation(shaderProgram, "a_Position")
gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(a_Position)

// ** 传入视图矩阵
const u_ProjMat = gl.getUniformLocation(shaderProgram, "u_ProjMat")


let x = 0.0
let y = 0.25
let z = 0.35
let alpha = 10
let da = 1
let d = 0.01
function draw() {
    requestAnimationFrame(draw)
    x += d
    if (x >= 0.3) {
        d = -d
    }
    if (x <= -0.3) {
        d = -d
    }
    alpha += da

    // 模型矩阵
    let modelMat = new Mat4().setRotate(alpha, 0, 0, 1)
    // 视图矩阵
    let viewMat  = new Mat4().setLookAt(x, y, z, 0, 0, 0, 0, 1, 0)
    // 投影矩阵
    let projMat  = new Mat4().setPerspective(90, 1, 0.1, 1)

    gl.uniformMatrix4fv(u_ProjMat, false, projMat.mult(viewMat).mult(modelMat).getArray())

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
}

draw()
