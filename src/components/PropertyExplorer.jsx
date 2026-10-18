"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { properties, getPropertyById } from "@/data/properties";
import { DEFAULT_STAGE, STAGES, explorer, getStage } from "@/data/site";
import { filterProperties } from "@/lib/filters";
import { layoutPins } from "@/lib/map-layout";
import { useScrollScene } from "@/hooks/useScrollAnimations";
import ExplorerFilters from "./ExplorerFilters";
import MapListToggle from "./MapListToggle";
import PropertyDetailPanel from "./PropertyDetailPanel";
import PropertyDialog from "./PropertyDialog";
import PropertyList from "./PropertyList";
import SriLankaMap from "./SriLankaMap";
import StageGlyph from "./StageGlyph";
import StageOverview from "./StageOverview";
import StageSelector from "./StageSelector";

const PANEL_ID = "explorer-panel";

/**
 * The unified Sri Lanka discovery experience.
 *
 * State (one source of truth, no duplicated data):
 *   stage        – "upcoming" (default) | "ongoing" | "completed"
 *   view         – "map" (default) | "list"
 *   location / bedrooms – filters applied on top of the stage
 *   selectedId   – the clicked property (persists after the pointer leaves)
 *   preview      – hover/focus preview (separate from selection)
 *   dialogId     – property shown in the full-details dialog
 */
