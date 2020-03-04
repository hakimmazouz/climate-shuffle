#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision highp float;
varying vec2 vUv;
uniform sampler2D map;
varying float depth;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  // This is the code that comes to produce msdf
  vec3 sample = texture2D(map, vUv).rgb;
  float sigDist = median(sample.r, sample.g, sample.b) - 0.5;
  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);

  vec3 color = vec3(1., 1., 1.);
//   color *= (depth + 0.75);

  gl_FragColor = vec4(color, alpha);
}