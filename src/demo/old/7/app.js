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
    0.1, 0.1, 0.1,
    0.1, 0.1, -0.1,
    0.1, -0.1, 0.1,
    0.1, -0.1, -0.1,
    -0.1, 0.1, 0.1,
    -0.1, 0.1, -0.1,
    -0.1, -0.1, 0.1,
    -0.1, -0.1, -0.1
])
let verticesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

let a_Position = gl.getAttribLocation(shaderProgram, "a_Position")

gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(a_Position)

// ** 传入视图矩阵
const u_ProjMat = gl.getUniformLocation(shaderProgram, "u_ProjMat")


let x = 0.0
let y = 0.25
let z = 0.35
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
    // let _viewMat = new Mat4()._setLookAt(x, y, z, 0, 0, 0, 0, 1, 0)
    let viewMat = new Mat4().setLookAt(x, y, z, 0, 0, 0, 0, 1, 0)
    // console.log("viewMat", viewMat.equalTo(_viewMat))
    // console.log("mine");
    // viewMat.print()
    // console.log("others");
    // _viewMat.print()

    // let _projMat = new Mat4()._setOrtho(-1, 1, -1, 1, -0.5, 1)
    // let projMat = new Mat4().setOrtho(-.5, .5, -.5, .5, 0.1, 1)
    let projMat = new Mat4().setPerspective(90, 1, 0.1, 1)
    // console.log("projMat", projMat.equalTo(_projMat))

    // let viewMat = new Mat4().setLookAt(0, 0, 0.25, 0, 0, 0, 0, 1, 0)
    // gl.uniformMatrix4fv(u_ProjMat, false, _projMat.mult(_viewMat).getArray())
    gl.uniformMatrix4fv(u_ProjMat, false, projMat.mult(viewMat).getArray())
    // gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 8)
}

draw()
