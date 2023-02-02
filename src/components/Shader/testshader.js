const vertex = /* glsl */ `

precision mediump float;

uniform vec3 iResolution;           // viewport resolution (in pixels)
uniform float     iTime;     

void main (  )
{
    // Output to screen
    vec2 uv = gl_FragCoord.xy / iResolution.xy;

    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));

    gl_FragColor = vec4(col , 1.0);
}
`;

export default vertex;
