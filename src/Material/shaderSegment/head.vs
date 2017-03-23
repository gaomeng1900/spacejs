// 基本
attribute vec4 aPosition;
attribute vec4 aColor;
attribute vec4 aNormal;

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
