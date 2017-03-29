float unpackDepth(const in vec4 rgbaDepth) {
  const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0*256.0), 1.0/(256.0*256.0*256.0));
  float depth = dot(rgbaDepth, bitShift); // Use dot() since the calculations is same
  return depth;
}

float getVisibility(const in samplerCube shadowMap, in vec3 dir) {
    vec4 rgbaDepth = textureCube(uShadowMap, dir);
    float closestDepth = unpackDepth(rgbaDepth);
    bool visibility = closestDepth + 0.0018 > (length(dir) / 50.0);
    return visibility ? 1.0 : 0.0;
}

float getVisibilityAround(const in samplerCube shadowMap, in vec3 dir, in float compareDepth) {
    vec4 rgbaDepth = textureCube(uShadowMap, dir);
    float closestDepth = unpackDepth(rgbaDepth);
    if(abs(closestDepth - compareDepth) > 0.01) {
        return 2.0;
    }
    bool visibility = closestDepth + 0.0018 > (length(dir) / 50.0);
    return visibility ? 2.0 : 0.0;
}

// 模糊半径
const float BLUR_R = 2.0;



void main() {
    // array of offset direction for sampling
    vec3 gridSamplingDisk[20];
    gridSamplingDisk[0] = vec3(1.0, 1.0, 1.0);
    gridSamplingDisk[1] = vec3(1.0, -1.0, 1.0);
    gridSamplingDisk[2] = vec3(-1.0, -1.0, 1.0);
    gridSamplingDisk[3] = vec3(-1.0, 1.0, 1.0);

    gridSamplingDisk[4] = vec3(1.0, 1.0, -1.0);
    gridSamplingDisk[5] = vec3(1.0, -1.0, -1.0);
    gridSamplingDisk[6] = vec3(-1.0, -1.0, -1.0);
    gridSamplingDisk[7] = vec3(-1.0, 1.0, -1.0);

    gridSamplingDisk[8] = vec3(1.0, 1.0, 0.0);
    gridSamplingDisk[9] = vec3(1.0, -1.0, 0.0);
    gridSamplingDisk[10] = vec3(1.0, -1.0, 0.0);
    gridSamplingDisk[11] = vec3(-1.0, -1.0, 0.0);

    gridSamplingDisk[12] = vec3(0.0, 1.0, 1.0);
    gridSamplingDisk[13] = vec3(0.0, -1.0, 1.0);
    gridSamplingDisk[14] = vec3(0.0, -1.0, -1.0);
    gridSamplingDisk[15] = vec3(0.0, 1.0, -1.0);

    vec3 dir = vPosition.xyz - uPointLightPos.xyz;
    float far_plane = 100.0;
    float view_dis = length(uViewPos - vPosition);
    float ra = (1.0 + (view_dis / far_plane)) / 40.0;
    // float ra = 25.0 / far_plane / length(dir) ;
    // float ra = 1.0 / 30.0;
    // 生成一个垂直于这个方向的向量
    vec3 helperDir = dir + vec3(-dir.y, dir.z, -dir.x); // 初步验算这个应该既不会和dir重合也不会为0
    vec3 perDirA = normalize(cross(dir, helperDir)) * ra;
    vec3 perDirB = normalize(cross(dir, perDirA)) * ra;
    // vec3 perDirA = normalize(cross(dir, helperDir)) / 200.0 * length(dir);
    // vec3 perDirB = normalize(cross(dir, perDirA)) / 200.0 * length(dir);

    float visibility = getVisibility(uShadowMap, dir);
    // float visibility = 0.0;
    if(visibility < 0.999) { // 阴影内, 光照范围内可以不用计算, 以节约性能

        float compareDepth = unpackDepth(textureCube(uShadowMap, dir));
        // float ra = 1.0 / 50.0;
        for(float i = 0.0; i < 16.0; i++)
        {
            // visibility += getVisibility(uShadowMap, dir + gridSamplingDisk[int(i)] * ra);
            visibility += getVisibilityAround(uShadowMap, dir + gridSamplingDisk[int(i)] * ra, compareDepth);
        }
        visibility /= 16.0;

        // // compareDepth = 10.0;
        // for(float i = 0.0; i < BLUR_R + 0.1; i++)
        // {
        //     // 八个方向的取样点
        //     visibility += getVisibilityAround(uShadowMap, dir + i * (perDirA), compareDepth);
        //     visibility += getVisibilityAround(uShadowMap, dir + i * (perDirB), compareDepth);
        //     visibility += getVisibilityAround(uShadowMap, dir + i * (perDirA + perDirB), compareDepth);
        //     visibility += getVisibilityAround(uShadowMap, dir + i * (perDirA - perDirB), compareDepth);
        //     visibility += getVisibilityAround(uShadowMap, dir - i * (perDirA), compareDepth);
        //     visibility += getVisibilityAround(uShadowMap, dir - i * (perDirB), compareDepth);
        //     visibility += getVisibilityAround(uShadowMap, dir - i * (perDirA + perDirB), compareDepth);
        //     visibility += getVisibilityAround(uShadowMap, dir - i * (perDirA - perDirB), compareDepth);
        // }
        // visibility /= 8.0 * BLUR_R + 1.0;


    }
    visibility = min(visibility, 1.0);

    float visibilityPointLight = visibility;
    float visibilityHightLight = visibility;

    vec4 ambientLightColor = uAmbientLight;
    vec4 oColor = texture2D(uSampler, vTexCoord);

    vec3 ambient = ambientLightColor.rgb * oColor.rgb;
    // 由于经过了插值, 法线需要重新归一
    vec3 normal = normalize(vNormal);


    vec3 pointLightDir = normalize(uPointLightPos - vPosition);
    float nDotL = max(dot(pointLightDir, normal), 0.0);

    vec3 viewDir = normalize(uViewPos - vPosition);
    // Phong 着色, 更真实
    vec3 reflectanceRay = reflect(-pointLightDir, normal);

    vec4 pointLightColor = uPointLightColor * visibilityPointLight;

    vec3 diffuse = pointLightColor.rgb * oColor.rgb * nDotL;
    float spec = pow(max(dot(reflectanceRay, viewDir), 0.0), uShininess);

    vec3 specular = pointLightColor.rgb * spec * visibilityHightLight;

    gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
}
