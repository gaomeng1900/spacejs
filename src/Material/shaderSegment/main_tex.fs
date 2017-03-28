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
    bool visibility = depth + 0.001 > shadowCoord.z;
    float visibilityPointLight = visibility ? 1.0 : 0.2;
    float visibilityHightLight = visibility ? 1.0 : 0.0;
    return vec2(visibilityPointLight, visibilityHightLight);
}

vec2 getVisibility(const in sampler2D shadowMap, in vec4 posFromLight) {
    vec3 shadowCoord = (posFromLight.xyz/posFromLight.w)/2.0 + 0.5;
    // 不在当前阴影贴图范围的就不要计算
    if(shadowCoord.x > 1.0 || shadowCoord.y > 1.0 || shadowCoord.x < 0.0 || shadowCoord.y < 0.0 || shadowCoord.z < 0.0 || shadowCoord.z > 1.0)
    {
        return vec2(0.0, 0.0);
    } else {
        vec4 rgbaDepth = texture2D(shadowMap, shadowCoord.xy);
        float depth = unpackDepth(rgbaDepth); // Retrieve the z-value from R
        bool visibility = depth + 0.001 > shadowCoord.z;
        float visibilityPointLight;
        float visibilityHightLight;
        // NOTE: 目前做模糊的时候, 取样点是*在lightView坐标系下周边的点*
        // 优点是能实现离光源越远越模糊
        if(!visibility){
        // if(true){
            vec2 visi = vec2(0.0, 0.0);
            for(float i = -1.0; i <= 1.0; i++)
            {
                for(float j = -1.0; j <= 1.0; j++)
                {
                    visi += getVisibilityFromMap(shadowMap, shadowCoord, vec2(0.001 * i, 0.001 * j), depth) / 9.0;
                }
            }

            // NOTE: 考虑到只对阴影进行模糊, 会使模糊之后的边缘依然比较明显
            // 因此这里要把边缘弄成亮的

            // visibilityPointLight = smoothstep(0.1, 1.0, visi.x);
            // visibilityHightLight = smoothstep(0.1, 1.0, visi.y);
            visibilityPointLight = min(visi.x, 1.0);
            visibilityHightLight = min(visi.y, 1.0);
            // visibilityPointLight = 0.2;
            // visibilityHightLight = 0.2;

        } else {
            visibilityPointLight = 1.0;
            visibilityHightLight = 1.0;
        }


        return vec2(visibilityPointLight, visibilityHightLight);
        // return vec2(0.0, 0.0);
    }
}

vec2 getVisibilityAll() {
    vec2 visibilities = getVisibility(uShadowMap0, vPosFromLight0);
    visibilities += getVisibility(uShadowMap1, vPosFromLight1);
    visibilities += getVisibility(uShadowMap2, vPosFromLight2);
    visibilities += getVisibility(uShadowMap3, vPosFromLight3);
    visibilities += getVisibility(uShadowMap4, vPosFromLight4);
    visibilities += getVisibility(uShadowMap5, vPosFromLight5);
    return vec2(min(visibilities.x, 1.0), min(visibilities.y, 1.0)); // 两个光线视锥的相交处会过亮
}



