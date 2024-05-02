// Greyscale shader
precision mediump float;

varying vec2 outTexCoord;
uniform sampler2D uSampler;

void main(void)
{
    vec4 color = texture2D(uSampler, outTexCoord);
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    gl_FragColor = vec4(vec3(gray), color.a);
}
