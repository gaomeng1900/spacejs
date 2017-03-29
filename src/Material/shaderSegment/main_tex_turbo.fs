float unpackDepth(const in vec4 rgbaDepth) {
  const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
  float depth = dot(rgbaDepth, bitShift); // Use dot() since the calculations is same
  return depth;

  // return rgbaDepth.r;
}

// vec2 getVisibilityFromMap(const in samplerCube shadowMap, in vec4 shadowCoord) {
//     // 为了防止边缘阴影扩散, 禁止取超出贴图的深度
//     float depth = unpackDepth(textureCube(shadowMap, shadowCoord.xyz));
//     if(abs(depth - campare_depth) > 0.01) { // 深度相差过大, 说明分层
//         return vec2(1.0, 1.0);
//     }
//     bool visibility = depth + 0.0018 > length(shadowCoord);
//     float visibilityPointLight = visibility ? 1.0 : 0.0;
//     float visibilityHightLight = visibility ? 1.0 : 0.0;
//     // NOTE: 该优化无明显效果
//     // vec2 result = (abs(depth - campare_depth) > 0.01) ? vec2(1.0, 1.0) : vec2(visibilityPointLight, visibilityHightLight);
//     // return result;
//     return vec2(visibilityPointLight, visibilityHightLight);
// }
//
// const float BLUR_R = 2.0;
// const float BLUR_W = pow(BLUR_R + 1.0, 2.0);
//
// vec2 getVisibility(const in samplerCube shadowMap, in vec4 posFromLight) {
//     // vec3 shadowCoord = (posFromLight.xyz/posFromLight.w)/2.0 + 0.5;
//     // 不在当前阴影贴图范围的就不要计算
//     // (shadowCoord.x > 1.0 || shadowCoord.y > 1.0 || shadowCoord.x < 0.0 || shadowCoord.y < 0.0) && (return vec2(0.0, 0.0));
//     // if(shadowCoord.x > 1.0 || shadowCoord.y > 1.0 || shadowCoord.x < 0.0 || shadowCoord.y < 0.0 || shadowCoord.z < 0.0 || shadowCoord.z > 1.0)
//     // {
//     //     return vec2(100.0, 100.0);
//     // } else {
//     // vec4 rgbaDepth = textureCube(shadowMap, posFromLight.xyz);
//     vec4 rgbaDepth = textureCube(shadowMap, vPosition.xyz - uPointLightPos.xyz);
//         float depth = unpackDepth(rgbaDepth); // Retrieve the z-value from R
//         bool visibility = depth + 0.0018 > (length(vPosition.xyz - uPointLightPos.xyz) / 50.0);
//         // bool visibility = depth + 0.0018 > length(posFromLight.xyz);
//         // float visibilityPointLight = visibility ? 1.0 : 0.0;
//         // float visibilityHightLight = visibility ? 1.0 : 0.0;
//         float visibilityPointLight;
//         float visibilityHightLight;
//         if(!visibility){
//         // if(true){
//             vec2 visi = vec2(0.0, 0.0);
//             // mat3 visisA;
//             // mat3 visisB;
//             // 高斯模糊
//             for(float i = -BLUR_R; i <= BLUR_R; i++)
//             {
//                 for(float j = -BLUR_R; j <= BLUR_R; j++)
//                 {
//                     // NOTE: 这个+=会导致每次loop对上一次LOOP产生依赖而无法并行
//                     // NOTE: 矩阵写入会造成更大的性能消耗
//                     // 平均权重
//                     visi += getVisibilityFromMap(shadowMap, shadowCoord, vec2(0.001 * i, 0.001 * j), depth) / BLUR_W;
//                     // 半径权重
//                     // visi += getVisibilityFromMap(shadowMap, shadowCoord);
//
//                     // visi = getVisibilityFromMap(shadowMap, shadowCoord, vec2(0.001 * i, 0.001 * j), depth);
//                     // visisA[int(i)+1][int(j)+1] = visi.x;
//                     // visisB[int(i)+1][int(j)+1] = visi.x;
//                 }
//             }
//
//             visibilityPointLight = min(visi.x, 1.0);
//             visibilityHightLight = min(visi.y, 1.0);
//         } else {
//             visibilityPointLight = 1.0;
//             visibilityHightLight = 1.0;
//         }
//         return vec2(depth, depth);
//         // return vec2(depth, depth);
//         // return vec2(visibilityPointLight, visibilityHightLight);
//     // }
// }

