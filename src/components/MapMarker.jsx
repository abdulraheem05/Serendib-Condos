import clsx from "clsx";
import { getStage } from "@/data/site";
import StageGlyph from "./StageGlyph";

/**
 * One interactive property marker (a real <button>, positioned over the SVG map).
 * Hover/focus → preview; click/Enter/Space → select.
 */
export default function MapMarker({ property, position, selected, index, onSelect, onHover, onLeave }) {
  const stage = getStage(property.stage);
  return (
    <button
      type="button"
      data-marker={property.id}
      style={{ left: `${position.left}%`, top: `${position.top}%` }}
      aria-pressed={selected}
      aria-label={`${property.name}, ${property.area}. ${stage.label} project.${selected ? " Selected." : ""}`}
      onClick={(e) => onSelect(property.id, e.currentTarget)}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onHover(property.id);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") onLeave(property.id);
      }}
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible")) onHover(property.id);
      }}
      onBlur={() => onLeave(property.id)}
      className={clsx(
        "group absolute z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-offset-2",
        selected ? "z-30" : ""
      )}
    >
      {selected && <span className="anim-pulse-ring absolute h-8 w-8 rounded-full border border-brand-gold" aria-hidden="true" />}
      <span
        className="anim-marker-in relative block"
        style={{ animationDelay: `${index * 90}ms` }}
        aria-hidden="true"
      >
        <span
          className={clsx(
            "block transition-transform duration-300 ease-[var(--ease-cine)] group-hover:scale-125 group-focus-visible:scale-125",
            selected ? "scale-125 drop-shadow-[0_0_10px_rgba(201,166,107,0.8)]" : "drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
          )}
        >
          <StageGlyph stage={property.stage} className="h-8 w-8" />
        </span>
      </span>
      {selected && (
        <span
          className="pointer-events-none absolute left-1/2 top-full z-10 mt-0.5 -translate-x-1/2 whitespace-nowrap rounded-full border border-brand-gold/70 bg-brand-navy px-3 py-1 text-[0.6875rem] font-semibold tracking-wide text-white"
          aria-hidden="true"
        >
          {property.name}
        </span>
      )}
    </button>
  );
}