// phong
void main() {
    // vec2 visibilities = getVisibility(uShadowMap, vPosFromLight);
    // vec2 visibilities = getVisibility(uShadowMap0, vPosFromLight0);
    // visibilities += getVisibility(uShadowMap1, vPosFromLight1);
    // visibilities += getVisibility(uShadowMap2, vPosFromLight2);
    // visibilities += getVisibility(uShadowMap3, vPosFromLight3);
    // visibilities += getVisibility(uShadowMap4, vPosFromLight4);
    // visibilities += getVisibility(uShadowMap5, vPosFromLight5);
    vec2 visibilities = getVisibilityAll();
    float visibilityPointLight = visibilities.x; // 两个光线视锥的相交处会过亮
    float visibilityHightLight = visibilities.y;

    // vec3 shadowCoord = (vPosFromLight.xyz/vPosFromLight.w)/2.0 + 0.5;
    // vec4 rgbaDepth = texture2D(uShadowMap, shadowCoord.xy);
    // float depth = unpackDepth(rgbaDepth); // Retrieve the z-value from R
    // bool visibility = depth + 0.001 > shadowCoord.z;
    // float visibilityPointLight;
    // float visibilityHightLight;
    // if(!visibility){
    // // if(true){
    //     // 阴影部分进行模糊采样
    //     // vec4 rgbaDepth0 = texture2D(uShadowMap, shadowCoord.xy + vec2(-0.001, -0.001));
    //     // vec4 rgbaDepth1 = texture2D(uShadowMap, shadowCoord.xy + vec2(0.001, -0.001));
    //     // vec4 rgbaDepth2 = texture2D(uShadowMap, shadowCoord.xy + vec2(-0.001, 0.001));
    //     // vec4 rgbaDepth3 = texture2D(uShadowMap, shadowCoord.xy + vec2(0.001, 0.001));
    //     // float depth0 = unpackDepth(texture2D(uShadowMap, shadowCoord.xy + vec2(-0.002, -0.002)));
    //     // bool visibility0 = depth0 + 0.001 > shadowCoord.z;
    //     // float visibilityPointLight0 = visibility0 ? 1.0 : 0.7;
    //     // float visibilityHightLight0 = visibility0 ? 1.0 : 0.1;
    //
    //
    //     vec2 visi = vec2(0.0, 0.0);
    //     for(float i = -2.0; i <= 2.0; i++)
    //     {
    //         for(float j = -2.0; j <= 2.0; j++)
    //         {
    //             visi += getVisibility(uShadowMap, shadowCoord, vec2(0.001 * i, 0.001 * j)) / 25.0;
    //         }
    //     }
    //
    //     // NOTE: 考虑到只对阴影进行模糊, 会使模糊之后的边缘依然比较明显
    //     // 因此这里要把边缘弄成亮的
    //
    //
    //
    //     // visibilityPointLight = smoothstep(0.1, 1.0, visi.x);
    //     // visibilityHightLight = smoothstep(0.1, 1.0, visi.y);
    //     visibilityPointLight = min(visi.x, 1.0);
    //     visibilityHightLight = min(visi.y, 1.0);
    //
    //     // vec2 visi0 = getVisibility(uShadowMap, shadowCoord, vec2(-0.001, -0.001)) * 0.9;
    //     // vec2 visi1 = getVisibility(uShadowMap, shadowCoord, vec2(-0.001, 0.0));
    //     // vec2 visi2 = getVisibility(uShadowMap, shadowCoord, vec2(-0.001, 0.001)) * 0.9;
    //     // vec2 visi3 = getVisibility(uShadowMap, shadowCoord, vec2(0.0, -0.001));
    //     // vec2 visi4 = getVisibility(uShadowMap, shadowCoord, vec2(0.0, 0.001));
    //     // vec2 visi5 = getVisibility(uShadowMap, shadowCoord, vec2(0.001, -0.001)) * 0.9;
    //     // vec2 visi6 = getVisibility(uShadowMap, shadowCoord, vec2(0.001, 0.0));
    //     // vec2 visi7 = getVisibility(uShadowMap, shadowCoord, vec2(0.001, +0.001)) * 0.9;
    //     // vec2 visi8 = vec2(visibility ? 1.0 : 0.7, visibility ? 1.0 : 0.1) * 1.4;
    //     //
    //     // float depth1 = unpackDepth(texture2D(uShadowMap, shadowCoord.xy + vec2(0.002, -0.002)));
    //     // bool visibility1 = depth1 + 0.001 > shadowCoord.z;
    //     // float visibilityPointLight1 = visibility1 ? 1.0 : 0.7;
    //     // float visibilityHightLight1 = visibility1 ? 1.0 : 0.1;
    //
    //     // float depth2 = unpackDepth(texture2D(uShadowMap, shadowCoord.xy + vec2(-0.002, 0.002)));
    //     // bool visibility2 = depth2 + 0.001 > shadowCoord.z;
    //     // float visibilityPointLight2 = visibility2 ? 1.0 : 0.7;
    //     // float visibilityHightLight2 = visibility2 ? 1.0 : 0.1;
    //
    //     // float depth3 = unpackDepth(texture2D(uShadowMap, shadowCoord.xy + vec2(0.002, 0.002)));
    //     // bool visibility3 = depth3 + 0.001 > shadowCoord.z;
    //     // float visibilityPointLight3 = visibility3 ? 1.0 : 0.7;
    //     // float visibilityHightLight3 = visibility3 ? 1.0 : 0.1;
    //
    //     // visibilityPointLight = (visibilityPointLight0 +
    //     //                         visibilityPointLight1 +
    //     //                         visibilityPointLight2 +
    //     //                         visibilityPointLight3) /4.0;
    //     // visibilityHightLight = (visibilityHightLight0 +
    //     //                         visibilityHightLight1 +
    //     //                         visibilityHightLight2 +
    //     //                         visibilityHightLight3) /4.0;
    //     //
    //     // visibilityPointLight = (visi0.x +
    //     //                         visi1.x +
    //     //                         visi2.x +
    //     //                         visi3.x +
    //     //                         visi4.x +
    //     //                         visi5.x +
    //     //                         visi6.x +
    //     //                         visi7.x +
    //     //                         visi8.x) /9.0;
    //     // visibilityHightLight = (visi0.y +
    //     //                         visi1.y +
    //     //                         visi2.y +
    //     //                         visi3.y +
    //     //                         visi4.y +
    //     //                         visi5.y +
    //     //                         visi6.y +
    //     //                         visi7.y +
    //     //                         visi8.y) /9.0;
    // } else {
    //     visibilityPointLight = visibility ? 1.0 : 0.7;
    //     visibilityHightLight = visibility ? 1.0 : 0.0;
    // }

    vec4 ambientLightColor = uAmbientLight;
    vec4 pointLightColor = uPointLightColor * visibilityPointLight;
    // vec4 pointLightColor = uPointLightColor;

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
    float nDotL = max(dot(pointLightDir, normal), 0.0);
    vec3 diffuse = pointLightColor.rgb * oColor.rgb * nDotL;
    vec3 viewDir = normalize(uViewPos - vPosition);
    // Blinn-Phong 着色, 相对于Phong性能更高, 更均匀
    // TODO: 半程方向在背面可以看到
    // vec3 halfwayDir = normalize(pointLightDir + viewDir);
    // float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    // Phong 着色, 更真实
    vec3 reflectanceRay = reflect(-pointLightDir, normal);
    float spec = pow(max(dot(reflectanceRay, viewDir), 0.0), uShininess);

    vec3 specular = pointLightColor.rgb * spec * visibilityHightLight;

    // vec3 diffuse;
    // vec3 specular;
    // float nDotL = max(dot(pointLightDir, normal), 0.0);
    // vec3 viewDir = normalize(uViewPos - vPosition);
    // vec3 halfwayDir = normalize(pointLightDir + viewDir);
    // float nDotH = max(dot(normal, halfwayDir), 0.0);
    // if(nDotL == 0.0 && nDotH == 0.0)
    // {
    //     diffuse = vec3(0.0, 0.0, 0.0);
    //     specular = vec3(0.0, 0.0, 0.0);
    // }
    // else
    // {
    //     vec2 visibilities = getVisibilityAll();
    //     float visibilityPointLight = visibilities.x; // 两个光线视锥的相交处会过亮
    //     float visibilityHightLight = visibilities.y;
    //
    //     pointLightColor = uPointLightColor * visibilityPointLight;
    //     diffuse = pointLightColor.rgb * oColor.rgb * nDotL;
    //
    //     float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    //     specular = pointLightColor.rgb * spec * visibilityHightLight;
    // }

    // // case: 反面也有漫反射
    // // float nDotL        = abs(dot(pointLightDir, normal));
    // // 点光源漫反射
    // // vec3 diffuse = uPointLightColor.rgb * oColor.rgb * nDotL;
    // // vec3 diffuse = pointLightColor.rgb * oColor.rgb * nDotL;
    //
    // // case: 反面有高光
    // // float spec = pow(abs(dot(normal, halfwayDir)), uShininess);
    //
    // // Phong 着色, 更真实?
    // // // vec3 reflectanceRay = 2.0 * dot(normal, pointLightDir) * normal - pointLightDir;
    // // vec3 reflectanceRay = reflect(-pointLightDir, normal);
    // // float spec = 0.0;
    // // if(nDotL > 0.0)
    // // {
    // //     spec = pow(max(dot(reflectanceRay, viewDir), 0.0), uShininess); // !!!KEY
    // // }
    // // vec3 specular = uPointLightColor.rgb * spec;
    gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
    // gl_FragColor = oColor;
}
