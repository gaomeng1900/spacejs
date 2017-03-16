precision mediump float;
varying vec4 vColor;
varying vec3 vNormal;
varying vec3 vPosition;

// uniform vec3 uLightDirection;
// uniform vec4 uLightColor;
uniform vec4 uAmbientLight;
uniform vec3 uPointLightPos;
uniform vec4 uPointLightColor;

// 镜面反射
uniform float uShininess;
uniform vec3  uViewPos;

// phong
void main() {
    vec3 specularColor = vec3(1.0, 1.0, 1.0);
    float shininessVal = 11.0;
    float Ks = 1.0;

    vec3 N = normalize(vNormal);
    vec3 L = normalize(uPointLightPos - vPosition);

    // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);

    float specular = 0.0;

    if(lambertian > 0.0) {
      vec3 R = reflect(-L, N);      // Reflected light vector
      vec3 V = normalize(uViewPos - vPosition); // Vector to viewer

      // Compute the specular term
      float specAngle = max(dot(R, V), 0.0);
      specular = pow(specAngle, shininessVal);
    }


    vec3 ambient = uAmbientLight.rgb * vColor.rgb;
    gl_FragColor = vec4(Ks * specular * specularColor + ambient, 1.0);


    // vec3 normal = normalize(vNormal);
    // vec3 pointLightDir = normalize(uPointLightPos - vPosition);
    // vec3 viewDir = normalize(uViewPos - vPosition);
    //
    // vec3 halfwayDir = normalize(pointLightDir + viewDir);
    // float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
    // vec3 specular = uPointLightColor.rgb * spec;
    //
    // // vec3 reflectanceRay = 2.0 * dot(normal, pointLightDir) * normal - pointLightDir;
    // // float spec = pow(dot(reflectanceRay, viewDir), uShininess);
    // // vec3 specular = uPointLightColor.rgb * spec;
    //
    // // float nDotL = max(dot(pointLightDir, normal), 0.0);
    // // vec3 diffuse = uPointLightColor.rgb * vColor.rgb * nDotL;
    // // gl_FragColor = vec4(diffuse + ambient, 1.0);
    // gl_FragColor = vec4(specular, 1.0);
}
