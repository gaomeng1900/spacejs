import Space from "../Space"
// GL 渲染器
let renderer = new Space.Renderer({
    canvas: document.getElementById("canvas"),
    width: 500,
    height: 500,
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
cube0.scale(1, 2, 3)
cube1.pos.set(2, 2, -2)
cube2.pos.set(-5, 5, -10)
scene.add(cube0, cube1, cube2)

let custom = new Space.Mesh(new Space.CustomGeom(), material)
scene.add(custom)
custom.pos.set(-5, 2, -2)

let material1 = new Space.BasicMaterial({color: new Space.Color(1.0, .0, .0, 1.0)})
let cone0 = new Space.Mesh(new Space.ConeGeom(1, 5, 3), material)
let cone1 = new Space.Mesh(new Space.ConeGeom(3, 100, 4), material1)
cone0.pos.set(5, -2, 0)
cone1.pos.set(-2, -4, -3)
scene.add( cone0, cone1 )


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

    cone1.rotateX(1)

    renderer.render(scene, cam)
}
render()
