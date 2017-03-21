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
