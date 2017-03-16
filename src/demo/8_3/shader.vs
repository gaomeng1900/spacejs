attribute vec4 aPosition;
attribute vec4 aColor;
attribute vec4 aNormal;

varying vec4 vColor;
varying vec3 vPosition;
varying vec3 vNormal;

uniform mat4 uModelMat;
uniform mat4 uProjMat;
uniform mat4 uNormalMat;


void main() {
    gl_Position = uProjMat * aPosition; // 这个坐标是屏幕坐标啦
    // gl_PointSize = 1.0;
    vPosition = vec3(uModelMat * aPosition);
    vNormal = normalize(vec3(uNormalMat * aNormal));
    vColor = aColor;


    // vec3 normal = normalize(vec3(uNormalMat * aNormal));
    // vec3 pointLightDirection = normalize(uPointLightPos - aPosition);
    // float nDotL = max(dot(normal, pointLightDirection), 0.0);
    // // float nDotL = max(dot(normal, uLightDirection), 0.0);
    // vec3 diffuse = vec3(uLightColor) * vec3(aColor) * nDotL;
    // vec3 ambient = vec3(uAmbientLight) * vec3(aColor);
    // vColor = vec4(diffuse + ambient, 1.0);
    // vNormal = aNormal;
}
