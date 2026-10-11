import { Fragment } from "react";

/**
 * Renders `text` with every verbatim occurrence of `phrases` wrapped in a
 * <strong> — used to carry the CV's bolded phrases onto the site. Phrases
 * that don't appear in the text are ignored rather than forced in.
 */
export function Emphasized({
  text,
  phrases,
  strongClassName,
}: {
  text: string;
  phrases: string[];
  strongClassName?: string;
}) {
  const found = phrases.filter((p) => text.includes(p));
  if (!found.length) return <>{text}</>;
  const escaped = found
    .sort((a, b) => b.length - a.length)
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`));
  return (
    <>
      {parts.map((part, i) =>
        found.includes(part) ? (
          <strong key={i} className={strongClassName}>
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}
