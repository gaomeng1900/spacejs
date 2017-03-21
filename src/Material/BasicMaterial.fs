precision mediump float;
varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;

// uniform vec3 uLightDirection;
// uniform vec4 uLightColor;
uniform vec4 uAmbientLight;
uniform vec3 uPointLightPos;
uniform vec4 uPointLightColor;

// 镜面反射
uniform float uShininess;
uniform vec3  uViewPos;

// 贴图
uniform float uHasTex;
uniform sampler2D uSampler;
varying vec2 vTexCoord;

// bool hasTex(float);

// phong
void main() {
    // 根据传入的颜色以及贴图判断该偏远原始颜色
    // bool hasTex = false;
    vec4 oColor;
    // bool hasTex = uHasTex > 0.5;
    // 这里一定是做了什么并行优化
    // 如果直接写false, 就不会运行texture
    // 写了包含传入值的判断就会运行, 只是不赋值
    // if (hasTex(uHasTex)) {
    if (0.1 > 0.5) {
    // if (false) {
        oColor = texture2D(uSampler, vTexCoord);
    } else {
        oColor = vColor;
    };
    // 自然光漫反射
    vec3 ambient = uAmbientLight.rgb * oColor.rgb;

    // 由于经过了插值, 法线需要重新归一
    vec3 normal        = normalize(vNormal);
    vec3 pointLightDir = normalize(uPointLightPos - vPosition);
    float nDotL        = max(dot(pointLightDir, normal), 0.0);
    // 点光源漫反射
    vec3 diffuse = uPointLightColor.rgb * oColor.rgb * nDotL;

    vec3 viewDir = normalize(uViewPos - vPosition);

    // Blinn-Phong 着色, 相对于Phong性能更高, 更均匀
    vec3 halfwayDir = normalize(pointLightDir + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    // Phong 着色, 更真实?
    // // vec3 reflectanceRay = 2.0 * dot(normal, pointLightDir) * normal - pointLightDir;
    // vec3 reflectanceRay = reflect(-pointLightDir, normal);
    // float spec = 0.0;
    // if(nDotL > 0.0)
    // {
    //     spec = pow(max(dot(reflectanceRay, viewDir), 0.0), uShininess); // !!!KEY
    // }
    vec3 specular = uPointLightColor.rgb * spec;
    gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
    // gl_FragColor = vec4(specular, 1.0);
    // gl_FragColor = vec4(reflectanceRay, 1.0);
    // gl_FragColor = vec4(uPointLightColor);
    // gl_FragColor = vec4(spec, 0.0, 0.0, 1.0);
}

// bool hasTex(float has) {
//     if(has > 0.5)
//     {
//         return true;
//     }
//     else
//     {
//         return false;
//     }
// }
