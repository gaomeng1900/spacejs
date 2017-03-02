precision mediump float;
/*uniform float u_Width;
uniform float u_Height;*/

void main() {
    gl_FragColor = vec4(gl_FragCoord.x/500.0, gl_FragCoord.y/500.0, 0.0, 1.0);
}
