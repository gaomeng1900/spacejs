void main() {
    // gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 1.0);

    // 不可能在这里手动实现MSAA, 只能在外面实现SSAA

    // 提高精度
    const vec4 bitShift = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
    const vec4 bitMask = vec4(1.0/256.0, 1.0/256.0, 1.0/256.0, 0.0);
    float depth = distance(uPointLightPos.xyz, vPosition.xyz) / 50.0;
    vec4 rgbaDepth = fract(depth * bitShift); // Calculate the value stored into each byte
    // vec4 rgbaDepth = fract(gl_FragCoord.z * bitShift); // Calculate the value stored into each byte
    rgbaDepth -= rgbaDepth.gbaa * bitMask; // Cut off the value which do not fit in 8 bits
    gl_FragColor = rgbaDepth;
    // gl_FragColor = vec4(depth / 10.0, depth / 10.0, depth / 10.0, 1.0);
}
