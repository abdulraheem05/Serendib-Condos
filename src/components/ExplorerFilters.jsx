import { BEDROOM_OPTIONS, LOCATIONS, explorer } from "@/data/site";

export default function ExplorerFilters({ location, bedrooms, onLocation, onBedrooms, onReset, filtersActive }) {
  return (
    <form
      role="search"
      aria-label="Filter properties"
      onSubmit={(e) => e.preventDefault()}
      className="grid gap-4 rounded-md border border-white/15 bg-white/[0.04] p-4 md:grid-cols-[minmax(0,1.2fr)_1fr_1fr_auto] md:items-end md:p-5"
    >
      <div className="hidden md:block">
        <p className="eyebrow text-brand-gold">Start exploring</p>
        <p className="mt-1 font-display text-2xl font-medium leading-tight">{explorer.searchTitle}</p>
      </div>
      <label className="block">
        <span className="eyebrow mb-1.5 block text-white/60">Location</span>
        <select className="field" value={location} onChange={(e) => onLocation(e.target.value)}>
          <option value="all">All locations</option>
          {LOCATIONS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow mb-1.5 block text-white/60">Bedrooms</span>
        <select className="field" value={bedrooms} onChange={(e) => onBedrooms(e.target.value)}>
          {BEDROOM_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <button type="button" onClick={onReset} disabled={!filtersActive} className="btn btn-ghost text-white disabled:pointer-events-none disabled:opacity-35">
        Reset filters
      </button>
    </form>
  );
}
