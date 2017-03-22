precision mediump float;
varying float v_Color;

void main() {
    gl_FragColor = vec4(v_Color, .0, .0, 1.0);
}
