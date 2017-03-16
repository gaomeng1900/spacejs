attribute vec4 aPosition;
attribute vec4 aColor;
attribute vec4 aNormal;

varying vec4 vColor;
// varying vec4 vNormal;

uniform mat4 uProjMat;
uniform mat4 uNormalMat;
uniform vec3 uLightDirection;
uniform vec4 uLightColor;

void main() {
    gl_Position = uProjMat * aPosition;
    gl_PointSize = 1.0;
    vec3 normal = normalize(vec3(uNormalMat * aNormal));
    // vec3 normal = normalize(vec3(aNormal));
    float nDotL = max(dot(normal, uLightDirection), 0.0);
    vec3 diffuse = vec3(uLightColor) * vec3(aColor) * nDotL;
    vColor = vec4(diffuse, 1.0);
    // vNormal = aNormal;
}
