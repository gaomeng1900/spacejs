import util from "../../webGL-util"
import Mat4 from "../../Mat4/Mat4"

import vs from "./shader.vs"
import fs from "./shader.fs"

const gl = util.initWebGL(document.getElementById("canvas"))

const shaderProgram = util.makeShader(vs, fs, gl)

gl.useProgram(shaderProgram)

// ** 传入带偏移的ArrayBugger
let vertices = new Float32Array([
    // x, y, size, color
    0.0, 0.5, 10.0, 1.0,
    -0.5, -0.5, 20.0, 0.5,
    .0, -.7, 30.0, 0.2,
    .5, -.5, 40.0, 0.7,
])
let verticesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW)


let a_Position = gl.getAttribLocation(shaderProgram, "a_Position")
let a_Size = gl.getAttribLocation(shaderProgram, "a_Size")
let a_Color = gl.getAttribLocation(shaderProgram, "a_Color")

const FSIZE = vertices.BYTES_PER_ELEMENT
gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 4*FSIZE, 0)
gl.vertexAttribPointer(a_Size, 1, gl.FLOAT, false, 4*FSIZE, 2*FSIZE)
gl.vertexAttribPointer(a_Color, 1, gl.FLOAT, false, 4*FSIZE, 3*FSIZE)
gl.enableVertexAttribArray(a_Position)
gl.enableVertexAttribArray(a_Size)
gl.enableVertexAttribArray(a_Color)

function draw() {
    // requestAnimationFrame(draw)
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
}

draw()
