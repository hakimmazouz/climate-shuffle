#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

precision highp float;
varying vec2 vUv;
uniform sampler2D map;
uniform float progress;
uniform float selected;
varying float depth;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}
float mapRange(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  // This is the code that comes to produce msdf
  vec3 sample = texture2D(map, vUv).rgb;
  float sigDist = median(sample.r, sample.g, sample.b) - 0.5;
  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
  float alphaTest = 0.00001;
  if (alpha < alphaTest) { discard; }

  vec3 color = vec3(1., 1., 1.);
  // color *= depth+0.5;

  alpha *= depth;
  alpha *= progress;
  alpha -= 0.5 * progress;
  // alpha += selected;
  // alpha *= mapRange(progress, 0., 0.25, 0., 1.);


  gl_FragColor = vec4(color, alpha);
}