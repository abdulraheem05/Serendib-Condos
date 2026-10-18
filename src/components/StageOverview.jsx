import clsx from "clsx";
import { getStage } from "@/data/site";
import StageGlyph from "./StageGlyph";

/** Shown when nothing is selected: describes the stage and lists its projects (keyboard / touch friendly). */
export default function StageOverview({ stage, properties, filtersActive, onSelect, onReset, className }) {
  const meta = getStage(stage);
  return (
    <div className={clsx("rounded-md border border-white/15 bg-white/[0.04] p-6 anim-fade-in", className)}>
      <p className="eyebrow text-brand-gold">On the map</p>
      <h3 className="mt-3 font-display text-3xl font-bold leading-tight">{meta.label} projects</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{meta.blurb}</p>
      {properties.length > 0 ? (
        <>
          <p className="mt-4 text-xs leading-relaxed text-white/55">Select a marker, or choose a project below, to view its details.</p>
          <ul className="mt-5 flex flex-col gap-2">
            {properties.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={(e) => onSelect(p.id, e.currentTarget)}
                  className="group flex w-full items-center gap-3 rounded-md border border-white/15 bg-brand-navy/60 px-3.5 py-3 text-left transition-colors hover:border-brand-gold"
                >
                  <StageGlyph stage={p.stage} className="h-6 w-6 shrink-0" />
                  <span className="block min-w-0">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-white/60">{p.area}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-5 rounded-md border border-dashed border-white/25 p-4">
          <p className="text-sm font-semibold">No demonstration projects match.</p>
          <p className="mt-1 text-xs leading-relaxed text-white/65">
            {filtersActive ? "Try another location or bedroom count, or change the project stage." : "There are no projects in this stage yet."}
          </p>
          {filtersActive && (
            <button type="button" onClick={onReset} className="btn btn-gold mt-4 !min-h-10">
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
