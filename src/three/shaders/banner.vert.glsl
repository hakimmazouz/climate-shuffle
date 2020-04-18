
attribute vec2 uv;
attribute vec4 position;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float time;
uniform float width;
uniform float progress;
uniform float selected;

varying vec2 vUv;
varying float displacement;
uniform float offset;
varying float depth;

void main() {

  // vUv = uv;
  // displacement = sin(uv.x*30.0 + time + offset) * 0.05;
  // displacement += cos(uv.y*50.0 + time + offset) * 0.1;

  // gl_Position = projectionMatrix * modelViewMatrix * vec4( position.xy, position.z + displacement, 1.0 );


  vUv = uv;

  vec3 p = position.xyz;

  float freq = 0.02;
  float amp = .2;

  p.z += (sin(p.x * freq + time) * 0.5 + 0.5) * amp * (0.25 + selected);
  p.z += (cos(p.y * freq + time) * 0.5 + 0.5) * amp * (0.25 + selected);
  float leftEdge = width*progress;
  float rightEdge = width*progress + width*0.33;
  p.z += clamp(smoothstep(rightEdge, leftEdge, p.x), 0., 1.);
  p.z -= 0.5;
  p.z += selected * 0.6;
  depth = p.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}

