uniform float distortion;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
	vec2 scaledUv = uv * 0.8 - .4;
	float uva = atan(scaledUv.x, scaledUv.y);
	float uvd = sqrt(dot(scaledUv, scaledUv));
	uvd = uvd*(1.0 + distortion*uvd*uvd);

	// outputColor = texture2D(inputBuffer, (uv+0.5)*uvd);
	outputColor = texture2D(inputBuffer, vec2(0.5) + vec2(sin(uva), cos(uva))*uvd);
	// outputColor = inputColor;
	// outputColor = vec4(texture2D(inputBuffer, vec2(0.5) + vec2(sin(uva), cos(uva))*uvd).rgb, .0);
}