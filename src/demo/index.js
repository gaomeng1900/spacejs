import Space from "../Space"

// 鼠标控制
let mouse_begin = [0,0]
let mouse_end = [0,0]
let mouse_draging = false
const canvas = document.getElementById("canvas")
canvas.addEventListener("mousedown", event => {
    mouse_draging = true
    mouse_begin = [
        event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - canvas.offsetLeft,
        event.clientY + document.body.scrollTop + document.documentElement.scrollTop - canvas.offsetTop,
    ]
    mouse_end = mouse_begin
})

canvas.addEventListener("mouseup", event => {
    mouse_draging = false
    mouse_begin = [0,0]
    mouse_end = [0,0]
})

canvas.addEventListener("mousemove", event => {
    if (mouse_draging) {
        mouse_end = [
            event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - canvas.offsetLeft,
            event.clientY + document.body.scrollTop + document.documentElement.scrollTop - canvas.offsetTop,
        ]
    }
})

// GL 渲染器
let renderer = new Space.Renderer({
    canvas: document.getElementById("canvas"),
    width: 700,
    height: 700,
    clearColor: new Space.Color(0.5, 0.5, 0.5, 1)
})

// 相机
let cam = new Space.Camera("perspective", 90, 1, 0.1, 100)//fov, aspect, near, far
cam.pos.set(0, 0, 7)
cam.up.set(0, 1, 0)
cam.center.set(0, 0, 0)
window.cam = cam

// 场景
let scene = new Space.Scene(renderer) // TODO: THREE是怎么处理的, link shader需要gl对象
window.scene = scene

// 光源
let pLight = new Space.PointLight(new Space.Vec3(4.0, 4.0, 4.0),
                                  new Space.Color(0.9, 0.9, 0.9, 1.0))
let aLight = new Space.AmbientLight(new Space.Color(0.5, 0.5, 0.5, 1.0))
scene.add(pLight)
scene.add(aLight)

// 物体
import img_src from "./pattern.png"
let material = new Space.BasicMaterial({
    color: new Space.Color(1.0, .0, .0, 1.0), // texture加载成功之前显示颜色
    map: new Space.Texture(img_src) // 加载之后自动更新
})

let cubeGeom = new Space.CubeGeom(5)
let cube0 = new Space.Mesh(cubeGeom, material)
let cube1 = new Space.Mesh(cubeGeom, material)
let cube2 = new Space.Mesh(cubeGeom, material)
cube0.scale(1, 2, 1.5)
cube0.pos.set(4, -1, 0)
cube1.pos.set(2, 0.5, 1)
// cube2.pos.set(-5, 5, -10)
scene.add(cube0, cube1)

let custom = new Space.Mesh(new Space.CustomGeom(), material)
// scene.add(custom)
custom.pos.set(-5, 2, -2)

let material1 = new Space.BasicMaterial({color: new Space.Color(1.0, .0, .0, 1.0)})
let cone0 = new Space.Mesh(new Space.ConeGeom(1, 5, 3), material1)
let cone1 = new Space.Mesh(new Space.ConeGeom(2, 50, 3), material1)
cone0.pos.set(5, -2, 0)
cone1.pos.set(-2, -4, -3)
// scene.add( cone0, cone1 )

import earth_img from "./earth-0.jpg"
let material2 = new Space.BasicMaterial({map: new Space.Texture(earth_img)})
let sphere0 = new Space.Mesh(new Space.SphereGeom(1.5, 18, 18), material2)
sphere0.pos.set(0, 0, -1)
scene.add(sphere0)

let plane0 = new Space.Mesh(new Space.PlaneGeom(24, 14), material2)
plane0.pos.set(0, 0, -4)
scene.add(plane0)

let keyPoints = [
    new Space.Vec3(0, 0, 0),
    new Space.Vec3(3, 3, 3),
    new Space.Vec3(3, -3, 0),
]
let lineMaterial = new Space.LineMaterial({color: new Space.Color(1, 1, 0, 1)})
let line0 = new Space.Line(new Space.LineGeom(keyPoints), lineMaterial)
// scene.add(line0)


// 渲染
const render = ()=>{
    requestAnimationFrame(render)
    // cube.pos.x += 0.1
    cube0.rotateY(1)
    cube0.rotateX(0.7)
    cube0.rotateZ(0.5)

    cube1.rotateZ(0.7)
    cube1.rotateY(0.2)
    cube1.rotateX(0.1)

    cube2.rotateX(-0.5)
    cube2.rotateY(0.5)

    custom.rotateY(1)
    custom.rotateX(1)

    cone0.rotateY(-2)
    cone0.rotateX(1)
    cone0.rotateZ(0.6)

    cone1.rotateZ(1)

    sphere0.rotateX(1)
    sphere0.rotateY(1)

    // plane0.rotateY(2)
    // plane0.rotateX(2)

    line0.rotateX(1)
    line0.rotateY(1)
    line0.rotateZ(1)

    let r_x = new Space.Mat4().setRotate(0.2 * (mouse_begin[1] - mouse_end[1]), 1, 0, 0)
    let r_y = new Space.Mat4().setRotate(0.2 * (mouse_begin[0] - mouse_end[0]), 0, 1, 0)
    let new_pos = r_x.mult(r_y).multVec4(new Space.Vec4(cam.pos.x, cam.pos.y, cam.pos.z, 1.0))
    // console.log(new_pos);
    cam.pos.set(new_pos.x, new_pos.y, new_pos.z)
    mouse_begin = mouse_end


    renderer.render(scene, cam)
}
render()
window.render = render

window._print = (array, count) => {
    let lines = Math.ceil(array.length / count)
    for (var i = 0; i < lines; i++) {
        let out = array.slice(i * count, (i+1) * count)
        console.log(out);
    }
}
