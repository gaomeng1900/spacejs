import "./index.scss"

import "./demo/6_1/app"

import Mat4 from "./Mat4/Mat4"

// let m = new Mat4([
//     1,2,3,4,
//     5,6,7,8,
//     9,10,11,12,
//     13,14,15,16
// ])
// console.log(m.getArray());
// m.transpose()
// console.log(m.getArray());

// m.print()
//
// m.transpose()
// m.print()
//
// m.setRotate(10, 0, 0, 1)
// m.print()

// import util from "./webGL-util"
//
// import vs from "./shader/shader0.vs"
// import fs from "./shader/shader0.fs"
//
// const gl = util.initWebGL(document.getElementById("canvas"))
//
// const shaderProgram = util.makeShader(vs, fs, gl)
//
// gl.useProgram(shaderProgram)
//
// gl.drawArrays(gl.POINTS, 0, 1)

// const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
// console.log(vertexPositionAttribute);
// gl.enableVertexAttribArray(vertexPositionAttribute);

// import * as THREE from "three"
// import fac from "three-orbit-controls"
// const OrbitControls = fac(THREE)
// // 1. 初始化渲染器
// const renderer = new THREE.WebGLRenderer({antialias:true})
// renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setClearColor(0x000000, 1.0)
// document.body.appendChild( renderer.domElement );
//
// // 2.初始化相机
// // fov, aspect, near, far
// const cam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000)
// cam.position.set(0, 0, 500)
// const virtualCenter = new THREE.Vector3(0, 0, 0)
// cam.lookAt(virtualCenter)
// cam.up.set(0, 0, 1)
//
// // 3.初始化scene
// const scene = new THREE.Scene()
//
// // 4.初始化光源
// const light = new THREE.PointLight(0xffffff, 3, 2500)
// light.position.set(0, 200, 2500)
// scene.add(light)
// scene.add( new THREE.AmbientLight(0xffffff, 0.3) )
// // THREE.CameraHelper( light.shadow.camera )
//
// // ==============添加物体
//
// // 坐标轴
// const axisHelper = new THREE.AxisHelper(50)
// scene.add(axisHelper)
//
// const controls = new OrbitControls(cam, renderer.domElement)
// controls.target = new THREE.Vector3(0, 0, 0)
//
//
// // ==============
//
// // 6.渲染
// function render() {
//     requestAnimationFrame(render)
//     controls.update()
//     renderer.render(scene, cam)
// }
// render()
