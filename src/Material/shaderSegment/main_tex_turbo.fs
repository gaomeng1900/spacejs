float unpackDepth(const in vec4 rgbaDepth) {
  const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
  float depth = dot(rgbaDepth, bitShift); // Use dot() since the calculations is same
  return depth;
}

vec2 getVisibilityFromMap(const in sampler2D shadowMap, in vec3 shadowCoord, in vec2 shift, in float campare_depth) {
    // 为了防止边缘阴影扩散, 禁止取超出贴图的深度
    shadowCoord.x = shadowCoord.x >= 1.0 ? 0.999 : shadowCoord.x;
    shadowCoord.x = shadowCoord.x <= 0.0 ? 0.001 : shadowCoord.x;
    shadowCoord.y = shadowCoord.y >= 1.0 ? 0.999 : shadowCoord.y;
    shadowCoord.y = shadowCoord.y <= 0.0 ? 0.001 : shadowCoord.y;
    float depth = unpackDepth(texture2D(shadowMap, shadowCoord.xy + shift));
    if(abs(depth - campare_depth) > 0.01) // 深度相差过大, 说明分层
    {
        return vec2(1.0, 1.0);
    }
    bool visibility = depth + 0.0018 > shadowCoord.z;
    float visibilityPointLight = visibility ? 1.0 : 0.0;
    float visibilityHightLight = visibility ? 1.0 : 0.0;
    return vec2(visibilityPointLight, visibilityHightLight);
}

vec2 getVisibility(const in sampler2D shadowMap, in vec4 posFromLight) {
    vec3 shadowCoord = (posFromLight.xyz/posFromLight.w)/2.0 + 0.5;
    // 不在当前阴影贴图范围的就不要计算
    // (shadowCoord.x > 1.0 || shadowCoord.y > 1.0 || shadowCoord.x < 0.0 || shadowCoord.y < 0.0) && (return vec2(0.0, 0.0));
    if(shadowCoord.x > 1.0 || shadowCoord.y > 1.0 || shadowCoord.x < 0.0 || shadowCoord.y < 0.0 || shadowCoord.z < 0.0 || shadowCoord.z > 1.0)
    {
        return vec2(100.0, 100.0);
    } else {
        vec4 rgbaDepth = texture2D(shadowMap, shadowCoord.xy);
        float depth = unpackDepth(rgbaDepth); // Retrieve the z-value from R
        bool visibility = depth + 0.0018 > shadowCoord.z;
        float visibilityPointLight;
        float visibilityHightLight;
        if(!visibility){
        // if(true){
            vec2 visi = vec2(0.0, 0.0);
            mat3 visisA;
            mat3 visisB;
            for(float i = -1.0; i <= 1.0; i++)
            {
                for(float j = -1.0; j <= 1.0; j++)
                {
                    // TODO: 这个+=会导致每次loop对上一次LOOP产生依赖而无法并行
                    visi += getVisibilityFromMap(shadowMap, shadowCoord, vec2(0.001 * i, 0.001 * j), depth) / 9.0;

                    // visi = getVisibilityFromMap(shadowMap, shadowCoord, vec2(0.001 * i, 0.001 * j), depth) / 9.0;
                    // visisA[int(i)+1][int(j)+1] = visi.x;
                    // visisB[int(i)+1][int(j)+1] = visi.x;
                }
            }

            visibilityPointLight = min(visi.x, 1.0);
            visibilityHightLight = min(visi.y, 1.0);
        } else {
            visibilityPointLight = 1.0;
            visibilityHightLight = 1.0;
        }
        return vec2(visibilityPointLight, visibilityHightLight);
    }
}

// vec2 getVisibilityAll() {
//     vec2 visibilities = getVisibility(uShadowMap0, vPosFromLight0);
//     visibilities += getVisibility(uShadowMap1, vPosFromLight1);
//     visibilities += getVisibility(uShadowMap2, vPosFromLight2);
//     visibilities += getVisibility(uShadowMap3, vPosFromLight3);
//     visibilities += getVisibility(uShadowMap4, vPosFromLight4);
//     visibilities += getVisibility(uShadowMap5, vPosFromLight5);
//     return vec2(min(visibilities.x, 1.0), min(visibilities.y, 1.0)); // 两个光线视锥的相交处会过亮
// }



// phong
void main() {
    // vec2 visibilities = getVisibilityAll();
    // float visibilityPointLight = visibilities.x; // 两个光线视锥的相交处会过亮
    // float visibilityHightLight = visibilities.y;

    vec2 visibilities = getVisibility(uShadowMap0, vPosFromLight0);

    // ->
    vec4 ambientLightColor = uAmbientLight;
    vec4 oColor = texture2D(uSampler, vTexCoord);

    // TODO: += 有依赖会破坏并行
    // NOTE: 并行优化成功, GPU占用率明显降低
    visibilities = visibilities.x == 100.0 ? getVisibility(uShadowMap1, vPosFromLight1) : visibilities;

    // -> // 自然光漫反射
    vec3 ambient = ambientLightColor.rgb * oColor.rgb;
    // -> // 由于经过了插值, 法线需要重新归一
    vec3 normal = normalize(vNormal);

    visibilities = visibilities.x == 100.0 ? getVisibility(uShadowMap2, vPosFromLight2) : visibilities;

    // ->
    vec3 pointLightDir = normalize(uPointLightPos - vPosition);

    visibilities = visibilities.x == 100.0 ? getVisibility(uShadowMap3, vPosFromLight3) : visibilities;

    // ->
    float nDotL = max(dot(pointLightDir, normal), 0.0);

    visibilities = visibilities.x == 100.0 ? getVisibility(uShadowMap4, vPosFromLight4) : visibilities;

    vec3 viewDir = normalize(uViewPos - vPosition);
    // Phong 着色, 更真实
    vec3 reflectanceRay = reflect(-pointLightDir, normal);

    visibilities = visibilities.x == 100.0 ? (visibilities + getVisibility(uShadowMap5, vPosFromLight5)) : visibilities;
    float visibilityPointLight = min(visibilities.x, 1.0); // 两个光线视锥的相交处会过亮
    float visibilityHightLight = min(visibilities.y, 1.0);

    vec4 pointLightColor = uPointLightColor * visibilityPointLight;



    vec3 diffuse = pointLightColor.rgb * oColor.rgb * nDotL;
    float spec = pow(max(dot(reflectanceRay, viewDir), 0.0), uShininess);

    vec3 specular = pointLightColor.rgb * spec * visibilityHightLight;

    gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
}
