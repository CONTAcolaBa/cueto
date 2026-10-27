/** The main media field stores either an image URL or a video embed code (never both). */
export function isVideoEmbed(value: string | null | undefined) {
  return Boolean(value && value.trim().startsWith("<"));
}

/** Extracts a safe https iframe src from an embed code; null when invalid. */
export function getVideoEmbedSrc(value: string | null | undefined): string | null {
  if (!isVideoEmbed(value)) return null;
  const match = value!.match(/<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i);
  const src = match?.[1]?.replace(/&amp;/g, "&");
  if (!src) return null;
  try {
    const url = new URL(src);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
