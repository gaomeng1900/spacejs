import util from "../../webGL-util"

import vs from "./shader.vs"
import fs from "./shader.fs"

const gl = util.initWebGL(document.getElementById("canvas"))

const shaderProgram = util.makeShader(vs, fs, gl)

gl.useProgram(shaderProgram)

let a_Position = gl.getAttribLocation(shaderProgram, 'a_Position')

console.log(a_Position);

if (a_Position < 0) {
    console.error("failed to get location");
}

let n = 3
let vertices = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    .0, -.7,
    .5, -.5,
])
let vertexBuffer = gl.createBuffer()
// 先绑定后写入?
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(a_Position)

// gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.5)

gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
