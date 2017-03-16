import util from "../../webGL-util"
import Mat4 from "../../Mat4/Mat4"
import Vec3 from "../../Vec/Vec3"

import cube from "../obj/cube"

import vs from "./shader.vs"
import fs from "./shader.fs"

const gl = util.initWebGL(document.getElementById("canvas"))

const shaderProgram = util.makeShader(vs, fs, gl)

gl.useProgram(shaderProgram)

let verticesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
gl.bufferData(gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW)
let aPosition = gl.getAttribLocation(shaderProgram, "aPosition")
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aPosition)

let normals_buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer)
gl.bufferData(gl.ARRAY_BUFFER, cube.normals, gl.STATIC_DRAW)
let aNormal = gl.getAttribLocation(shaderProgram, "aNormal")
gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aNormal)

let colors_buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colors_buffer)
gl.bufferData(gl.ARRAY_BUFFER, cube.colors, gl.STATIC_DRAW)
let aColor = gl.getAttribLocation(shaderProgram, "aColor")
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aColor)

let indices =cube.indices
let indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

const lightDirection = new Vec3(-1.0, -1.0, -1.0).unit().getOpp()
const uLightDirection = gl.getUniformLocation(shaderProgram, "uLightDirection")
gl.uniform3f(uLightDirection, lightDirection.x, lightDirection.y, lightDirection.z)

const lightColor = new Vec3(1.0, 0.0, 0.0)
const uLightColor = gl.getUniformLocation(shaderProgram, "uLightColor")
gl.uniform4f(uLightColor, lightColor.x, lightColor.y, lightColor.z, 1.0)

const uProjMat = gl.getUniformLocation(shaderProgram, "uProjMat")
const uNormalMat = gl.getUniformLocation(shaderProgram, "uNormalMat")

let x = 0.0
let y = 0.0
let z = 3.5
let alpha = 10
let da = 1
let d = 0.05
function draw() {
    requestAnimationFrame(draw)
    x += d
    if (x >= 3) {
        d = -d
    }
    if (x <= -3) {
        d = -d
    }
    alpha += da

    // 模型矩阵
    let modelMat = new Mat4().setRotate(alpha, 0, 0, 1)
    // 模型逆转置矩阵
    let normalMat = new Mat4().setInverseOf(modelMat).transpose()
    // 视图矩阵
    let viewMat  = new Mat4().setLookAt(x, y, z, 0, 0, 0, 0, 1, 0)
    // 投影矩阵
    let projMat  = new Mat4().setPerspective(90, 1, 0.1, 10)

    gl.uniformMatrix4fv(uProjMat, false, projMat.mult(viewMat).mult(modelMat).getArray())
    gl.uniformMatrix4fv(uNormalMat, false, normalMat.getArray())

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
}

draw()
