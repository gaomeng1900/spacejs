void main() {
    gl_Position = uProjMat * aPosition; // 这个坐标是屏幕坐标啦
    // gl_PointSize = 1.0;
    vPosition = vec3(uModelMat * aPosition);
    vNormal = normalize(vec3(uNormalMat * aNormal));
    vColor = aColor;
    vPosFromLight = uProjMatFromLight * aPosition;

    vTexCoord = aTexCoord;
}
