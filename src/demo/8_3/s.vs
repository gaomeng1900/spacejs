attribute vec3 inputPosition;
attribute vec3 inputNormal;
// attribute vec2 inputTexCoord;

uniform mat4 projection, modelview, normalMat;

varying vec3 normalInterp;
varying vec3 vertPos;

void main(){
  vec4 vertPos4 = modelview * vec4(inputPosition, 1.0);
  vertPos = vec3(vertPos4) / vertPos4.w;
  normalInterp = vec3(normalMat * vec4(inputNormal, 0.0));
  gl_Position = projection * vertPos4;
}
