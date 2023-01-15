export const FRAG_SHADER = `
precision mediump float;

uniform vec3      iResolution;           // viewport resolution (in pixels)
uniform float     iTime;                 // shader playback time (in seconds)

const float cloudscale = 1.1;
const float speed = 0.05;
const float clouddark = 0.1;
const float cloudlight = 0.01;
const float cloudcover = 0.1;
const float cloudalpha = 12.0;
const float skytint = 0.8;
const vec3 skycolour1 = vec3(0,0,0);
const vec3 skycolour2 = vec3(0,0,0);

const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );

vec2 hash( vec2 p ) {
	p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float hash12(vec2 pos) {
	vec3 p3  = fract(vec3(pos.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float noise( in vec2 p ) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
	vec2 i = floor(p + (p.x+p.y)*K1);	
    vec2 a = p - i + (i.x+i.y)*K2;
    vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
    vec2 b = a - o + K2;
	vec2 c = a - 1.0 + 2.0*K2;
    vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
	vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot(n, vec3(70.0));	
}

float fbm(vec2 n) {
	float total = 0.0, amplitude = 0.1;
	for (int i = 0; i < 7; i++) {
		total += noise(n) * amplitude;
		n = m * n;
		amplitude *= 0.4;
	}
	return total;
}

float hash13(vec3 p3) {
	p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

vec3 hash33(vec3 p3) {
    p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yxx) * p3.zyx);
}

vec3 colorednoise(vec2 coord, float n) {
  vec3 componenta = hash33(vec3(coord, floor(n - 0.5)));
  vec3 componentb = hash33(vec3(coord, floor(n + 0.5)));
  vec3 componentc = mix(componenta, componentb, mod(n, 1.0));
  return componentc;
}

vec3 blackbody(float temperature) {
  vec3 O = vec3(0.0);

  for(float i = 0.0; i < 3.0; i += 0.1) {
      float f = 1.0 + 0.5 * i;

      O[int(i)] += 10.0 * (f * f * f) / (exp((19e3 * f / temperature)) - 1.0);
  }

  return O;
}

float noise(vec2 coord, float n) {
  float componenta = hash13(vec3(coord, floor(n - 0.5)));
  float componentb = hash13(vec3(coord, floor(n + 0.5)));
  float componentc = mix(componenta, componentb, mod(n, 1.0));
  return componentc;
}


vec3 stars(vec2 coord) {
  float luminance = max(0.0, (hash12(coord) - 0.985));
  float temperature = (hash12(coord + iResolution.xy) * 6000.0) + 4000.0;
  vec3 colorshift = normalize(colorednoise(coord, float(iTime * 16.0)));
  return (luminance * noise(coord, iTime * 4.0)) * blackbody(temperature) * 4.0 * (colorshift * 0.5 + 1.0);
}

// -----------------------------------------------

void main(  ) {
    vec2 p = gl_FragCoord.xy / iResolution.xy;
    vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);    
    float time = iTime * speed;
    float q = fbm(uv * cloudscale * 0.5);
    
    //ridged noise shape
    float r = 0.0;
    uv *= cloudscale;
    uv -= q - time;
    float weight = 0.8;
    for (int i=0; i<8; i++){
    r += abs(weight*noise( uv ));
        uv = m*uv + time;
    weight *= 0.7;
    }
    
    //noise shape
    float f = 0.0;
    uv = p*vec2(iResolution.x/iResolution.y,1.0);
    uv *= cloudscale;
    uv -= q - time;
    weight = 0.7;
    for (int i=0; i<8; i++){
        f += weight*noise( uv );
        uv = m*uv + time;
        weight *= 0.6;
    }
    
    f *= r + f;
    
    //noise colour
    float c = 0.0;
    time = iTime * speed * 2.0;
    uv = p*vec2(iResolution.x/iResolution.y,1.0);
    uv *= cloudscale*2.0;
    uv -= q - time;
    weight = 0.4;
    for (int i=0; i<7; i++){
        c += weight*noise( uv );
        uv = m*uv + time;
        weight *= 0.6;
    }
    
    //noise ridge colour
    float c1 = 0.0;
    time = iTime * speed * 3.0;
    uv = p*vec2(iResolution.x/iResolution.y,1.0);
    uv *= cloudscale*3.0;
    uv -= q - time;
    weight = 0.4;
    for (int i=0; i<7; i++){
        c1 += abs(weight*noise( uv ));
        uv = m*uv + time;
        weight *= 0.6;
    }
    
    c += c1;
    
    vec3 skycolour = mix(skycolour2, skycolour1, p.y);
    vec3 cloudcolour = vec3(1.1, 1.1, 0.9) * clamp((clouddark + cloudlight*c), 0.0, 1.0);
   
    f = cloudcover + cloudalpha*f*r;

    vec3 star = stars(gl_FragCoord.xy);

    vec3 result =  star + mix(skycolour, clamp(skytint * skycolour + cloudcolour, 0.0, 1.0), clamp(f + c, 0.0, 1.0));
    
    gl_FragColor = vec4(result, 1.0 );
}
`;
