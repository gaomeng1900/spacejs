import util from "../../webGL-util"
import Mat4 from "../../Mat4/Mat4"
import Vec3 from "../../Vec/Vec3"

import cube from "../obj/cube"

import vs from "./shader.vs"
import fs from "./shader.fs"

const gl = util.initWebGL(document.getElementById("canvas"))

const shaderProgram = util.makeShader(vs, fs, gl)

gl.useProgram(shaderProgram)

// 顶点
let verticesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
gl.bufferData(gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW)
let aPosition = gl.getAttribLocation(shaderProgram, "aPosition")
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aPosition)

// 法线
let normals_buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer)
gl.bufferData(gl.ARRAY_BUFFER, cube.normals, gl.STATIC_DRAW)
let aNormal = gl.getAttribLocation(shaderProgram, "aNormal")
gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aNormal)

// 颜色
let colors_buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, colors_buffer)
gl.bufferData(gl.ARRAY_BUFFER, cube.colors, gl.STATIC_DRAW)
let aColor = gl.getAttribLocation(shaderProgram, "aColor")
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(aColor)

// 面
let indices =cube.indices
let indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

// 环境光
const uAmbientLight = gl.getUniformLocation(shaderProgram, "uAmbientLight")
gl.uniform4f(uAmbientLight, 0.3, 0.3, 0.3, 1.0)

// 点光源
const uPointLightPos   = gl.getUniformLocation(shaderProgram, "uPointLightPos")
const uPointLightColor = gl.getUniformLocation(shaderProgram, "uPointLightColor")
gl.uniform3f(uPointLightPos, 2.0, 2.0, 2.0)
gl.uniform4f(uPointLightColor, 0.9, 0.9, 0.9, 1.0)

// 矩阵
const uModelMat = gl.getUniformLocation(shaderProgram, "uModelMat")
const uProjMat = gl.getUniformLocation(shaderProgram, "uProjMat")
const uNormalMat = gl.getUniformLocation(shaderProgram, "uNormalMat")

// 高光
const uViewPos = gl.getUniformLocation(shaderProgram, "uViewPos")

const uShininess = gl.getUniformLocation(shaderProgram, "uShininess")
gl.uniform1f(uShininess, 20.0)

let x = 0.0
let y = 0.0
let z = 3.5
let alpha = 0
let da = 1
let d = 0.05
function draw() {
    requestAnimationFrame(draw)
    alpha += da

    // 模型矩阵
    let modelMat = new Mat4().setRotate(alpha, 0, 0, 1)
                             .mult(new Mat4().setRotate(alpha, 0, 1, 0))
                            //  .mult(new Mat4().setTranslate(1, 0, 0))
    // 模型逆转置矩阵
    let normalMat = new Mat4().setInverseOf(modelMat).transpose()
    // 视图矩阵
    let viewMat  = new Mat4().setLookAt(x, y, z, 0, 0, 0, 0, 1, 0)
    gl.uniform3f(uViewPos, x, y, z)
    // 投影矩阵
    let projMat  = new Mat4().setPerspective(90, 1, 0.1, 20)

    gl.uniformMatrix4fv(uModelMat, false, modelMat.getArray())
    gl.uniformMatrix4fv(uProjMat, false, projMat.mult(viewMat).mult(modelMat).getArray())
    gl.uniformMatrix4fv(uNormalMat, false, normalMat.getArray())

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
}

draw()
