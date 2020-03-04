
#include <common>
uniform vec3 iResolution;
uniform sampler2D iChannel0;
uniform float distortion;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = (fragCoord.xy / iResolution.xy * .8) - .4;
	float uva = atan(uv.x, uv.y);
	float uvd = sqrt(dot(uv, uv));
	uvd = uvd*(1.0 + distortion*uvd*uvd);

	fragColor = texture2D(iChannel0, vec2(0.5) + vec2(sin(uva), cos(uva))*uvd);
}

void main() {
	mainImage(gl_FragColor, gl_FragCoord.xy);
}