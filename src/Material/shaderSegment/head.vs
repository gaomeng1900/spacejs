// 基本
attribute vec4 aPosition;
attribute vec4 aNormal;
attribute vec4 aColor;
// attribute float a_Color;

varying vec4 vColor;
varying vec3 vPosition;
varying vec3 vNormal;

// 矩阵
uniform mat4 uModelMat;
uniform mat4 uProjMat;
uniform mat4 uNormalMat;

// 贴图
attribute vec2 aTexCoord;
uniform   mat4 uViewMat;
varying   vec2 vTexCoord;

// 阴影
uniform mat4 uProjMatFromLight;
varying vec4 vPosFromLight;

uniform mat4 uProjMatFromLight0;
varying vec4 vPosFromLight0;

uniform mat4 uProjMatFromLight1;
varying vec4 vPosFromLight1;

uniform mat4 uProjMatFromLight2;
varying vec4 vPosFromLight2;

uniform mat4 uProjMatFromLight3;
varying vec4 vPosFromLight3;

uniform mat4 uProjMatFromLight4;
varying vec4 vPosFromLight4;

uniform mat4 uProjMatFromLight5;
varying vec4 vPosFromLight5;
