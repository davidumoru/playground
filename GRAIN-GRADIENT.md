# Grain gradient

## grain-gradient.ts

```ts
import type { vec4 } from "../types.ts";
import type { ShaderMotionParams } from "../shader-mount.ts";
import {
  type ShaderSizingParams,
  type ShaderSizingUniforms,
} from "../shader-sizing.ts";
import {
  simplexNoise,
  declarePI,
  rotation2,
  textureRandomizerR,
  proceduralHash11,
} from "../shader-utils.ts";

export const grainGradientMeta = {
  maxColorCount: 7,
} as const;

/**
 * Multi-color gradients with grainy, noise-textured distortion available in 7 animated abstract forms.
 *
 * Note: grains are calculated using gl_FragCoord & u_resolution, meaning grains don't react to scaling and fit
 *
 * Fragment shader uniforms:
 * - u_time (float): Animation time
 * - u_resolution (vec2): Canvas resolution in pixels
 * - u_pixelRatio (float): Device pixel ratio
 * - u_originX (float): Reference point for positioning (0 to 1)
 * - u_originY (float): Reference point for positioning (0 to 1)
 * - u_worldWidth (float): Virtual width of the graphic
 * - u_worldHeight (float): Virtual height of the graphic
 * - u_fit (float): Fit mode (0 = none, 1 = contain, 2 = cover)
 * - u_scale (float): Overall zoom level (0.01 to 4)
 * - u_rotation (float): Rotation angle in degrees (0 to 360)
 * - u_offsetX (float): Horizontal offset (-1 to 1)
 * - u_offsetY (float): Vertical offset (-1 to 1)
 * - u_colorBack (vec4): Background color in RGBA
 * - u_colors (vec4[]): Up to 7 gradient colors in RGBA
 * - u_colorsCount (float): Number of active colors
 * - u_softness (float): Color transition sharpness, 0 = hard edge, 1 = smooth gradient (0 to 1)
 * - u_intensity (float): Distortion between color bands (0 to 1)
 * - u_noise (float): Grainy noise overlay (0 to 1)
 * - u_shape (float): Shape type (1 = wave, 2 = dots, 3 = truchet, 4 = corners, 5 = ripple, 6 = blob, 7 = sphere)
 * - u_noiseTexture (sampler2D): Pre-computed randomizer source texture
 *
 * Vertex shader outputs (used in fragment shader):
 * - v_objectUV (vec2): Object box UV coordinates with global sizing (scale, rotation, offsets, etc) applied (used for shapes 4-7)
 * - v_objectBoxSize (vec2): Size of the object bounding box in pixels
 * - v_patternUV (vec2): UV coordinates for pattern with global sizing (rotation, scale, offset, etc) applied (used for shapes 1-3)
 * - v_patternBoxSize (vec2): Size of the pattern bounding box in pixels
 *
 * Vertex shader uniforms:
 * - u_resolution (vec2): Canvas resolution in pixels
 * - u_pixelRatio (float): Device pixel ratio
 * - u_originX (float): Reference point for positioning world width in the canvas (0 to 1)
 * - u_originY (float): Reference point for positioning world height in the canvas (0 to 1)
 * - u_worldWidth (float): Virtual width of the graphic before it's scaled to fit the canvas
 * - u_worldHeight (float): Virtual height of the graphic before it's scaled to fit the canvas
 * - u_fit (float): How to fit the rendered shader into the canvas dimensions (0 = none, 1 = contain, 2 = cover)
 * - u_scale (float): Overall zoom level of the graphics (0.01 to 4)
 * - u_rotation (float): Overall rotation angle of the graphics in degrees (0 to 360)
 * - u_offsetX (float): Horizontal offset of the graphics center (-1 to 1)
 * - u_offsetY (float): Vertical offset of the graphics center (-1 to 1)
 *
 */

// language=GLSL
export const grainGradientFragmentShader: string = `#version 300 es
precision lowp float;

uniform mediump float u_time;
uniform mediump vec2 u_resolution;
uniform mediump float u_pixelRatio;

uniform sampler2D u_noiseTexture;

uniform vec4 u_colorBack;
uniform vec4 u_colors[${grainGradientMeta.maxColorCount}];
uniform float u_colorsCount;
uniform float u_softness;
uniform float u_intensity;
uniform float u_noise;
uniform float u_shape;

uniform mediump float u_originX;
uniform mediump float u_originY;
uniform mediump float u_worldWidth;
uniform mediump float u_worldHeight;
uniform mediump float u_fit;

uniform mediump float u_scale;
uniform mediump float u_rotation;
uniform mediump float u_offsetX;
uniform mediump float u_offsetY;

in vec2 v_objectUV;
in vec2 v_patternUV;
in vec2 v_objectBoxSize;
in vec2 v_patternBoxSize;

out vec4 fragColor;

${declarePI}
${simplexNoise}
${rotation2}
${textureRandomizerR}

