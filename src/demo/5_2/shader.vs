attribute vec4 a_Position;
attribute float a_Size;
attribute float a_Color;
varying float v_Color;

void main() {
    gl_Position = a_Position;
    gl_PointSize = a_Size;
    v_Color = a_Color;
}
