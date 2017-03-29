void main() {
    vec4 pos = uProjMatFromLight * aPosition;
    vPosition = vec3(uModelMat * aPosition);
    // pos.y = -pos.y;
    gl_Position = pos;
}