float valueNoiseR(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = randomR(i);
  float b = randomR(i + vec2(1.0, 0.0));
  float c = randomR(i + vec2(0.0, 1.0));
  float d = randomR(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}
vec4 fbmR(vec2 n0, vec2 n1, vec2 n2, vec2 n3) {
  float amplitude = 0.2;
  vec4 total = vec4(0.);
  for (int i = 0; i < 3; i++) {
    n0 = rotate(n0, 0.3);
    n1 = rotate(n1, 0.3);
    n2 = rotate(n2, 0.3);
    n3 = rotate(n3, 0.3);
    total.x += valueNoiseR(n0) * amplitude;
    total.y += valueNoiseR(n1) * amplitude;
    total.z += valueNoiseR(n2) * amplitude;
    total.z += valueNoiseR(n3) * amplitude;
    n0 *= 1.99;
    n1 *= 1.99;
    n2 *= 1.99;
    n3 *= 1.99;
    amplitude *= 0.6;
  }
  return total;
}

${proceduralHash11}

vec2 truchet(vec2 uv, float idx){
  idx = fract(((idx - .5) * 2.));
  if (idx > 0.75) {
    uv = vec2(1.0) - uv;
  } else if (idx > 0.5) {
    uv = vec2(1.0 - uv.x, uv.y);
  } else if (idx > 0.25) {
    uv = 1.0 - vec2(1.0 - uv.x, uv.y);
  }
  return uv;
}

void main() {

  const float firstFrameOffset = 7.;
  float t = .1 * (u_time + firstFrameOffset);

  vec2 shape_uv = vec2(0.);
  vec2 grain_uv = vec2(0.);

  float r = u_rotation * PI / 180.;
  float cr = cos(r);
  float sr = sin(r);
  mat2 graphicRotation = mat2(cr, sr, -sr, cr);
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);

  if (u_shape > 3.5) {
    shape_uv = v_objectUV;
    grain_uv = shape_uv;

    // apply inverse transform to grain_uv so it respects the originXY
    grain_uv = transpose(graphicRotation) * grain_uv;
    grain_uv *= u_scale;
    grain_uv -= graphicOffset;
    grain_uv *= v_objectBoxSize;
    grain_uv *= .7;
  } else {
    shape_uv = .5 * v_patternUV;
    grain_uv = 100. * v_patternUV;

    // apply inverse transform to grain_uv so it respects the originXY
    grain_uv = transpose(graphicRotation) * grain_uv;
    grain_uv *= u_scale;
    if (u_fit > 0.) {
      vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
      givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
      float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
      vec2 patternBoxGivenSize = vec2(
      (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
      (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
      );
      patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;
      float patternBoxNoFitBoxWidth = patternBoxRatio * min(patternBoxGivenSize.x / patternBoxRatio, patternBoxGivenSize.y);
      grain_uv /= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
    }
    vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;
    grain_uv -= graphicOffset / patternBoxScale;
    grain_uv *= 1.6;
  }


  float shape = 0.;

  if (u_shape < 1.5) {
    // Sine wave

    float wave = cos(.5 * shape_uv.x - 4. * t) * sin(1.5 * shape_uv.x + 2. * t) * (.75 + .25 * cos(6. * t));
    shape = 1. - smoothstep(-1., 1., shape_uv.y + wave);

  } else if (u_shape < 2.5) {
    // Grid (dots)

    float stripeIdx = floor(2. * shape_uv.x / TWO_PI);
    float rand = hash11(stripeIdx * 100.);
    rand = sign(rand - .5) * pow(4. * abs(rand), .3);
    shape = sin(shape_uv.x) * cos(shape_uv.y - 5. * rand * t);
    shape = pow(abs(shape), 4.);

  } else if (u_shape < 3.5) {
    // Truchet pattern

    float n2 = valueNoiseR(shape_uv * .4 - 3.75 * t);
    shape_uv.x += 10.;
    shape_uv *= .6;

    vec2 tile = truchet(fract(shape_uv), randomR(floor(shape_uv)));

    float distance1 = length(tile);
    float distance2 = length(tile - vec2(1.));

    n2 -= .5;
    n2 *= .1;
    shape = smoothstep(.2, .55, distance1 + n2) * (1. - smoothstep(.45, .8, distance1 - n2));
    shape += smoothstep(.2, .55, distance2 + n2) * (1. - smoothstep(.45, .8, distance2 - n2));

    shape = pow(shape, 1.5);

  } else if (u_shape < 4.5) {
    // Corners

    shape_uv *= .6;
    vec2 outer = vec2(.5);

    vec2 bl = smoothstep(vec2(0.), outer, shape_uv + vec2(.1 + .1 * sin(3. * t), .2 - .1 * sin(5.25 * t)));
    vec2 tr = smoothstep(vec2(0.), outer, 1. - shape_uv);
    shape = 1. - bl.x * bl.y * tr.x * tr.y;

    shape_uv = -shape_uv;
    bl = smoothstep(vec2(0.), outer, shape_uv + vec2(.1 + .1 * sin(3. * t), .2 - .1 * cos(5.25 * t)));
    tr = smoothstep(vec2(0.), outer, 1. - shape_uv);
    shape -= bl.x * bl.y * tr.x * tr.y;

    shape = 1. - smoothstep(0., 1., shape);

  } else if (u_shape < 5.5) {
    // Ripple

    shape_uv *= 2.;
    float dist = length(.4 * shape_uv);
    float waves = sin(pow(dist, 1.2) * 5. - 3. * t) * .5 + .5;
    shape = waves;

  } else if (u_shape < 6.5) {
    // Blob

    t *= 2.;

    vec2 f1_traj = .25 * vec2(1.3 * sin(t), .2 + 1.3 * cos(.6 * t + 4.));
    vec2 f2_traj = .2 * vec2(1.2 * sin(-t), 1.3 * sin(1.6 * t));
    vec2 f3_traj = .25 * vec2(1.7 * cos(-.6 * t), cos(-1.6 * t));
    vec2 f4_traj = .3 * vec2(1.4 * cos(.8 * t), 1.2 * sin(-.6 * t - 3.));

    shape = .5 * pow(1. - clamp(0., 1., length(shape_uv + f1_traj)), 5.);
    shape += .5 * pow(1. - clamp(0., 1., length(shape_uv + f2_traj)), 5.);
    shape += .5 * pow(1. - clamp(0., 1., length(shape_uv + f3_traj)), 5.);
    shape += .5 * pow(1. - clamp(0., 1., length(shape_uv + f4_traj)), 5.);

    shape = smoothstep(.0, .9, shape);
    float edge = smoothstep(.25, .3, shape);
    shape = mix(.0, shape, edge);

  } else {
    // Sphere

    shape_uv *= 2.;
    float d = 1. - pow(length(shape_uv), 2.);
    vec3 pos = vec3(shape_uv, sqrt(max(d, 0.)));
    vec3 lightPos = normalize(vec3(cos(1.5 * t), .8, sin(1.25 * t)));
    shape = .5 + .5 * dot(lightPos, pos);
    shape *= step(0., d);
  }

  float baseNoise = snoise(grain_uv * .5);
  vec4 fbmVals = fbmR(
  .002 * grain_uv + 10.,
  .003 * grain_uv,
  .001 * grain_uv,
  rotate(.4 * grain_uv, 2.)
  );
  float grainDist = baseNoise * snoise(grain_uv * .2) - fbmVals.x - fbmVals.y;
  float rawNoise = .75 * baseNoise - fbmVals.w - fbmVals.z;
  float noise = clamp(rawNoise, 0., 1.);

  shape += u_intensity * 2. / u_colorsCount * (grainDist + .5);
  shape += u_noise * 10. / u_colorsCount * noise;

  float aa = fwidth(shape);

  shape = clamp(shape - .5 / u_colorsCount, 0., 1.);
  float totalShape = smoothstep(0., u_softness + 2. * aa, clamp(shape * u_colorsCount, 0., 1.));
  float mixer = shape * (u_colorsCount - 1.);

  int cntStop = int(u_colorsCount) - 1;
  vec4 gradient = u_colors[0];
  gradient.rgb *= gradient.a;
  for (int i = 1; i < ${grainGradientMeta.maxColorCount}; i++) {
    if (i > cntStop) break;

    float localT = clamp(mixer - float(i - 1), 0., 1.);
    localT = smoothstep(.5 - .5 * u_softness - aa, .5 + .5 * u_softness + aa, localT);

    vec4 c = u_colors[i];
    c.rgb *= c.a;
    gradient = mix(gradient, c, localT);
  }

  vec3 color = gradient.rgb * totalShape;
  float opacity = gradient.a * totalShape;

  vec3 bgColor = u_colorBack.rgb * u_colorBack.a;
  color = color + bgColor * (1.0 - opacity);
  opacity = opacity + u_colorBack.a * (1.0 - opacity);

  fragColor = vec4(color, opacity);
}
`;

export interface GrainGradientUniforms extends ShaderSizingUniforms {
  u_colorBack: [number, number, number, number];
  u_colors: vec4[];
  u_colorsCount: number;
  u_softness: number;
  u_intensity: number;
  u_noise: number;
  u_shape: (typeof GrainGradientShapes)[GrainGradientShape];
  u_noiseTexture?: HTMLImageElement;
}

export interface GrainGradientParams
  extends ShaderSizingParams, ShaderMotionParams {
  colorBack?: string;
  colors?: string[];
  softness?: number;
  intensity?: number;
  noise?: number;
  shape?: GrainGradientShape;
}

export const GrainGradientShapes = {
  wave: 1,
  dots: 2,
  truchet: 3,
  corners: 4,
  ripple: 5,
  blob: 6,
  sphere: 7,
};

export type GrainGradientShape = keyof typeof GrainGradientShapes;
```

## types.js

```ts
export type vec4 = [number, number, number, number];
export type vec3 = [number, number, number];
export type vec2 = [number, number];
```

## shader-mount.ts

```ts
import { vertexShaderSource } from "./vertex-shader.ts";

const DEFAULT_MAX_PIXEL_COUNT: number = 1920 * 1080 * 4;

export class ShaderMount {
  public parentElement: PaperShaderElement;
  public canvasElement: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private uniformLocations: Record<string, WebGLUniformLocation | null> = {};
  /** The fragment shader that we are using */
  private fragmentShader: string;
  /** Stores the RAF for the render loop */
  private rafId: number | null = null;
  /** Time of the last rendered frame */
  private lastRenderTime = 0;
  /** Total time that we have played any animation, passed as a uniform to the shader for time-based VFX */
  private currentFrame = 0;
  /** The speed that we progress through animation time (multiplies by delta time every update). Allows negatives to play in reverse. If set to 0, rAF will stop entirely so static shaders have no recurring performance costs */
  private speed = 0;
  /** Actual speed used that accounts for document visibility (we pause the shader if the tab is hidden) */
  private currentSpeed = 0;
  /** Uniforms that are provided by the user for the specific shader being mounted (not including uniforms that this Mount adds, like time and resolution) */
  private providedUniforms: ShaderMountUniforms;
  /** Names of the uniforms that should have mipmaps generated for them */
  private mipmaps: string[] = [];
  /** Just a sanity check to make sure frames don't run after we're disposed */
  private hasBeenDisposed = false;
  /** If the resolution of the canvas has changed since the last render */
  private resolutionChanged = true;
  /** Store textures that are provided by the user */
  private textures: Map<string, WebGLTexture> = new Map();
  private minPixelRatio;
  private maxPixelCount;
  private isSafari = isSafari();
  private uniformCache: Record<string, unknown> = {};
  private textureUnitMap: Map<string, number> = new Map();

  constructor(
    /** The div you'd like to mount the shader to. The shader will match its size. */
    parentElement: HTMLElement,
    fragmentShader: string,
    uniforms: ShaderMountUniforms,
    webGlContextAttributes?: WebGLContextAttributes,
    /** The speed of the animation, or 0 to stop it. Supports negative values to play in reverse. */
    speed = 0,
    /** Pass a frame to offset the starting u_time value and give deterministic results*/
    frame = 0,
    /**
     * The minimum pixel ratio to render at, defaults to 2.
     * May be reduced to improve performance or increased together with `maxPixelCount` to improve antialiasing.
     */
    minPixelRatio = 2,
    /**
     * The maximum amount of physical device pixels to render for the shader,
     * by default it's 1920 * 1080 * 2x dpi (per each side) = 8,294,400 pixels of a 4K screen.
     * Actual DOM size of the canvas can be larger, it will just lose quality after this.
     *
     * May be reduced to improve performance or increased to improve quality on high-resolution screens.
     */
    maxPixelCount: number = DEFAULT_MAX_PIXEL_COUNT,
    /** Names of the uniforms that should have mipmaps generated for them */
    mipmaps: string[] = [],
  ) {
    if (parentElement instanceof HTMLElement) {
      this.parentElement = parentElement as PaperShaderElement;
    } else {
      throw new Error("Paper Shaders: parent element must be an HTMLElement");
    }

    if (!document.querySelector("style[data-paper-shader]")) {
      const styleElement = document.createElement("style");
      styleElement.innerHTML = defaultStyle;
      styleElement.setAttribute("data-paper-shader", "");
      document.head.prepend(styleElement);
    }

    // Create the canvas element and mount it into the provided element
    const canvasElement = document.createElement("canvas");
    this.canvasElement = canvasElement;
    this.parentElement.prepend(canvasElement);
    this.fragmentShader = fragmentShader;
    this.providedUniforms = uniforms;
    this.mipmaps = mipmaps;
    // Base our starting animation time on the provided frame value
    this.currentFrame = frame;
    this.minPixelRatio = minPixelRatio;
    this.maxPixelCount = maxPixelCount;

    const gl = canvasElement.getContext("webgl2", webGlContextAttributes);
    if (!gl) {
      throw new Error("Paper Shaders: WebGL is not supported in this browser");
    }
    this.gl = gl;

    this.initProgram();
    this.setupPositionAttribute();
    // Grab the locations of the uniforms in the fragment shader
    this.setupUniforms();
    // Put the user provided values into the uniforms
    this.setUniformValues(this.providedUniforms);
    // Set up the resize observer to handle window resizing and set u_resolution
    this.setupResizeObserver();
    // Set up the visual viewport change listener to handle zoom changes (pinch zoom and classic browser zoom)
    visualViewport?.addEventListener("resize", this.handleVisualViewportChange);

    // Set the animation speed after everything is ready to go
    this.setSpeed(speed);

    // Mark parent element as paper shader mount
    this.parentElement.setAttribute("data-paper-shader", "");

    // Add the shaderMount instance to the div mount element to make it easily accessible
    this.parentElement.paperShaderMount = this;

    // Listen for document visibility changes to pause the shader when the tab is hidden
    document.addEventListener(
      "visibilitychange",
      this.handleDocumentVisibilityChange,
    );
  }

  private initProgram = () => {
    const program = createProgram(
      this.gl,
      vertexShaderSource,
      this.fragmentShader,
    );
    if (!program) return;
    this.program = program;
  };

  private setupPositionAttribute = () => {
    const positionAttributeLocation = this.gl.getAttribLocation(
      this.program!,
      "a_position",
    );
    const positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(positions),
      this.gl.STATIC_DRAW,
    );
    this.gl.enableVertexAttribArray(positionAttributeLocation);
    this.gl.vertexAttribPointer(
      positionAttributeLocation,
      2,
      this.gl.FLOAT,
      false,
      0,
      0,
    );
  };

  private setupUniforms = () => {
    // Create a map to store all uniform locations
    const uniformLocations: Record<string, WebGLUniformLocation | null> = {
      u_time: this.gl.getUniformLocation(this.program!, "u_time"),
      u_pixelRatio: this.gl.getUniformLocation(this.program!, "u_pixelRatio"),
      u_resolution: this.gl.getUniformLocation(this.program!, "u_resolution"),
    };

    // Add locations for all provided uniforms
    Object.entries(this.providedUniforms).forEach(([key, value]) => {
      uniformLocations[key] = this.gl.getUniformLocation(this.program!, key);

      // For texture uniforms, also look for the aspect ratio uniform
      if (value instanceof HTMLImageElement) {
        const aspectRatioUniformName = `${key}AspectRatio`;
        uniformLocations[aspectRatioUniformName] = this.gl.getUniformLocation(
          this.program!,
          aspectRatioUniformName,
        );
      }
    });

    this.uniformLocations = uniformLocations;
  };

  /**
   * The scale that we should render at.
   * - Used to target 2x rendering even on 1x screens for better antialiasing
   * - Prevents the virtual resolution from going beyond the maximum resolution
   * - Accounts for the page zoom level so we render in physical device pixels rather than CSS pixels
   */
  private renderScale = 1;
  private parentWidth = 0;
  private parentHeight = 0;
  private parentDevicePixelWidth = 0;
  private parentDevicePixelHeight = 0;
  private devicePixelsSupported = false;

  private resizeObserver: ResizeObserver | null = null;
  private setupResizeObserver = () => {
    this.resizeObserver = new ResizeObserver(([entry]) => {
      if (entry?.borderBoxSize[0]) {
        const physicalPixelSize = entry.devicePixelContentBoxSize?.[0];

        if (physicalPixelSize !== undefined) {
          this.devicePixelsSupported = true;
          this.parentDevicePixelWidth = physicalPixelSize.inlineSize;
          this.parentDevicePixelHeight = physicalPixelSize.blockSize;
        }

        this.parentWidth = entry.borderBoxSize[0].inlineSize;
        this.parentHeight = entry.borderBoxSize[0].blockSize;
      }

      this.handleResize();
    });

    this.resizeObserver.observe(this.parentElement);
  };

  // Visual viewport resize handler, mainly used to react to browser zoom changes.
  // Resize observer by itself does not react to pinch zoom, and although it usually
  // reacts to classic browser zoom, it's not guaranteed in edge cases.
  // Since timing between visual viewport changes and resize observer is complex
  // and because we'd like to know the device pixel sizes of elements, we just restart
  // the observer to get a guaranteed fresh callback regardless if it would have triggered or not.
  private handleVisualViewportChange = () => {
    this.resizeObserver?.disconnect();
    this.setupResizeObserver();

    // In case of debugging timing, from here on:
    // - animation frame 1: a paint after the visual viewport resize
    // - animation frame 2: a paint after the resize observer has been handled, if it was ever triggered
  };

  /** Resize handler for when the container div changes size or the max pixel count changes and we want to resize our canvas to match */
  private handleResize = () => {
    // Aim to render at least as many pixels as physically displayed
    // This will overshoot when the user zooms out, but that's acceptable

    let targetPixelWidth = 0;
    let targetPixelHeight = 0;

    // If window.devicePixelRatio is below 1, it's safe to say the browser is just zoomed out
    // We can use 1 as the minimum value not to upscale it needlessly to meet the min pixel ratio param
    const dpr = Math.max(1, window.devicePixelRatio);
    const pinchZoom = visualViewport?.scale ?? 1;

    if (this.devicePixelsSupported) {
      // Use the real pixel size if we know it, plus meet the min pixel ratio requirement and add in pinch zoom
      const scaleToMeetMinPixelRatio = Math.max(1, this.minPixelRatio / dpr);
      targetPixelWidth =
        this.parentDevicePixelWidth * scaleToMeetMinPixelRatio * pinchZoom;
      targetPixelHeight =
        this.parentDevicePixelHeight * scaleToMeetMinPixelRatio * pinchZoom;
    } else {
      // Otherwise try to approximate the element size in device pixels using devicePixelRatio.
      // (devicePixelRatio is imprecise and element's width/height may be fractional CSS sizes, not real pixels).
      let targetRenderScale = Math.max(dpr, this.minPixelRatio) * pinchZoom;

      if (this.isSafari) {
        // As of 2025, Safari reports physical devicePixelRatio, but other browsers add the current zoom level:
        // https://bugs.webkit.org/show_bug.cgi?id=124862
        //
        // In Safari we need to factor in the zoom level manually in order to set the target resolution.
        // To avoid sidebars upscaling the target resolution, set a minimum zoom level of 1.
        // This will render at higher resolution when zoomed out, but that's fine.
        // (We mostly care about maintaining good quality when zoomed in).
        const zoomLevel = bestGuessBrowserZoom();
        targetRenderScale *= Math.max(1, zoomLevel);
      }

      // Rounding the client width/height since they may be fractional in CSS layout values
      targetPixelWidth = Math.round(this.parentWidth) * targetRenderScale;
      targetPixelHeight = Math.round(this.parentHeight) * targetRenderScale;
    }

    // Prevent the total rendered pixel count from exceeding maxPixelCount
    const maxPixelCountHeadroom =
      Math.sqrt(this.maxPixelCount) /
      Math.sqrt(targetPixelWidth * targetPixelHeight);
    const scaleToMeetMaxPixelCount = Math.min(1, maxPixelCountHeadroom);
    const newWidth = Math.round(targetPixelWidth * scaleToMeetMaxPixelCount);
    const newHeight = Math.round(targetPixelHeight * scaleToMeetMaxPixelCount);
    const newRenderScale = newWidth / Math.round(this.parentWidth);

    if (
      this.canvasElement.width !== newWidth ||
      this.canvasElement.height !== newHeight ||
      this.renderScale !== newRenderScale // Usually, only render scale changes when the user zooms in/out
    ) {
      this.renderScale = newRenderScale;
      this.canvasElement.width = newWidth;
      this.canvasElement.height = newHeight;
      this.resolutionChanged = true;
      this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

      // this is necessary to avoid flashes while resizing (the next scheduled render will set uniforms)
      this.render(performance.now());
    }
  };

  private render = (currentTime: number) => {
    if (this.hasBeenDisposed) return;

    if (this.program === null) {
      console.warn("Tried to render before program or gl was initialized");
      return;
    }

    // Calculate the delta time
    const dt = currentTime - this.lastRenderTime;
    this.lastRenderTime = currentTime;
    // Increase the total animation time by dt * animationSpeed
    if (this.currentSpeed !== 0) {
      this.currentFrame += dt * this.currentSpeed;
    }

    // Clear the canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Update uniforms
    this.gl.useProgram(this.program);

    // Update the time uniform
    this.gl.uniform1f(this.uniformLocations.u_time!, this.currentFrame * 0.001);

    // If the resolution has changed, we need to update the uniform
    if (this.resolutionChanged) {
      this.gl.uniform2f(
        this.uniformLocations.u_resolution!,
        this.gl.canvas.width,
        this.gl.canvas.height,
      );
      this.gl.uniform1f(this.uniformLocations.u_pixelRatio!, this.renderScale);
      this.resolutionChanged = false;
    }

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

    // Loop if we're animating
    if (this.currentSpeed !== 0) {
      this.requestRender();
    } else {
      this.rafId = null;
    }
  };

  private requestRender = () => {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = requestAnimationFrame(this.render);
  };

  /** Creates a texture from an image and sets it into a uniform value */
  private setTextureUniform = (
    uniformName: string,
    image: HTMLImageElement,
  ): void => {
    if (!image.complete || image.naturalWidth === 0) {
      throw new Error(
        `Paper Shaders: image for uniform ${uniformName} must be fully loaded`,
      );
    }

    // Clean up existing texture if present
    const existingTexture = this.textures.get(uniformName);
    if (existingTexture) {
      this.gl.deleteTexture(existingTexture);
    }

    // Get texture unit
    if (!this.textureUnitMap.has(uniformName)) {
      this.textureUnitMap.set(uniformName, this.textureUnitMap.size);
    }
    const textureUnit = this.textureUnitMap.get(uniformName)!;
    // Activate correct texture unit before creating the texture
    this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);

    // Create and set up the new texture
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Set texture parameters
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.LINEAR,
    );

    // Upload image to texture
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image,
    );

    // Generate mipmaps if the uniform is in the mipmaps list
    if (this.mipmaps.includes(uniformName)) {
      this.gl.generateMipmap(this.gl.TEXTURE_2D);
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.LINEAR_MIPMAP_LINEAR,
      );
    }

    const error = this.gl.getError();
    if (error !== this.gl.NO_ERROR || texture === null) {
      console.error(
        "Paper Shaders: WebGL error when uploading texture:",
        error,
      );
      return;
    }

    // Store the texture
    this.textures.set(uniformName, texture);

    // Set up texture unit and uniform
    const location = this.uniformLocations[uniformName];
    if (location) {
      this.gl.uniform1i(location, textureUnit);

      // Calculate and set the aspect ratio uniform
      const aspectRatioUniformName = `${uniformName}AspectRatio`;
      const aspectRatioLocation = this.uniformLocations[aspectRatioUniformName];
      if (aspectRatioLocation) {
        const aspectRatio = image.naturalWidth / image.naturalHeight;
        this.gl.uniform1f(aspectRatioLocation, aspectRatio);
      }
    }
  };

  /** Utility: recursive equality test for all the uniforms */
  private areUniformValuesEqual = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
      return a.every((val, i) =>
        this.areUniformValuesEqual(val, (b as any)[i]),
      );
    }
    return false;
  };

  /** Sets the provided uniform values into the WebGL program, can be a partial list of uniforms that have changed */
  private setUniformValues = (updatedUniforms: ShaderMountUniforms) => {
    this.gl.useProgram(this.program);
    Object.entries(updatedUniforms).forEach(([key, value]) => {
      // Grab the value to use in the uniform cache
      let cacheValue: ShaderMountUniforms[keyof ShaderMountUniforms] | string =
        value;
      if (value instanceof HTMLImageElement) {
        // Images use their src for the cache value to save memory
        cacheValue = `${value.src.slice(0, 200)}|${value.naturalWidth}x${value.naturalHeight}`;
      }

      // Check if the uniform value has changed and, if not, bail early to avoid extra work
      if (this.areUniformValuesEqual(this.uniformCache[key], cacheValue))
        return;
      // Update the uniform cache if we are still here
      this.uniformCache[key] = cacheValue;

      const location = this.uniformLocations[key];
      if (!location) {
        console.warn(`Uniform location for ${key} not found`);
        return;
      }

      if (value instanceof HTMLImageElement) {
        // Texture case, requires a good amount of code so it gets its own function:
        this.setTextureUniform(key, value);
      } else if (Array.isArray(value)) {
        // Array case
        let flatArray: number[] | null = null;
        let valueLength: number | null = null;

        // If it's an array of same-sized arrays, flatten it down so we can set the uniform
        if (value[0] !== undefined && Array.isArray(value[0])) {
          const firstChildLength = value[0].length;
          if (
            value.every((arr) => (arr as number[]).length === firstChildLength)
          ) {
            // Array of same-sized arrays case, flattens the array sets it
            flatArray = value.flat();
            valueLength = firstChildLength;
          } else {
            console.warn(`All child arrays must be the same length for ${key}`);
            return;
          }
        } else {
          // Array of primitive values case, supports 2, 3, 4, 9, 16 length arrays
          flatArray = value as number[];
          valueLength = flatArray.length;
        }

        // Set the uniform based on array length... supports 2, 3, 4, 9, 16 length arrays of primitive values
        // or arbitrary length arrays of arrays
        switch (valueLength) {
          case 2:
            this.gl.uniform2fv(location, flatArray);
            break;
          case 3:
            this.gl.uniform3fv(location, flatArray);
            break;
          case 4:
            this.gl.uniform4fv(location, flatArray);
            break;
          case 9:
            this.gl.uniformMatrix3fv(location, false, flatArray);
            break;
          case 16:
            this.gl.uniformMatrix4fv(location, false, flatArray);
            break;
          default:
            console.warn(`Unsupported uniform array length: ${valueLength}`);
        }
      } else if (typeof value === "number") {
        // Number case, supports floats and ints
        this.gl.uniform1f(location, value);
      } else if (typeof value === "boolean") {
        // Boolean case, supports true and false
        this.gl.uniform1i(location, value ? 1 : 0);
      } else {
        // May happen on the server for SSR when undefined images are passed in
        console.warn(`Unsupported uniform type for ${key}: ${typeof value}`);
      }
    });
  };

  /** Gets the current total animation time from 0ms */
  public getCurrentFrame = (): number => {
    return this.currentFrame;
  };

  /** Set a frame to get a deterministic result, frames are literally just milliseconds from zero since the animation started */
  public setFrame = (newFrame: number): void => {
    this.currentFrame = newFrame;
    this.lastRenderTime = performance.now();
    this.render(performance.now());
  };

  /** Set an animation speed (or 0 to stop animation) */
  public setSpeed = (newSpeed = 1): void => {
    // Set the new animation speed
    this.speed = newSpeed;
    this.setCurrentSpeed(document.hidden ? 0 : newSpeed);
  };

  private setCurrentSpeed = (newSpeed: number): void => {
    this.currentSpeed = newSpeed;

    if (this.rafId === null && newSpeed !== 0) {
      // Moving from 0 to animating, kick off a new rAF loop
      this.lastRenderTime = performance.now();
      this.rafId = requestAnimationFrame(this.render);
    }

    if (this.rafId !== null && newSpeed === 0) {
      // Moving from animating to not animating, cancel the rAF loop
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  };

  /** Set the maximum pixel count for the shader, this will limit the number of pixels that will be rendered */
  public setMaxPixelCount = (
    newMaxPixelCount: number = DEFAULT_MAX_PIXEL_COUNT,
  ): void => {
    this.maxPixelCount = newMaxPixelCount;

    this.handleResize();
  };

  /** Set the minimum pixel ratio for the shader */
  public setMinPixelRatio = (newMinPixelRatio: number = 2): void => {
    this.minPixelRatio = newMinPixelRatio;

    this.handleResize();
  };

  /** Update the uniforms that are provided by the outside shader, can be a partial set with only the uniforms that have changed */
  public setUniforms = (newUniforms: ShaderMountUniforms): void => {
    this.setUniformValues(newUniforms);
    this.providedUniforms = { ...this.providedUniforms, ...newUniforms };

    this.render(performance.now());
  };

  private handleDocumentVisibilityChange = () => {
    this.setCurrentSpeed(document.hidden ? 0 : this.speed);
  };

  /** Dispose of the shader mount, cleaning up all of the WebGL resources */
  public dispose = (): void => {
    // Immediately mark as disposed to prevent future renders from leaking in
    this.hasBeenDisposed = true;

    // Cancel the rAF loop
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.gl && this.program) {
      // Clean up all textures
      this.textures.forEach((texture) => {
        this.gl.deleteTexture(texture);
      });
      this.textures.clear();

      this.gl.deleteProgram(this.program);
      this.program = null;

      // Reset the WebGL context
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
      this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

      // Clear any errors
      this.gl.getError();
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    visualViewport?.removeEventListener(
      "resize",
      this.handleVisualViewportChange,
    );
    document.removeEventListener(
      "visibilitychange",
      this.handleDocumentVisibilityChange,
    );

    this.uniformLocations = {};

    // Remove the shader from the div wrapper element
    this.canvasElement.remove();
    // Free up the reference to self to enable garbage collection
    delete this.parentElement.paperShaderMount;
  };
}

function createShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader),
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
): WebGLProgram | null {
  const format = gl.getShaderPrecisionFormat(
    gl.FRAGMENT_SHADER,
    gl.MEDIUM_FLOAT,
  );
  const precision = format ? format.precision : null;
  // MEDIUM_FLOAT precision can be 10, 16 or 23 bits depending on device;
  // Shaders fail on 10 bit (and 16 bit is hard to test) => we force 23-bit by switching to highp
  if (precision && precision < 23) {
    vertexShaderSource = vertexShaderSource.replace(
      /precision\s+(lowp|mediump)\s+float;/g,
      "precision highp float;",
    );
    fragmentShaderSource = fragmentShaderSource
      .replace(/precision\s+(lowp|mediump)\s+float/g, "precision highp float")
      .replace(
        /\b(uniform|varying|attribute)\s+(lowp|mediump)\s+(\w+)/g,
        "$1 highp $3",
      );
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program),
    );
    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  // Clean up shaders after successful linking
  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

const defaultStyle = `@layer paper-shaders {
  :where([data-paper-shader]) {
    isolation: isolate;
    position: relative;

    & canvas {
      contain: strict;
      display: block;
      position: absolute;
      inset: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      corner-shape: inherit;
    }
  }
}`;

/** The parent `<div>` element that has a ShaderMount available on it */
export interface PaperShaderElement extends HTMLElement {
  paperShaderMount: ShaderMount | undefined;
}

/** Check if an element is a Paper shader element */
export function isPaperShaderElement(
  element: HTMLElement,
): element is PaperShaderElement {
  return "paperShaderMount" in element;
}

/**
 * Uniform types that we support to be auto-mapped into the fragment shader
 *
 * We accept undefined as a convenience for server rendering, when some things may be undefined
 * We just skip setting the uniform if it's undefined. This allows the shader mount to still take up space during server rendering
 */
export interface ShaderMountUniforms {
  [key: string]:
    | boolean
    | number
    | number[]
    | number[][]
    | HTMLImageElement
    | undefined;
}

export interface ShaderMotionParams {
  speed?: number;
  frame?: number;
}

export type ShaderPreset<T> = {
  name: string;
  params: Required<T>;
};

export type ImageShaderPreset<T> = {
  name: string;
  /**
   * Params for the shader excluding the image.
   * Image is excluded as it isn't considered a preset,
   * e.g. when switching between presets it shouldn't switch the image.
   *
   * While we exclude images from presets they should still be set with a default prop value so the code-first usage of shaders remains great.
   */
  params: Required<Omit<T, "image">>;
};

function isSafari() {
  const ua = navigator.userAgent.toLowerCase();
  return (
    ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android")
  );
}

// Zoom level can be estimated comparing the browser's outerWidth and the viewport width.
// It's nowhere near perfect because it's affected by the presence of browser sidebars,
// like a vertical web inspector or Arc's sidebar. Also, both outerWidth and innerWidth
// are integers, which would almost never give us a perfect ratio at face values.
//
// Still, this is pretty accurate in the vast majority of cases.
//
// Note 1:
// Avoid innerWidth, use visualViewport.width instead.
// - innerWidth is affected by pinch zoom in Safari, but not other browsers.
//   visualViewport.width works consistently in all browsers.
// - innerWidth is rounded to integer, but not visualViewport.width.
// - visualViewport.width is affected by hard scrollbars, so they need to be added manually
//
// Note 2:
// Opening a sidebar in Safari like web inspector or bookmarks will throw off the zoom
// level detection and result in a larger target resolution. Not a concern in real-world usage
// with Safari, but we'd rather not try to detect zoom levels with other browsers
// (e.g. Arc always has a sidebar, which affects outerWidth vs visualViewport.width).
function bestGuessBrowserZoom() {
  const viewportScale = visualViewport?.scale ?? 1;
  const viewportWidth = visualViewport?.width ?? window.innerWidth;
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  const innerWidth = viewportScale * viewportWidth + scrollbarWidth;

  // outerWidth and innerWidth are always integers so we won't often get the original zoom ratio
  // E.g. given a 125% zoom, outerWidth = 1657, innerWidth = 1325, 1657 / 1325 = 1.2505660377
  // We check for common zoom levels and return the closest one if found.

  const ratio = outerWidth / innerWidth;
  const zoomPercentageRounded = Math.round(100 * ratio);

  // All zoom levels divisible by 5%
  if (zoomPercentageRounded % 5 === 0) {
    return zoomPercentageRounded / 100;
  }

  // 33% zoom
  if (zoomPercentageRounded === 33) {
    return 1 / 3;
  }

  // 67% zoom
  if (zoomPercentageRounded === 67) {
    return 2 / 3;
  }

  // 133% zoom
  if (zoomPercentageRounded === 133) {
    return 4 / 3;
  }

  return ratio;
}
```

## vertex-shader.ts

```ts
/** Vertex shader for the shader mount */
// language=GLSL
export const vertexShaderSource = `#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_position;

uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_imageAspectRatio;
uniform float u_originX;
uniform float u_originY;
uniform float u_worldWidth;
uniform float u_worldHeight;
uniform float u_fit;
uniform float u_scale;
uniform float u_rotation;
uniform float u_offsetX;
uniform float u_offsetY;

out vec2 v_objectUV;
out vec2 v_objectBoxSize;
out vec2 v_responsiveUV;
out vec2 v_responsiveBoxGivenSize;
out vec2 v_patternUV;
out vec2 v_patternBoxSize;
out vec2 v_imageUV;

vec3 getBoxSize(float boxRatio, vec2 givenBoxSize) {
  vec2 box = vec2(0.);
  // fit = none
  box.x = boxRatio * min(givenBoxSize.x / boxRatio, givenBoxSize.y);
  float noFitBoxWidth = box.x;
  if (u_fit == 1.) { // fit = contain
    box.x = boxRatio * min(u_resolution.x / boxRatio, u_resolution.y);
  } else if (u_fit == 2.) { // fit = cover
    box.x = boxRatio * max(u_resolution.x / boxRatio, u_resolution.y);
  }
  box.y = box.x / boxRatio;
  return vec3(box, noFitBoxWidth);
}

void main() {
  gl_Position = a_position;

  vec2 uv = gl_Position.xy * .5;
  vec2 boxOrigin = vec2(.5 - u_originX, u_originY - .5);
  vec2 givenBoxSize = vec2(u_worldWidth, u_worldHeight);
  givenBoxSize = max(givenBoxSize, vec2(1.)) * u_pixelRatio;
  float r = u_rotation * 3.14159265358979323846 / 180.;
  mat2 graphicRotation = mat2(cos(r), sin(r), -sin(r), cos(r));
  vec2 graphicOffset = vec2(-u_offsetX, u_offsetY);


  // ===================================================

  float fixedRatio = 1.;
  vec2 fixedRatioBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );

  v_objectBoxSize = getBoxSize(fixedRatio, fixedRatioBoxGivenSize).xy;
  vec2 objectWorldScale = u_resolution.xy / v_objectBoxSize;

  v_objectUV = uv;
  v_objectUV *= objectWorldScale;
  v_objectUV += boxOrigin * (objectWorldScale - 1.);
  v_objectUV += graphicOffset;
  v_objectUV /= u_scale;
  v_objectUV = graphicRotation * v_objectUV;

  // ===================================================

  v_responsiveBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  float responsiveRatio = v_responsiveBoxGivenSize.x / v_responsiveBoxGivenSize.y;
  vec2 responsiveBoxSize = getBoxSize(responsiveRatio, v_responsiveBoxGivenSize).xy;
  vec2 responsiveBoxScale = u_resolution.xy / responsiveBoxSize;

  #ifdef ADD_HELPERS
  v_responsiveHelperBox = uv;
  v_responsiveHelperBox *= responsiveBoxScale;
  v_responsiveHelperBox += boxOrigin * (responsiveBoxScale - 1.);
  #endif

  v_responsiveUV = uv;
  v_responsiveUV *= responsiveBoxScale;
  v_responsiveUV += boxOrigin * (responsiveBoxScale - 1.);
  v_responsiveUV += graphicOffset;
  v_responsiveUV /= u_scale;
  v_responsiveUV.x *= responsiveRatio;
  v_responsiveUV = graphicRotation * v_responsiveUV;
  v_responsiveUV.x /= responsiveRatio;

  // ===================================================

  float patternBoxRatio = givenBoxSize.x / givenBoxSize.y;
  vec2 patternBoxGivenSize = vec2(
  (u_worldWidth == 0.) ? u_resolution.x : givenBoxSize.x,
  (u_worldHeight == 0.) ? u_resolution.y : givenBoxSize.y
  );
  patternBoxRatio = patternBoxGivenSize.x / patternBoxGivenSize.y;

  vec3 boxSizeData = getBoxSize(patternBoxRatio, patternBoxGivenSize);
  v_patternBoxSize = boxSizeData.xy;
  float patternBoxNoFitBoxWidth = boxSizeData.z;
  vec2 patternBoxScale = u_resolution.xy / v_patternBoxSize;

  v_patternUV = uv;
  v_patternUV += graphicOffset / patternBoxScale;
  v_patternUV += boxOrigin;
  v_patternUV -= boxOrigin / patternBoxScale;
  v_patternUV *= u_resolution.xy;
  v_patternUV /= u_pixelRatio;
  if (u_fit > 0.) {
    v_patternUV *= (patternBoxNoFitBoxWidth / v_patternBoxSize.x);
  }
  v_patternUV /= u_scale;
  v_patternUV = graphicRotation * v_patternUV;
  v_patternUV += boxOrigin / patternBoxScale;
  v_patternUV -= boxOrigin;
  // x100 is a default multiplier between vertex and fragmant shaders
  // we use it to avoid UV presision issues
  v_patternUV *= .01;

  // ===================================================

  vec2 imageBoxSize;
  if (u_fit == 1.) { // contain
    imageBoxSize.x = min(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else if (u_fit == 2.) { // cover
    imageBoxSize.x = max(u_resolution.x / u_imageAspectRatio, u_resolution.y) * u_imageAspectRatio;
  } else {
    imageBoxSize.x = min(10.0, 10.0 / u_imageAspectRatio * u_imageAspectRatio);
  }
  imageBoxSize.y = imageBoxSize.x / u_imageAspectRatio;
  vec2 imageBoxScale = u_resolution.xy / imageBoxSize;

  v_imageUV = uv;
  v_imageUV *= imageBoxScale;
  v_imageUV += boxOrigin * (imageBoxScale - 1.);
  v_imageUV += graphicOffset;
  v_imageUV /= u_scale;
  v_imageUV.x *= u_imageAspectRatio;
  v_imageUV = graphicRotation * v_imageUV;
  v_imageUV.x /= u_imageAspectRatio;

  v_imageUV += .5;
  v_imageUV.y = 1. - v_imageUV.y;
}`;
```

## shader-sizing.ts

```ts
export interface ShaderSizingUniforms {
  u_fit: (typeof ShaderFitOptions)[ShaderFit];
  u_scale: number;
  u_rotation: number;
  u_originX: number;
  u_originY: number;
  u_offsetX: number;
  u_offsetY: number;
  u_worldWidth: number;
  u_worldHeight: number;
}

export interface ShaderSizingParams {
  fit?: "none" | "contain" | "cover";
  scale?: number;
  rotation?: number;
  originX?: number;
  originY?: number;
  offsetX?: number;
  offsetY?: number;
  worldWidth?: number;
  worldHeight?: number;
}

export const defaultObjectSizing: Required<ShaderSizingParams> = {
  fit: "contain",
  scale: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  originX: 0.5,
  originY: 0.5,
  worldWidth: 0,
  worldHeight: 0,
};

export const defaultPatternSizing: Required<ShaderSizingParams> = {
  fit: "none",
  scale: 1,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  originX: 0.5,
  originY: 0.5,
  worldWidth: 0,
  worldHeight: 0,
};

export const ShaderFitOptions = {
  none: 0,
  contain: 1,
  cover: 2,
} as const;

export type ShaderFit = keyof typeof ShaderFitOptions;
```

## shader-utils.ts

```ts
// language=GLSL
export const declarePI = `
#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846
`;

// language=GLSL
export const rotation2 = `
vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}
`;

// language=GLSL
export const proceduralHash11 = `
  float hash11(float p) {
    p = fract(p * 0.3183099) + 0.1;
    p *= p + 19.19;
    return fract(p * p);
  }
`;

// language=GLSL
export const proceduralHash21 = `
  float hash21(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }
`;

// language=GLSL
export const proceduralHash22 = `
  vec2 hash22(vec2 p) {
    p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
    p += dot(p, p.yx + 19.19);
    return fract(vec2(p.x * p.y, p.x + p.y));
  }
`;

// language=GLSL
export const textureRandomizerR = `
  float randomR(vec2 p) {
    vec2 uv = floor(p) / 100. + .5;
    return texture(u_noiseTexture, fract(uv)).r;
  }
`;

// language=GLSL
export const textureRandomizerGB = `
  vec2 randomGB(vec2 p) {
    vec2 uv = floor(p) / 100. + .5;
    return texture(u_noiseTexture, fract(uv)).gb;
  }
`;

// language=GLSL
export const colorBandingFix = `
  color += 1. / 256. * (fract(sin(dot(.014 * gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453123) - .5);
`;

// language=GLSL
export const simplexNoise = `
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
    -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

// language=GLSL
export const fiberNoise = `
float fiberRandom(vec2 p) {
  vec2 uv = floor(p) / 100.;
  return texture(u_noiseTexture, fract(uv)).b;
}

float fiberValueNoise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = fiberRandom(i);
  float b = fiberRandom(i + vec2(1.0, 0.0));
  float c = fiberRandom(i + vec2(0.0, 1.0));
  float d = fiberRandom(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

float fiberNoiseFbm(in vec2 n, vec2 seedOffset) {
  float total = 0.0, amplitude = 1.;
  for (int i = 0; i < 4; i++) {
    n = rotate(n, .7);
    total += fiberValueNoise(n + seedOffset) * amplitude;
    n *= 2.;
    amplitude *= 0.6;
  }
  return total;
}

float fiberNoise(vec2 uv, vec2 seedOffset) {
  float epsilon = 0.001;
  float n1 = fiberNoiseFbm(uv + vec2(epsilon, 0.0), seedOffset);
  float n2 = fiberNoiseFbm(uv - vec2(epsilon, 0.0), seedOffset);
  float n3 = fiberNoiseFbm(uv + vec2(0.0, epsilon), seedOffset);
  float n4 = fiberNoiseFbm(uv - vec2(0.0, epsilon), seedOffset);
  return length(vec2(n1 - n2, n3 - n4)) / (2.0 * epsilon);
}
`;
```

## Sample usage

```tsx
import { GrainGradient } from "@paper-design/shaders-react";

<GrainGradient
  width={1280}
  height={720}
  colors={["#c6750c", "#beae60", "#d7cbc6"]}
  colorBack="#000a0f"
  softness={0.7}
  intensity={0.15}
  noise={0.5}
  shape="wave"
  speed={1}
/>;
```
