precision mediump float;
varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;

// uniform vec3 uLightDirection;
// uniform vec4 uLightColor;
uniform vec4 uAmbientLight;
uniform vec3 uPointLightPos;
uniform vec4 uPointLightColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 pointLightDirection = normalize(uPointLightPos - vPosition);
    float nDotL = max(dot(pointLightDirection, normal), 0.0);
    vec3 diffuse = uPointLightColor.rgb * vColor.rgb * nDotL;
    vec3 ambient = uAmbientLight.rgb * vColor.rgb;
    gl_FragColor = vec4(diffuse + ambient, 1.0);
}
