varying vec2 vUv;
varying float displacement;


void main() {
	float normalizedDisplacement = normalize(displacement);
	gl_FragColor = vec4(vUv*1.5, 1., 1.);
}