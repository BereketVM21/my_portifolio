import React from 'react';

/**
 * NoiseTexture — exact port of the MagicUI NoiseTexture component.
 * Uses SVG feTurbulence (Perlin fractal noise) rendered natively by the browser.
 *
 * Props:
 *   baseFrequency  — controls grain density (default: 0.65)
 *   numOctaves     — detail layers (default: 3)
 *   opacity        — overall opacity (default: 0.15)
 *   className      — extra CSS classes (e.g. for mask)
 *   style          — inline styles
 */
const NoiseTexture = ({
  className = '',
  style = {},
  baseFrequency = 0.65,
  numOctaves = 3,
  opacity = 0.15,
}) => {
  return (
    <svg
      className={className}
      style={{
        pointerEvents: 'none',
        ...style,
      }}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <filter id="noise-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency={baseFrequency}
          numOctaves={numOctaves}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect
        width="100%"
        height="100%"
        filter="url(#noise-filter)"
        opacity={opacity}
      />
    </svg>
  );
};

export default NoiseTexture;
