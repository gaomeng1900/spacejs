void main() {
    // gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 1.0);

    // Webgl不提供Frame抗锯齿方案, 只能自己写了
    // 每个像素四个采样点

    // 提高精度
    const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
    const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);
    vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift); // Calculate the value stored into each byte
    rgbaDepth -= rgbaDepth.gbaa * bitMask; // Cut off the value which do not fit in 8 bits
    gl_FragColor = rgbaDepth;
}
