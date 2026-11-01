/**
 * Client-Side Image Compressor
 * Automatically resizes and compresses high-res phone camera shots (5-15MB)
 * into high-quality, lightweight web JPEGs (< 250KB).
 * Prevents localStorage QuotaExceededError and Next.js / Vercel 413 Payload Too Large errors.
 */

export function compressImageFile(file: File, maxDim = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    // If it's not an image, reject
    if (!file.type.startsWith("image/")) {
      reject(new Error("File is not an image"));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image into memory"));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image resized
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight compressed JPEG
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
