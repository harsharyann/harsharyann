/**
 * 4K Vibrant Color & Dynamic Palette Extraction Engine
 * Extracts punchy, vibrant accent colors and multi-shade palettes from any photo
 * (local asset, Google Drive CDN, proxy, or data URL) to dynamically harmonize
 * cover typography, 3D text shadows, badges, and doodle crew elements.
 */

export interface PhotoPalette {
  dominant: string;       // Primary vibrant color from photo (e.g. #f43f5e)
  secondary: string;      // Complementary / high-contrast vibrant color (e.g. #38bdf8)
  accent: string;         // Radiant highlight tone (e.g. #facc15)
  tertiary: string;       // Mid-range tone (e.g. #a855f7)
  glow: string;           // CSS rgba string for soft glow effects
  shadowColor: string;    // CSS color for 3D text block shadows
  gradient: string;       // Rich CSS linear-gradient string
  letters: string[];      // 10 distinct vibrant letter colors for "HARSH ARYAN"
}

export const DEFAULT_PHOTO_PALETTE: PhotoPalette = {
  dominant: "#f59e0b",
  secondary: "#06b6d4",
  accent: "#f43f5e",
  tertiary: "#8b5cf6",
  glow: "rgba(245, 158, 11, 0.4)",
  shadowColor: "#000000",
  gradient: "linear-gradient(135deg, #f59e0b 0%, #f43f5e 50%, #8b5cf6 100%)",
  letters: [
    "#FF2A55", // H
    "#FF9500", // A
    "#10B981", // R
    "#8B5CF6", // S
    "#06B6D4", // H
    "#FF4D6D", // A
    "#FFA726", // R
    "#34D399", // Y
    "#A78BFA", // A
    "#38BDF8", // N
  ],
};

const paletteCache = new Map<string, PhotoPalette>();
const colorCache = new Map<string, string>();

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h <= 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

function analyzeCanvasPixelsToPalette(ctx: CanvasRenderingContext2D, size: number): PhotoPalette | null {
  const imgData = ctx.getImageData(0, 0, size, size).data;
  const numBins = 36; // 10 degree bins
  const bins = Array.from({ length: numBins }, () => ({
    totalScore: 0,
    totalR: 0,
    totalG: 0,
    totalB: 0,
    count: 0,
    avgH: 0,
  }));

  for (let i = 0; i < imgData.length; i += 4) {
    const a = imgData[i + 3];
    if (a < 128) continue;

    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];

    const [h, s, l] = rgbToHsl(r, g, b);

    // Filter out pure black, washed white, or flat grayscale
    if (l < 0.12 || l > 0.92 || s < 0.16) continue;

    // Weight score: favors saturated, bright tones with peak at l=0.55
    const lightnessScore = Math.sin(Math.PI * l);
    const satScore = Math.pow(s, 1.6);
    const score = satScore * lightnessScore;

    const binIdx = Math.floor(h / (360 / numBins)) % numBins;
    const bin = bins[binIdx];
    bin.totalScore += score;
    bin.totalR += r * score;
    bin.totalG += g * score;
    bin.totalB += b * score;
    bin.count++;
  }

  // Filter bins with noticeable signal
  const validBins = bins
    .map((b, idx) => {
      if (b.totalScore <= 0.05) return null;
      const avgR = b.totalR / b.totalScore;
      const avgG = b.totalG / b.totalScore;
      const avgB = b.totalB / b.totalScore;
      const [h, s, l] = rgbToHsl(avgR, avgG, avgB);
      return {
        binIdx: idx,
        score: b.totalScore,
        h,
        s: Math.max(s, 0.85), // boost saturation for comic punch
        l: Math.max(0.48, Math.min(0.68, l)),
      };
    })
    .filter((b): b is NonNullable<typeof b> => b !== null)
    .sort((a, b) => b.score - a.score);

  if (validBins.length === 0) {
    return null;
  }

  // Pick top distinct hues (at least 35° apart)
  const picked: { h: number; s: number; l: number }[] = [];
  for (const b of validBins) {
    const isDistinct = picked.every((p) => {
      const diff = Math.abs(p.h - b.h);
      const angle = Math.min(diff, 360 - diff);
      return angle >= 35;
    });
    if (isDistinct) {
      picked.push(b);
      if (picked.length >= 4) break;
    }
  }

  // Fill complementary hues if photo is monochromatic
  const baseHue = validBins[0].h;
  while (picked.length < 4) {
    const nextH = (baseHue + picked.length * 90) % 360;
    picked.push({ h: nextH, s: 0.88, l: 0.58 });
  }

  const dominant = hslToHex(picked[0].h, picked[0].s, picked[0].l);
  const secondary = hslToHex(picked[1].h, picked[1].s, picked[1].l);
  const accent = hslToHex(picked[2].h, picked[2].s, picked[2].l);
  const tertiary = hslToHex(picked[3].h, picked[3].s, picked[3].l);

  // Generate 10-shade harmonious array for HARSH ARYAN letters
  const letters = [
    dominant,
    secondary,
    accent,
    tertiary,
    hslToHex((picked[0].h + 20) % 360, 0.9, 0.6),
    secondary,
    accent,
    dominant,
    tertiary,
    hslToHex((picked[1].h + 25) % 360, 0.92, 0.62),
  ];

  return {
    dominant,
    secondary,
    accent,
    tertiary,
    glow: `rgba(${Math.round(picked[0].s * 255)}, 180, 50, 0.45)`,
    shadowColor: "#000000",
    gradient: `linear-gradient(135deg, ${dominant} 0%, ${secondary} 50%, ${accent} 100%)`,
    letters,
  };
}

