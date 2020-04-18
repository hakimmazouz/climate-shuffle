varying vec2 vUvR;
varying vec2 vUvB;

void main() {
	vec2 offset = vec2(0.1);
	vUvR = uv + offset;
	vUvB = uv - offset;

	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}