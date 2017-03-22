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

gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.5)

gl.drawArrays(gl.POINTS, 0, 1)
