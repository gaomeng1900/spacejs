attribute vec4 a_Position;
uniform   mat4 u_ViewMat;
varying   vec4 v_Color;

void main() {
    gl_Position = u_ViewMat * a_Position;
    gl_PointSize = 1.0;
    v_Color = vec4(
        a_Position.z + .5,
        a_Position.z + .5,
        a_Position.z + .5,
        1.0);
}
