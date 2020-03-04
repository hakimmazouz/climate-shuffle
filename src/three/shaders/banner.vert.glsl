
attribute vec2 uv;
attribute vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;
varying float displacement;
uniform float time;
uniform float offset;
varying float depth;

void main() {

  // vUv = uv;
  // displacement = sin(uv.x*30.0 + time + offset) * 0.05;
  // displacement += cos(uv.y*50.0 + time + offset) * 0.1;

  // gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xy, position.z + displacement, 1.0 );


  vUv = uv;

  vec3 p = position.xyz;

  float freq = 0.025;
  float amp = .5;

  p.z += (sin(p.x * freq + time) * 0.5 + 0.5) * amp;
  depth = p.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}