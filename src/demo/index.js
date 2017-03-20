import Space from "../Space"
// GL 渲染器
let renderer = new Space.Renderer({
    canvas: document.getElementById("canvas"),
    width: 500,
    height: 500,
    clearColor: [0, 0, 0, 1]
})

// 相机
let cam = new Space.Camera("perspective", 90, 1, 0.1, 100)//fov, aspect, near, far
cam.pos.set(0, 0, 5)
cam.up.set(0, 1, 0)
cam.center.set(0, 0, 0)
window.cam = cam

// 场景
let scene = new Space.Scene(renderer) // TODO: THREE是怎么处理的, link shader需要gl对象
window.scene = scene

// 光源
let pLight = new Space.PointLight(new Space.Vec3(2.0, 2.0, 2.0),
                                  [0.9, 0.9, 0.9, 1.0],
                                  1.0) // intensity
let aLight = new Space.AmbientLight([0.3, 0.3, 0.3, 1.0])
scene.add(pLight)
scene.add(aLight)

// 物体
let cubeGeom = new Space.CubeGeom(5)
let material = new Space.Material()
let cube0 = new Space.Mesh(cubeGeom, material)
let cube1 = new Space.Mesh(cubeGeom, material)
let cube2 = new Space.Mesh(cubeGeom, material)
cube1.pos.set(2, 2, -2)
cube2.pos.set(-5, 5, -10)
scene.add(cube0, cube1, cube2)

// 渲染
const render = ()=>{
    requestAnimationFrame(render)
    // cube.pos.x += 0.1
    cube0.rotateY(1)
    cube0.rotateX(0.7)
    cube1.rotateZ(0.7)
    cube2.rotateX(-0.5)
    cube2.rotateY(0.5)
    renderer.render(scene, cam)
}
render()