/**
 * Loads an image (direct or proxied) onto a canvas and extracts a full PhotoPalette.
 */
export async function extractPhotoPalette(
  imageSrc: string,
  fallbackPalette: PhotoPalette = DEFAULT_PHOTO_PALETTE
): Promise<PhotoPalette> {
  if (typeof window === "undefined" || !imageSrc) return fallbackPalette;

  if (paletteCache.has(imageSrc)) {
    return paletteCache.get(imageSrc)!;
  }

  const loadImage = (src: string, useCrossOrigin: boolean): Promise<PhotoPalette | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      if (useCrossOrigin && !src.startsWith("data:")) {
        img.crossOrigin = "anonymous";
      }

      const timer = setTimeout(() => {
        resolve(null);
      }, 4000);

      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement("canvas");
          const size = 56;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0, size, size);
          const palette = analyzeCanvasPixelsToPalette(ctx, size);
          resolve(palette);
        } catch {
          resolve(null);
        }
      };

      img.onerror = () => {
        clearTimeout(timer);
        resolve(null);
      };

      img.src = src;
    });
  };

  try {
    let pal = await loadImage(imageSrc, true);

    if (!pal && /^https?:\/\//i.test(imageSrc)) {
      const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(imageSrc)}`;
      pal = await loadImage(proxiedUrl, false);
    }

    const finalPalette = pal || fallbackPalette;
    paletteCache.set(imageSrc, finalPalette);
    colorCache.set(imageSrc, finalPalette.dominant);
    return finalPalette;
  } catch {
    paletteCache.set(imageSrc, fallbackPalette);
    return fallbackPalette;
  }
}

/**
 * Backwards-compatible single color extractor.
 */
export async function extractVibrantColor(
  imageSrc: string,
  fallbackColor: string = "#facc15"
): Promise<string> {
  if (typeof window === "undefined" || !imageSrc) return fallbackColor;

  if (colorCache.has(imageSrc)) {
    return colorCache.get(imageSrc)!;
  }

  const pal = await extractPhotoPalette(imageSrc);
  const color = pal.dominant || fallbackColor;
  colorCache.set(imageSrc, color);
  return color;
}
