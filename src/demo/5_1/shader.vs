attribute vec4 a_Position;
attribute float a_Size;

void main() {
    gl_Position = a_Position;
    gl_PointSize = a_Size;
}
