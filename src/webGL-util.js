export default {
    initWebGL: (canvas) => {

        // 初始化 WebGL 上下文
        // 创建全局变量
        window.gl = null;

        try {
            // 尝试获取标准上下文，如果失败，回退到试验性上下文
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        }
        catch(e) {}

        // 如果没有GL上下文，马上放弃
        if (!gl) {
            alert("WebGL初始化失败，可能是因为您的浏览器不支持。");
            gl = null;
        }

        // 只有在 WebGL 可用的时候才继续
        if (gl) {
            // 设置分辨率
            // gl.viewport(0, 0, canvas.width, canvas.height);
            // 设置清除颜色为黑色，不透明
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            // 开启“深度测试”, Z-缓存
            console.log("深度测试");
            gl.enable(gl.DEPTH_TEST);
            // 设置深度测试，近的物体遮挡远的物体
            // gl.depthFunc(gl.LESS);
            // 清除颜色和深度缓存
            gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        }

        return gl;
    },

    makeShader: (vs, fx, gl) => {
        let vertexShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertexShader, vs)
        gl.compileShader(vertexShader)

        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragmentShader, fx)
        gl.compileShader(fragmentShader)

        let shaderProgram = gl.createProgram()
        gl.attachShader(shaderProgram, vertexShader)
        gl.attachShader(shaderProgram, fragmentShader)
        gl.linkProgram(shaderProgram)

        return shaderProgram
    }
}
