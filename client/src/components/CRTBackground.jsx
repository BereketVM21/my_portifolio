import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * CRT Shader Background — renders a retro CRT monitor effect on top of an
 * Earth-at-night texture using a WebGL ShaderMaterial.
 *
 * Adapted from the three.js WGSL/TSL interoperability example by Xor:
 * https://mini.gmshaders.com/p/gm-shaders-mini-crt
 */
const CRTBackground = ({ style = {} }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationId;

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const scene = new THREE.Scene();

    // ── Uniforms ───────────────────────────────────────────────
    const uniforms = {
      tex: { value: null },
      crtWidth: { value: 1608.0 },
      crtHeight: { value: 1608.0 },
      cellOffset: { value: 0.5 },
      cellSize: { value: 6.0 },
      borderMask: { value: 1.0 },
      time: { value: 0.0 },
      speed: { value: 1.0 },
      pulseIntensity: { value: 0.06 },
      pulseWidth: { value: 60.0 },
      pulseRate: { value: 20.0 },
    };

    // ── Texture ────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    loader.load(
      'https://threejs.org/examples/textures/planets/earth_lights_2048.png',
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        uniforms.tex.value = texture;
      },
    );

    // ── Shaders (GLSL conversion of the WGSL CRT shader) ─────
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform sampler2D tex;
      uniform float crtWidth;
      uniform float crtHeight;
      uniform float cellOffset;
      uniform float cellSize;
      uniform float borderMask;
      uniform float time;
      uniform float speed;
      uniform float pulseIntensity;
      uniform float pulseWidth;
      uniform float pulseRate;

      varying vec2 vUv;

      void main() {
        // Map UVs to pixel coordinates
        vec2 pixel = vUv * vec2(crtWidth, crtHeight);

        // Cell coordinates in the CRT grid
        vec2 coord = pixel / cellSize;

        // Each cell has 3 horizontal sub-cells (R, G, B sub-pixels)
        vec2 subcoord = coord * vec2(3.0, 1.0);

        // Vertical stagger for odd columns (classic CRT layout)
        vec2 offset = vec2(0.0, fract(floor(coord.x) * cellOffset));

        // Snap to cell grid for texture sampling
        vec2 maskCoord = floor(coord + offset) * cellSize;
        vec2 samplePoint = maskCoord / vec2(crtWidth, crtHeight);

        // Horizontal scrolling
        samplePoint.x += fract(time * speed / 20.0);

        vec3 color = texture2D(tex, samplePoint).xyz;

        // Determine which sub-pixel channel (R=0, G=1, B=2)
        float ind = mod(floor(subcoord.x), 3.0);

        // Sub-pixel mask — use step() for GPU-safe float comparison
        vec3 maskColor = vec3(
          1.0 - step(0.5, abs(ind)),
          1.0 - step(0.5, abs(ind - 1.0)),
          1.0 - step(0.5, abs(ind - 2.0))
        ) * 3.0;

        // Rounded border for each cell
        vec2 cellUV = fract(subcoord + offset) * 2.0 - 1.0;
        vec2 border = 1.0 - cellUV * cellUV * borderMask;
        maskColor *= clamp(border.x, 0.0, 1.0) * clamp(border.y, 0.0, 1.0);

        color *= maskColor;

        // Vertical pulse / scanline flicker
        float pulse = sin(pixel.y / pulseWidth + time * pulseRate);
        color *= 1.0 + pulseIntensity * pulse;

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // ── Mesh ───────────────────────────────────────────────────
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // ── Resize ─────────────────────────────────────────────────
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      renderer.setSize(w, h);
      renderer.setPixelRatio(window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    // ── Render loop ────────────────────────────────────────────
    const clock = new THREE.Clock();
    const animate = () => {
      uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    // ── Cleanup ────────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (uniforms.tex.value) uniforms.tex.value.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        ...style,
      }}
    />
  );
};

export default CRTBackground;
