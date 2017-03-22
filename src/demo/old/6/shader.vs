attribute vec4 a_Position;
attribute vec2 a_TexCoord;
uniform   mat4 u_ViewMat;
varying   vec2 v_TexCoord;

void main() {
    gl_Position = u_ViewMat * a_Position;
    v_TexCoord = a_TexCoord;
}
