void main() {
    gl_Position = uProjMat * aPosition; // 这个坐标是屏幕坐标啦
    gl_PointSize = 30.0;
    vColor = aColor;
}