// phong
void main() {
    // vec4 rgbaDepth = textureCube(uShadowMap, vPosFromLight.xyz);
    vec4 rgbaDepth = textureCube(uShadowMap, vPosition.xyz - uPointLightPos.xyz);
    float depth = unpackDepth(rgbaDepth); // Retrieve the z-value from R
    bool visibility = depth + 0.0018 > (length(vPosition.xyz - uPointLightPos.xyz) / 50.0);
    // bool visibility = depth + 0.0018 > length(posFromLight.xyz);
    float visibilityPointLight = visibility ? 1.0 : 0.0;
    float visibilityHightLight = visibility ? 1.0 : 0.0;
    // vec2 visibilities = vec2();

    // ->
    vec4 ambientLightColor = uAmbientLight;
    vec4 oColor = texture2D(uSampler, vTexCoord);

    // TODO: += 有依赖会破坏并行
    // NOTE: 并行优化成功, GPU占用率明显降低
    // visibilities = visibilities.x == 100.0 ? getVisibility(uShadowMap1, vPosFromLight1) : visibilities;

    // -> // 自然光漫反射
    vec3 ambient = ambientLightColor.rgb * oColor.rgb;
    // -> // 由于经过了插值, 法线需要重新归一
    vec3 normal = normalize(vNormal);

    // visibilities = visibilities.x == 100.0 ? getVisibility(uShadowMap2, vPosFromLight2) : visibilities;

    // ->
    vec3 pointLightDir = normalize(uPointLightPos - vPosition);

    // visibilities = visibilities.x == 100.0 ? getVisibility(uShadowMap3, vPosFromLight3) : visibilities;
//
    // ->
    float nDotL = max(dot(pointLightDir, normal), 0.0);

    // visibilities = visibilities.x == 100.0 ? getVisibility(uShadowMap4, vPosFromLight4) : visibilities;

    vec3 viewDir = normalize(uViewPos - vPosition);
    // Phong 着色, 更真实
    vec3 reflectanceRay = reflect(-pointLightDir, normal);

    // visibilities = visibilities.x == 100.0 ? (visibilities + getVisibility(uShadowMap5, vPosFromLight5)) : visibilities;
    // float visibilityPointLight = min(visibilities.x, 2000000000.0); // 两个光线视锥的相交处会过亮
    // float visibilityHightLight = min(visibilities.y, 2000000000.0);

    vec4 pointLightColor = uPointLightColor * visibilityPointLight;



    vec3 diffuse = pointLightColor.rgb * oColor.rgb * nDotL;
    float spec = pow(max(dot(reflectanceRay, viewDir), 0.0), uShininess);

    vec3 specular = pointLightColor.rgb * spec * visibilityHightLight;

    gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
    // gl_FragColor = textureCube(uShadowMap, vec3(gl_FragCoord.x, gl_FragCoord.y, -1.0));
    // gl_FragColor = textureCube(uShadowMap, vPosition.xyz);
    // gl_FragColor = vec4(visibilities.x / 2.0, visibilities.x / 2.0 , 1.0, 1.0);
    // gl_FragColor = vec4(depth, depth, depth, 1.0);
    // gl_FragColor = vec4(rgbaDepth.yzw / 2.0, 1.0);
    // gl_FragColor = vec4((textureCube(uShadowMap, vNormal.xyz) / 1.0).xyz, 1.0);
    // gl_FragColor = vec4(vPosition.xyz - uPointLightPos.xyz, 1.0);
}
