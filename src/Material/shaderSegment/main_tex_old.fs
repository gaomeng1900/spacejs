// TODO: 调用函数会不会影响性能, 反正只用一次, 直接放到main函数里也挺好的
float unpackDepth(const in vec4 rgbaDepth) {
  const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
  float depth = dot(rgbaDepth, bitShift); // Use dot() since the calculations is same
  return depth;
}

vec2 getVisibility(const in sampler2D shadowMap, in vec3 shadowCoord, in vec2 shift) {
    float depth = unpackDepth(texture2D(uShadowMap, shadowCoord.xy + shift));
    bool visibility = depth + 0.001 > shadowCoord.z;
    float visibilityPointLight = visibility ? 2.0 : 0.2;
    float visibilityHightLight = visibility ? 2.0 : 0.1;
    return vec2(visibilityPointLight, visibilityHightLight);
}

// phong
void main() {

    vec3 shadowCoord = (vPosFromLight.xyz/vPosFromLight.w)/2.0 + 0.5;
    vec4 rgbaDepth = texture2D(uShadowMap, shadowCoord.xy);
    float depth = unpackDepth(rgbaDepth); // Retrieve the z-value from R
    bool visibility = depth + 0.001 > shadowCoord.z;
    float visibilityPointLight;
    float visibilityHightLight;
    if(!visibility){
    // if(true){
        // 阴影部分进行模糊采样
        // vec4 rgbaDepth0 = texture2D(uShadowMap, shadowCoord.xy + vec2(-0.001, -0.001));
        // vec4 rgbaDepth1 = texture2D(uShadowMap, shadowCoord.xy + vec2(0.001, -0.001));
        // vec4 rgbaDepth2 = texture2D(uShadowMap, shadowCoord.xy + vec2(-0.001, 0.001));
        // vec4 rgbaDepth3 = texture2D(uShadowMap, shadowCoord.xy + vec2(0.001, 0.001));
        // float depth0 = unpackDepth(texture2D(uShadowMap, shadowCoord.xy + vec2(-0.002, -0.002)));
        // bool visibility0 = depth0 + 0.001 > shadowCoord.z;
        // float visibilityPointLight0 = visibility0 ? 1.0 : 0.7;
        // float visibilityHightLight0 = visibility0 ? 1.0 : 0.1;


        vec2 visi = vec2(0.0, 0.0);
        for(float i = -2.0; i <= 2.0; i++)
        {
            for(float j = -2.0; j <= 2.0; j++)
            {
                visi += getVisibility(uShadowMap, shadowCoord, vec2(0.001 * i, 0.001 * j)) / 25.0;
            }
        }

        // NOTE: 考虑到只对阴影进行模糊, 会使模糊之后的边缘依然比较明显
        // 因此这里要把边缘弄成亮的



        // visibilityPointLight = smoothstep(0.1, 1.0, visi.x);
        // visibilityHightLight = smoothstep(0.1, 1.0, visi.y);
        visibilityPointLight = min(visi.x, 1.0);
        visibilityHightLight = min(visi.y, 1.0);

        // vec2 visi0 = getVisibility(uShadowMap, shadowCoord, vec2(-0.001, -0.001)) * 0.9;
        // vec2 visi1 = getVisibility(uShadowMap, shadowCoord, vec2(-0.001, 0.0));
        // vec2 visi2 = getVisibility(uShadowMap, shadowCoord, vec2(-0.001, 0.001)) * 0.9;
        // vec2 visi3 = getVisibility(uShadowMap, shadowCoord, vec2(0.0, -0.001));
        // vec2 visi4 = getVisibility(uShadowMap, shadowCoord, vec2(0.0, 0.001));
        // vec2 visi5 = getVisibility(uShadowMap, shadowCoord, vec2(0.001, -0.001)) * 0.9;
        // vec2 visi6 = getVisibility(uShadowMap, shadowCoord, vec2(0.001, 0.0));
        // vec2 visi7 = getVisibility(uShadowMap, shadowCoord, vec2(0.001, +0.001)) * 0.9;
        // vec2 visi8 = vec2(visibility ? 1.0 : 0.7, visibility ? 1.0 : 0.1) * 1.4;
        //
        // float depth1 = unpackDepth(texture2D(uShadowMap, shadowCoord.xy + vec2(0.002, -0.002)));
        // bool visibility1 = depth1 + 0.001 > shadowCoord.z;
        // float visibilityPointLight1 = visibility1 ? 1.0 : 0.7;
        // float visibilityHightLight1 = visibility1 ? 1.0 : 0.1;

        // float depth2 = unpackDepth(texture2D(uShadowMap, shadowCoord.xy + vec2(-0.002, 0.002)));
        // bool visibility2 = depth2 + 0.001 > shadowCoord.z;
        // float visibilityPointLight2 = visibility2 ? 1.0 : 0.7;
        // float visibilityHightLight2 = visibility2 ? 1.0 : 0.1;

        // float depth3 = unpackDepth(texture2D(uShadowMap, shadowCoord.xy + vec2(0.002, 0.002)));
        // bool visibility3 = depth3 + 0.001 > shadowCoord.z;
        // float visibilityPointLight3 = visibility3 ? 1.0 : 0.7;
        // float visibilityHightLight3 = visibility3 ? 1.0 : 0.1;

        // visibilityPointLight = (visibilityPointLight0 +
        //                         visibilityPointLight1 +
        //                         visibilityPointLight2 +
        //                         visibilityPointLight3) /4.0;
        // visibilityHightLight = (visibilityHightLight0 +
        //                         visibilityHightLight1 +
        //                         visibilityHightLight2 +
        //                         visibilityHightLight3) /4.0;
        //
        // visibilityPointLight = (visi0.x +
        //                         visi1.x +
        //                         visi2.x +
        //                         visi3.x +
        //                         visi4.x +
        //                         visi5.x +
        //                         visi6.x +
        //                         visi7.x +
        //                         visi8.x) /9.0;
        // visibilityHightLight = (visi0.y +
        //                         visi1.y +
        //                         visi2.y +
        //                         visi3.y +
        //                         visi4.y +
        //                         visi5.y +
        //                         visi6.y +
        //                         visi7.y +
        //                         visi8.y) /9.0;
    } else {
        visibilityPointLight = visibility ? 1.0 : 0.7;
        visibilityHightLight = visibility ? 1.0 : 0.1;
    }

    vec4 ambientLightColor = uAmbientLight;
    vec4 pointLightColor = uPointLightColor * visibilityPointLight;

    // NOTE: 为了让他不去尝试获取uSampler和vTexCoord
    // 出此下策
    vec4 oColor; // = vColor;
    oColor = texture2D(uSampler, vTexCoord);
    // false && bool(oColor = texture2D(uSampler, vTexCoord));
    // oColor = texture2D(uSampler, vTexCoord)
    // oColor = bool(uHasTex) ? texture2D(uSampler, vTexCoord) : vColor;

    // 自然光漫反射
    // vec3 ambient = uAmbientLight.rgb * oColor.rgb;
    vec3 ambient = ambientLightColor.rgb * oColor.rgb;

    // 由于经过了插值, 法线需要重新归一
    vec3 normal        = normalize(vNormal);
    vec3 pointLightDir = normalize(uPointLightPos - vPosition);
    // case: 反面无点光源漫反射
    float nDotL        = max(dot(pointLightDir, normal), 0.0);
    // case: 反面也有漫反射
    // float nDotL        = abs(dot(pointLightDir, normal));
    // 点光源漫反射
    // vec3 diffuse = uPointLightColor.rgb * oColor.rgb * nDotL;
    vec3 diffuse = pointLightColor.rgb * oColor.rgb * nDotL;

    vec3 viewDir = normalize(uViewPos - vPosition);

    // Blinn-Phong 着色, 相对于Phong性能更高, 更均匀
    vec3 halfwayDir = normalize(pointLightDir + viewDir);
    // case: 反面无高光
    float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    // case: 反面有高光
    // float spec = pow(abs(dot(normal, halfwayDir)), uShininess);

    // Phong 着色, 更真实?
    // // vec3 reflectanceRay = 2.0 * dot(normal, pointLightDir) * normal - pointLightDir;
    // vec3 reflectanceRay = reflect(-pointLightDir, normal);
    // float spec = 0.0;
    // if(nDotL > 0.0)
    // {
    //     spec = pow(max(dot(reflectanceRay, viewDir), 0.0), uShininess); // !!!KEY
    // }
    // vec3 specular = uPointLightColor.rgb * spec;
    vec3 specular = pointLightColor.rgb * spec * visibilityHightLight;
    gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
    // gl_FragColor = oColor;
}
