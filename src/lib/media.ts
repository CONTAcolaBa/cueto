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

/** True when the embed code loads an external https script (e.g. video players like VTurb/Panda). */
export function isScriptEmbed(value: string | null | undefined) {
  return isVideoEmbed(value) && /<script[^>]*\ssrc\s*=\s*["']https:\/\//i.test(value!);
}

/**
 * Builds an isolated document for script-based embeds. It is rendered in an iframe
 * sandboxed WITHOUT allow-same-origin, so the script can never touch the site's
 * cookies, storage or logged-in session.
 */
export function getScriptEmbedDoc(value: string | null | undefined): string | null {
  if (!isScriptEmbed(value)) return null;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:transparent}</style></head><body>${value!.trim()}</body></html>`;
}

/** Any accepted video embed: iframe with https src, or a https script embed. */
export function isValidVideoEmbed(value: string | null | undefined) {
  return Boolean(getVideoEmbedSrc(value) || getScriptEmbedDoc(value));
}
