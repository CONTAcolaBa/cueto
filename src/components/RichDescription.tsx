import { useEffect, useState } from "react";

const ALLOWED_TAGS = ["p", "br", "strong", "b", "em", "i", "u", "ul", "li"];

function isHtml(value: string) {
  return /<[a-z][\s\S]*>/i.test(value);
}

function toPlainText(html: string) {
  return html
    .replace(/<\/(p|li)>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim();
}

/** Renders the page description: rich HTML sanitized with DOMPurify (browser), plain text on the server. */
export function RichDescription({ value, className }: { value: string; className?: string }) {
  const [safeHtml, setSafeHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!isHtml(value)) return;
    let active = true;
    import("dompurify").then(({ default: DOMPurify }) => {
      if (active) setSafeHtml(DOMPurify.sanitize(value, { ALLOWED_TAGS, ALLOWED_ATTR: [] }));
    });
    return () => {
      active = false;
    };
  }, [value]);

  if (!isHtml(value)) return <p className={`whitespace-pre-line ${className ?? ""}`}>{value}</p>;
  if (safeHtml === null) return <p className={`whitespace-pre-line ${className ?? ""}`}>{toPlainText(value)}</p>;
  return (
    <div
      className={`[&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_strong]:font-bold ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
