// phong
void main() {

    // NOTE: 为了让他不去尝试获取uSampler和vTexCoord
    // 出此下策
    vec4 oColor = texture2D(uSampler, vTexCoord);
    // false && bool(oColor = texture2D(uSampler, vTexCoord));
    // oColor = texture2D(uSampler, vTexCoord)
    // vec4 oColor = bool(uHasTex) ? texture2D(uSampler, vTexCoord) : vColor;

    // 自然光漫反射
    vec3 ambient = uAmbientLight.rgb * oColor.rgb;

    // 由于经过了插值, 法线需要重新归一
    vec3 normal        = normalize(vNormal);
    vec3 pointLightDir = normalize(uPointLightPos - vPosition);
    // case: 反面无点光源漫反射
    // float nDotL        = max(dot(pointLightDir, normal), 0.0);
    // case: 反面也有漫反射
    float nDotL        = abs(dot(pointLightDir, normal));
    // 点光源漫反射
    vec3 diffuse = uPointLightColor.rgb * oColor.rgb * nDotL;

    vec3 viewDir = normalize(uViewPos - vPosition);

    // Blinn-Phong 着色, 相对于Phong性能更高, 更均匀
    vec3 halfwayDir = normalize(pointLightDir + viewDir);
    // case: 反面无高光
    // float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    // case: 反面有高光
    float spec = pow(abs(dot(normal, halfwayDir)), uShininess);

    // Phong 着色, 更真实?
    // // vec3 reflectanceRay = 2.0 * dot(normal, pointLightDir) * normal - pointLightDir;
    // vec3 reflectanceRay = reflect(-pointLightDir, normal);
    // float spec = 0.0;
    // if(nDotL > 0.0)
    // {
    //     spec = pow(max(dot(reflectanceRay, viewDir), 0.0), uShininess); // !!!KEY
    // }
    vec3 specular = uPointLightColor.rgb * spec;
    gl_FragColor = vec4(diffuse + ambient + specular, 1.0);
    // gl_FragColor = oColor;
}
