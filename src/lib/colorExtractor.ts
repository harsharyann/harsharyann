/**
 * 4K Vibrant Color Extraction Engine
 * Extracts the most punchy, vibrant accent color from any photo (local, data URL, or Google Drive)
 * to dynamically tint hero doodle elements, 3D text shadows, and neo-brutalist buttons.
 */

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
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h <= 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

function analyzeCanvasPixels(ctx: CanvasRenderingContext2D, size: number): string | null {
  const imgData = ctx.getImageData(0, 0, size, size).data;
  const numBins = 36; // 36 bins across 360 degrees (10 deg each)
  const bins = Array.from({ length: numBins }, () => ({
    totalScore: 0,
    totalR: 0,
    totalG: 0,
    totalB: 0,
    count: 0,
  }));

  for (let i = 0; i < imgData.length; i += 4) {
    const a = imgData[i + 3];
    if (a < 128) continue;

    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];

    const [h, s, l] = rgbToHsl(r, g, b);

    // Skip near-blacks, near-whites, and low-saturation grays
    if (l < 0.16 || l > 0.90 || s < 0.20) continue;

    // Weight score: high saturation + balanced luminance (peaks around l = 0.55)
    const lightnessScore = Math.sin(Math.PI * l);
    const satScore = Math.pow(s, 1.8);
    const score = satScore * lightnessScore;

    const binIdx = Math.floor(h / (360 / numBins)) % numBins;
    const bin = bins[binIdx];
    bin.totalScore += score;
    bin.totalR += r * score;
    bin.totalG += g * score;
    bin.totalB += b * score;
    bin.count++;
  }

  // Find the winning bin with maximum score
  let maxScore = 0;
  let bestBin = null;
  for (const bin of bins) {
    if (bin.totalScore > maxScore) {
      maxScore = bin.totalScore;
      bestBin = bin;
    }
  }

  if (!bestBin || maxScore <= 0.05) {
    return null; // Monochromatic or no vibrant color found
  }

  const avgR = bestBin.totalR / bestBin.totalScore;
  const avgG = bestBin.totalG / bestBin.totalScore;
  const avgB = bestBin.totalB / bestBin.totalScore;

  let [h, s, l] = rgbToHsl(avgR, avgG, avgB);

  // Boost saturation for comic/doodle pop-art aesthetic
  s = Math.max(s, 0.85);

  // Keep lightness in the sweet spot for maximum pop and legibility against dark backgrounds
  l = Math.max(0.50, Math.min(0.65, l));

  return hslToHex(h, s, l);
}

/**
 * Extracts the vibrant accent color from an image URL.
 * Automatically handles CORS via proxy fallback if needed.
 */
export async function extractVibrantColor(
  imageSrc: string,
  fallbackColor: string = "#facc15"
): Promise<string> {
  if (typeof window === "undefined" || !imageSrc) return fallbackColor;

  if (colorCache.has(imageSrc)) {
    return colorCache.get(imageSrc)!;
  }

  const loadImageAndExtract = (src: string, useCrossOrigin: boolean): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      if (useCrossOrigin && !src.startsWith("data:")) {
        img.crossOrigin = "anonymous";
      }

      const timer = setTimeout(() => {
        resolve(null);
      }, 4000); // 4s timeout

      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement("canvas");
          const size = 48;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0, size, size);
          const color = analyzeCanvasPixels(ctx, size);
          resolve(color);
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
    // Attempt 1: Direct load with crossOrigin = "anonymous"
    let color = await loadImageAndExtract(imageSrc, true);

    // Attempt 2: If failed and it's an external HTTP/HTTPS URL, route through proxy
    if (!color && /^https?:\/\//i.test(imageSrc)) {
      const proxiedUrl = `/api/proxy-image?url=${encodeURIComponent(imageSrc)}`;
      color = await loadImageAndExtract(proxiedUrl, false);
    }

    const finalColor = color || fallbackColor;
    colorCache.set(imageSrc, finalColor);
    return finalColor;
  } catch {
    colorCache.set(imageSrc, fallbackColor);
    return fallbackColor;
  }
}
