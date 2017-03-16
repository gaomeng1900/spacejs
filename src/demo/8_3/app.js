import util from "../../webGL-util"
import Mat4 from "../../Mat4/Mat4"
import Vec3 from "../../Vec/Vec3"

import cube from "../obj/cube"

import vs from "./s.vs"
import fs from "./s.fs"

const gl = util.initWebGL(document.getElementById("canvas"))

const shaderProgram = util.makeShader(vs, fs, gl)

gl.useProgram(shaderProgram)

// 顶点
let verticesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer)
gl.bufferData(gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW)
let inputPosition = gl.getAttribLocation(shaderProgram, "inputPosition")
console.log(inputPosition);
gl.vertexAttribPointer(inputPosition, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(inputPosition)

// 法线
let normals_buffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer)
gl.bufferData(gl.ARRAY_BUFFER, cube.normals, gl.STATIC_DRAW)
let inputNormal = gl.getAttribLocation(shaderProgram, "inputNormal")
gl.vertexAttribPointer(inputNormal, 3, gl.FLOAT, false, 0, 0)
gl.enableVertexAttribArray(inputNormal)

// 颜色
// let colors_buffer = gl.createBuffer()
// gl.bindBuffer(gl.ARRAY_BUFFER, colors_buffer)
// gl.bufferData(gl.ARRAY_BUFFER, cube.colors, gl.STATIC_DRAW)
// let aColor = gl.getAttribLocation(shaderProgram, "aColor")
// gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0)
// gl.enableVertexAttribArray(aColor)

// 面
let indices =cube.indices
let indexBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

// 环境光
const uAmbientLight = gl.getUniformLocation(shaderProgram, "uAmbientLight")
// gl.uniform4f(uAmbientLight, 0.2, 0.2, 0.2, 1.0)

// 点光源
const lightPos   = gl.getUniformLocation(shaderProgram, "lightPos")
const specularColor = gl.getUniformLocation(shaderProgram, "specularColor")
gl.uniform3f(lightPos, 2.0, 2.0, 2.0)
gl.uniform3f(specularColor, 0.9, 0.9, 0.9)

// 矩阵
const modelview = gl.getUniformLocation(shaderProgram, "modelview")
const projection = gl.getUniformLocation(shaderProgram, "projection")
const normalMat = gl.getUniformLocation(shaderProgram, "normalMat")

// 高光
const uViewpos = gl.getUniformLocation(shaderProgram, "uViewpos")
const shininessVal = gl.getUniformLocation(shaderProgram, "shininessVal")
console.log(shininessVal);
gl.uniform1f(shininessVal, 100.0)

let x = 0.0
let y = 2.0
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
    let _normalMat = new Mat4().setInverseOf(modelMat).transpose()
    // 视图矩阵
    let viewMat  = new Mat4().setLookAt(x, y, z, 0, 0, 0, 0, 1, 0)
    // gl.uniform3f(uViewpos, x, y, z)
    // 投影矩阵
    let projMat  = new Mat4().setPerspective(90, 1, 0.1, 20)

    gl.uniformMatrix4fv(projection, false, projMat.mult(viewMat).mult(modelMat).getArray())
    gl.uniformMatrix4fv(modelview, false, viewMat.mult(modelMat).getArray())
    gl.uniformMatrix4fv(normalMat, false, _normalMat.getArray())

    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
}

draw()
