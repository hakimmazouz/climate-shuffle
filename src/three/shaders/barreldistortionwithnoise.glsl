uniform float distortion;
uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform float iTime;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec2 barrelDistortion(vec2 coord, float amt) {
	vec2 cc = coord - 0.5;
	float dist = dot(cc, cc);
	//return coord + cc * (dist*dist)  * amt;
	return coord + cc * dist * amt;

}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	// vec2 uv=(fragCoord/iResolution.xy);

	vec2 uv=(fragCoord/iResolution.xy*.75)+.125;
	//uv.y +=.1;
	vec4 a1=texture2D(iChannel0, barrelDistortion(uv,0.0));
	vec4 a2=texture2D(iChannel0, barrelDistortion(uv,-0.2));
	vec4 a3=texture2D(iChannel0, barrelDistortion(uv,-0.4));
	vec4 a4=texture2D(iChannel0, barrelDistortion(uv,-0.6));
	
	vec4 a5=texture2D(iChannel0, barrelDistortion(uv,-0.8));
	vec4 a6=texture2D(iChannel0, barrelDistortion(uv,-1.0));
	vec4 a7=texture2D(iChannel0, barrelDistortion(uv,-1.2));
	vec4 a8=texture2D(iChannel0, barrelDistortion(uv,-1.4));
	
	vec4 a9=texture2D(iChannel0, barrelDistortion(uv,-1.6));
	vec4 a10=texture2D(iChannel0, barrelDistortion(uv,-1.8));
	vec4 a11=texture2D(iChannel0, barrelDistortion(uv,-2.0));
	vec4 a12=texture2D(iChannel0, barrelDistortion(uv,-2.2));

	vec4 tx=(a1+a2+a3+a4+a5+a6+a7+a8+a9+a10+a11+a12)/12.;
	fragColor = vec4(tx.rgb,1.);
}

void main() {
	mainImage(gl_FragColor, gl_FragCoord.xy);
}