export default function PropertyExplorer() {
  const rootRef = useRef(null);
  const triggerRef = useRef(null); // element that opened the current selection / dialog
  const [stage, setStage] = useState(DEFAULT_STAGE);
  const [view, setView] = useState("map");
  const [location, setLocation] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [preview, setPreview] = useState({ id: null, visible: false });
  const [dialog, setDialog] = useState({ id: null, opener: null });

  const filtersActive = location !== "all" || bedrooms !== "all";

  // ---- derived data (everything comes from the same `properties` array) ----
  const visible = useMemo(() => filterProperties(properties, { stage, location, bedrooms }), [stage, location, bedrooms]);
  const counts = useMemo(
    () => Object.fromEntries(STAGES.map((s) => [s.id, filterProperties(properties, { stage: s.id, location, bedrooms }).length])),
    [location, bedrooms]
  );
  const layout = useMemo(() => layoutPins(visible), [visible]);
  const selected = visible.find((p) => p.id === selectedId) ?? null;
  const previewProperty = preview.id ? getPropertyById(preview.id) : null;
  const stageMeta = getStage(stage);

  // ---- handlers ----
  const hidePreview = useCallback(() => setPreview((p) => ({ ...p, visible: false })), []);

  const changeStage = (id) => {
    setStage(id);
    setSelectedId(null);
    hidePreview();
  };
  const changeLocation = (value) => {
    setLocation(value);
    hidePreview();
  };
  const changeBedrooms = (value) => {
    setBedrooms(value);
    hidePreview();
  };
  const resetFilters = () => {
    setLocation("all");
    setBedrooms("all");
    hidePreview();
  };

  const selectProperty = (id, el) => {
    triggerRef.current = el || null;
    setSelectedId(id);
    hidePreview();
  };
  const clearSelection = useCallback(() => {
    setSelectedId(null);
    const el = triggerRef.current;
    if (el && document.contains(el)) el.focus();
    triggerRef.current = null;
  }, []);
  const onHover = useCallback((id) => setPreview({ id, visible: true }), []);
  const onLeave = useCallback(() => setPreview((p) => ({ ...p, visible: false })), []);

  const openDialog = (id, opener) => setDialog({ id, opener });
  const closeDialog = useCallback(() => setDialog({ id: null, opener: null }), []);
  const dialogProperty = dialog.id ? getPropertyById(dialog.id) : null;

  // ---- scroll reveal for the section chrome (interactive parts are never hidden) ----
  useScrollScene(rootRef, ({ gsap, q, motion }) => {
    if (!motion) return;
    gsap.from(q("[data-reveal]"), {
      y: 36,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: { trigger: rootRef.current, start: "top 72%", once: true },
    });
  });

  return (
    <section
      id="properties"
      ref={rootRef}
      aria-labelledby="explorer-title"
      className="relative bg-brand-navy px-5 py-24 text-white md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <header className="grid gap-6 md:grid-cols-[1fr_minmax(0,26rem)] md:items-end">
          <div data-reveal>
            <p className="eyebrow text-brand-gold">{explorer.eyebrow}</p>
            <h2
              id="explorer-title"
              className="mt-5 font-display text-[clamp(2.4rem,6vw,6rem)] font-bold uppercase leading-[0.92] tracking-[-0.01em]"
            >
              Explore properties <span className="italic font-normal normal-case text-brand-gold">across the island</span>
            </h2>
          </div>
          <p data-reveal className="text-sm leading-relaxed text-white/70 md:text-base">
            {explorer.intro}
          </p>
        </header>

        <div data-reveal className="mt-10">
          <ExplorerFilters
            location={location}
            bedrooms={bedrooms}
            onLocation={changeLocation}
            onBedrooms={changeBedrooms}
            onReset={resetFilters}
            filtersActive={filtersActive}
          />
        </div>

        <div data-reveal className="mt-8 grid gap-8 xl:grid-cols-[19rem_minmax(0,1fr)] xl:gap-12">
          {/* Stage selector – beside the map on xl, above it on smaller screens */}
          <div>
            <StageSelector value={stage} counts={counts} onChange={changeStage} panelId={PANEL_ID} />
            <ul className="mt-6 hidden gap-3 text-xs text-white/65 xl:grid" aria-label="Marker legend">
              {STAGES.map((s) => (
                <li key={s.id} className="flex items-center gap-3">
                  <StageGlyph stage={s.id} className="h-5 w-5" />
                  {s.label}
                </li>
              ))}
            </ul>
          </div>

          <div id={PANEL_ID} role="tabpanel" aria-labelledby={`stage-tab-${stage}`} tabIndex={-1} className="min-w-0 outline-none">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-white/70" aria-live="polite">
                Showing{" "}
                <strong className="font-semibold text-white">
                  {visible.length} {stageMeta.label.toLowerCase()} {visible.length === 1 ? "project" : "projects"}
                </strong>
                {filtersActive ? " (filtered)" : ""}
              </p>
              <MapListToggle value={view} onChange={setView} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
              <div key={view} className="anim-view-in min-w-0">
                {view === "map" ? (
                  <div className="relative overflow-hidden rounded-md border border-white/15 bg-[radial-gradient(ellipse_at_35%_40%,color-mix(in_srgb,#C9A66B_14%,#0D1C31),#0D1C31_70%)] px-2 py-4 md:px-6 md:py-6">
                    <p className="pointer-events-none absolute left-5 top-4 select-none font-display text-[clamp(2rem,5vw,4.5rem)] font-bold uppercase leading-none text-white/[0.07]" aria-hidden="true">
                      Sri Lanka
                    </p>
                    <SriLankaMap
                      properties={visible}
                      layout={layout}
                      selectedId={selected?.id ?? null}
                      preview={preview}
                      previewProperty={previewProperty}
                      onSelect={selectProperty}
                      onHover={onHover}
                      onLeave={onLeave}
                    />
                    {visible.length === 0 && (
                      <div className="absolute inset-x-6 top-1/2 z-30 -translate-y-1/2 rounded-md border border-white/20 bg-brand-navy/90 p-6 text-center backdrop-blur">
                        <p className="font-display text-2xl font-bold">No demonstration projects match.</p>
                        <p className="mt-2 text-sm text-white/70">Try another location or bedroom count, or choose a different project stage.</p>
                        {filtersActive && (
                          <button type="button" onClick={resetFilters} className="btn btn-gold mt-4">
                            Reset filters
                          </button>
                        )}
                      </div>
                    )}
                    <p className="mt-3 text-right text-[0.625rem] uppercase tracking-[0.16em] text-white/45">
                      Illustrative map · demonstration pins
                    </p>
                  </div>
                ) : visible.length > 0 ? (
                  <PropertyList properties={visible} selectedId={selected?.id ?? null} onSelect={selectProperty} />
                ) : (
                  <div className="rounded-md border border-dashed border-white/25 p-10 text-center">
                    <p className="font-display text-2xl font-bold">No demonstration projects match.</p>
                    <p className="mt-2 text-sm text-white/70">Try another location or bedroom count, or choose a different project stage.</p>
                    {filtersActive && (
                      <button type="button" onClick={resetFilters} className="btn btn-gold mt-5">
                        Reset filters
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <StageOverview
                  key={stage}
                  stage={stage}
                  properties={visible}
                  filtersActive={filtersActive}
                  onSelect={selectProperty}
                  onReset={resetFilters}
                  className={clsx(selected && "xl:hidden")}
                />
                {selected && (
                  <PropertyDetailPanel key={selected.id} property={selected} onClose={clearSelection} onOpenDialog={openDialog} />
                )}
              </div>
            </div>
          </div>
        </div>

        <p data-reveal className="mt-12 border-l-[3px] border-brand-gold bg-white/[0.05] p-4 text-xs leading-relaxed text-white/70">
          <b className="font-semibold text-white">Prototype note:</b> {explorer.note.replace(/^Prototype note:\s*/, "")}
        </p>
      </div>

      {dialogProperty && <PropertyDialog property={dialogProperty} onClose={closeDialog} returnFocusTo={dialog.opener} />}
    </section>
  );
}
