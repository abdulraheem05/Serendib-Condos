/** Splits text into word spans so a scroll scene can reveal it progressively. Visible without JS. */
export default function SplitWords({ text, className = "" }) {
  return text.split(" ").map((word, i, all) => (
    <span key={`${word}-${i}`} data-word className={`inline-block ${className}`}>
      {word}
      {i < all.length - 1 ? " " : ""}
    </span>
  ));
}
