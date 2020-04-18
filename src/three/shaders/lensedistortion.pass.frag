#include <common>
varying vec2 vUvR;
varying vec2 vUvB;
uniform vec2 resolution;
uniform sampler2D inputBuffer;
uniform float distortion;

void mainImage(const in vec2 uv, out vec4 outputColor) {
	float uva = atan(uv.x, uv.y);
	float uvd = sqrt(dot(uv, uv));
	uvd = uvd*(1.0 + distortion*uvd*uvd);

	// outputColor = texture2D(inputBuffer, (uv+0.5)*uvd);
	vec4 color = texture2D(inputBuffer, vec2(0.5) + vec2(sin(uva), cos(uva))*uvd);
	// vec2 ra = texture2D(inputBuffer, vUvR).ra;
	// vec2 ba = texture2D(inputBuffer, vUvB).ba;

	// color.r = ra.x;
	// color.b = ba.x;
	// color.a = max(max(ra.y, ba.y), color.a);
	// color.r = refract(uv, resolution) - 0.1;
	outputColor = color;
	// outputColor = inputColor;
	// outputColor = vec4(texture2D(inputBuffer, vec2(0.5) + vec2(sin(uva), cos(uva))*uvd).rgb, .0);
}

void main() {
	mainImage((gl_FragCoord.xy/resolution) * 0.8 - 0.4, gl_FragColor);
}