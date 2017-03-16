precision mediump float;

varying vec3 normalInterp;  // Surface normal
varying vec3 vertPos;       // Vertex position

float Ka = 1.0;   // Ambient reflection coefficient
float Kd = 1.0;   // Diffuse reflection coefficient
float Ks = 1.0;   // Specular reflection coefficient
uniform float shininessVal; // Shininess

// Material color
// uniform vec3 ambientColor;
// uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 uViewpos;

uniform vec3 lightPos; // Light position

void main() {
  vec3 N = normalize(normalInterp);
  vec3 L = normalize(lightPos - vertPos);

  // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);

  float specular = 0.0;

  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N);      // Reflected light vector
    vec3 V = normalize(uViewpos-vertPos); // Vector to viewer

    // Compute the specular term
    float specAngle = max(dot(R, V), 0.0);
    specular = pow(specAngle, shininessVal);
    specular = 0.5;
  }
  // gl_FragColor = vec4(vec3(200000000000000000000.2, 20.2, 20.2) + Ks * specular * specularColor, 1.0);
  // gl_FragColor = vec4(Ks * specular * specularColor, 1.0);
  gl_FragColor = vec4(vertPos, 1.0);
}
