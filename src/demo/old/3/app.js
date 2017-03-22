import util from "../../webGL-util"
import Mat4 from "../../Mat4/Mat4"

import vs from "./shader.vs"
import fs from "./shader.fs"

const gl = util.initWebGL(document.getElementById("canvas"))

const shaderProgram = util.makeShader(vs, fs, gl)

gl.useProgram(shaderProgram)

let n = 3
let vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    .0, -.7,
    .5, -.5,
])
// *** 传入ArrayBuffer
let vertexBuffer = gl.createBuffer()
// 先绑定后写入?
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW)

let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position')
if (a_Position < 0) { console.error("failed to get location") }
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(a_Position)

// ** 传入float
// let u_Width = gl.getUniformLocation(shaderProgram, "u_Width")
// let u_Height = gl.getUniformLocation(shaderProgram, "u_Height")
// console.log(u_Width, u_Height)
// gl.uiform1f(u_Width, 500.0)
// gl.uiform1f(u_Height, 500.0)

// *** 传入mat4

let angle = 0

function draw() {
    requestAnimationFrame(draw)

    angle += 1
    let transMat = new Mat4().setTranslate(.1, .1, 0)
    let rotateMat = new Mat4().setRotate(angle, 0, 0, 1)
    let modelMatrix = rotateMat.mult(transMat)
    let u_ModelMatrix = gl.getUniformLocation(shaderProgram, "u_ModelMatrix")
    if (u_ModelMatrix < 0) { console.error("failed to get location") }
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.transpose().getArray())
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
}

draw()
