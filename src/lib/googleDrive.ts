/**
 * Utility functions for handling Google Drive URLs for certificates & media.
 * Supports converting sharing links into high-res direct image links, thumbnails,
 * and viewable credential URLs.
 */

export function extractGoogleDriveId(url: string | undefined | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/{id} or /d/{id} (e.g. drive.google.com/file/d/XYZ/view)
  const fileDMatch = trimmed.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

  // Pattern 2: ?id={id} or &id={id} (e.g. uc?id=XYZ or open?id=XYZ)
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];

  // Pattern 3: googleusercontent.com/d/{id}
  const lh3Match = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) return lh3Match[1];

  return null;
}

export function isGoogleDriveUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return (
    url.includes("drive.google.com") ||
    url.includes("docs.google.com") ||
    url.includes("lh3.googleusercontent.com")
  );
}

/**
 * Converts any Google Drive link to a direct displayable image URL.
 * Uses Google's fast CDN: https://lh3.googleusercontent.com/d/{id}
 * Falls back to original string if not a Google Drive link.
 */
export function formatGoogleDriveImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  const fileId = extractGoogleDriveId(trimmed);

  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return trimmed;
}

/**
 * Returns a high-res thumbnail endpoint from Google Drive (ideal for PDF first-page previews and fallbacks).
 */
export function formatGoogleDriveThumbnailUrl(url: string | undefined | null, width = 1200): string {
  if (!url) return "";
  const trimmed = url.trim();
  const fileId = extractGoogleDriveId(trimmed);

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
  }

  return trimmed;
}

/**
 * Formats a Google Drive URL into a standard shareable view link for opening in a new tab.
 */
export function formatGoogleDriveViewUrl(url: string | undefined | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  const fileId = extractGoogleDriveId(trimmed);

  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  }

  return trimmed;
}
