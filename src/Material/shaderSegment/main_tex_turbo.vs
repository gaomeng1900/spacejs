void main() {
    gl_Position = uProjMat * aPosition; // 这个坐标是屏幕坐标啦
    // gl_PointSize = 1.0;
    vPosition = vec3(uModelMat * aPosition);
    vNormal = normalize(vec3(uNormalMat * aNormal));
    vColor = aColor;
    vPosFromLight = uProjMatFromLight * aPosition;
    // vPosFromLight0 = uProjMatFromLight0 * aPosition;
    // vPosFromLight1 = uProjMatFromLight1 * aPosition;
    // vPosFromLight2 = uProjMatFromLight2 * aPosition;
    // vPosFromLight3 = uProjMatFromLight3 * aPosition;
    // vPosFromLight4 = uProjMatFromLight4 * aPosition;
    // vPosFromLight5 = uProjMatFromLight5 * aPosition;

    vTexCoord = aTexCoord;
}
