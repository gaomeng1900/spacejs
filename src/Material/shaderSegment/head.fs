precision mediump float; // NOTE: 移动端的mediump精度低于桌面端, 会出现较多的马赫带
// precision highp float; // NOTE: 性能影响较大
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

// 阴影
varying vec4 vPosFromLight;
uniform sampler2D uShadowMap;


uniform sampler2D uShadowMap0;
varying vec4 vPosFromLight0;

uniform sampler2D uShadowMap1;
varying vec4 vPosFromLight1;

uniform sampler2D uShadowMap2;
varying vec4 vPosFromLight2;

uniform sampler2D uShadowMap3;
varying vec4 vPosFromLight3;

uniform sampler2D uShadowMap4;
varying vec4 vPosFromLight4;

uniform sampler2D uShadowMap5;
varying vec4 vPosFromLight5;
