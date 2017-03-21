// phong
void main() {

    vec4 oColor = texture2D(uSampler, vTexCoord);

    // 自然光漫反射
    vec3 ambient = uAmbientLight.rgb * oColor.rgb;

    // 由于经过了插值, 法线需要重新归一
    vec3 normal        = normalize(vNormal);
    vec3 pointLightDir = normalize(uPointLightPos - vPosition);
    float nDotL        = max(dot(pointLightDir, normal), 0.0);
    // 点光源漫反射
    vec3 diffuse = uPointLightColor.rgb * oColor.rgb * nDotL;

    vec3 viewDir = normalize(uViewPos - vPosition);

    // Blinn-Phong 着色, 相对于Phong性能更高, 更均匀
    vec3 halfwayDir = normalize(pointLightDir + viewDir);
    float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
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
}
