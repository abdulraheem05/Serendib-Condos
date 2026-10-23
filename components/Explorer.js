"use client";
import dynamic from "next/dynamic";
import { useEffect, useCallback, useMemo, useRef, useState } from "react";
import {
  Map,
  LayoutGrid,
  RotateCcw,
  ChevronDown,
  Search,
  MapPin,
  Check,
  X,
} from "lucide-react";
import { site } from "@/lib/data";
import { filterProjects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import ProjectDialog from "./ProjectDialog";
const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div
      className="map-panel flex min-h-[400px] items-center justify-center"
      role="status"
    >
      Loading interactive map…
    </div>
  ),
});


function CustomDropdown({
  label,
  value,
  options,
  onChange,
  searchable = false,
  placeholder = "Search...",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const searchRef = useRef(null);

  const selected = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (open && searchable) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open, searchable]);

  function chooseOption(option) {
    onChange(option.value);
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="custom-dropdown-field">
      <span className="custom-dropdown-label">{label}</span>

      <div
        className={`custom-dropdown ${open ? "is-open" : ""}`}
        ref={wrapperRef}
      >
        <button
          type="button"
          className="custom-dropdown-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span>{selected?.label ?? options[0]?.label}</span>
          <ChevronDown
            size={16}
            className="custom-dropdown-chevron"
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="custom-dropdown-menu">
            {searchable && (
              <div className="custom-dropdown-search">
                <Search size={16} aria-hidden="true" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  placeholder={placeholder}
                  aria-label={`Search ${label}`}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            )}

            <div className="custom-dropdown-options" role="listbox" aria-label={label}>
              {filteredOptions.map((option) => {
                const active = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`custom-dropdown-option ${
                      active ? "selected" : ""
                    }`}
                    onClick={() => chooseOption(option)}
                  >
                    {searchable && (
                      <MapPin
                        size={16}
                        className="custom-dropdown-pin"
                        aria-hidden="true"
                      />
                    )}

                    <span>{option.label}</span>

                    {active && (
                      <Check
                        size={16}
                        className="custom-dropdown-check"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}

              {filteredOptions.length === 0 && (
                <p className="custom-dropdown-empty">
                  No matching options found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Explorer() {
  const [city, setCity] = useState("all"),
    [stage, setStage] = useState("all"),
    [bedrooms, setBedrooms] = useState("all"),
    [view, setView] = useState("map"),
    [selected, setSelected] = useState(null),
    [located, setLocated] = useState(null);
  const mapContainer = useRef(null);
  const projects = useMemo(
    () => filterProjects(site.projects, { city, stage, bedrooms }),
    [city, stage, bedrooms],
  );
  const details = useCallback((p) => setSelected(p), []);
  const close = useCallback(() => setSelected(null), []);
  function update(setter, value) {
    setLocated(null);
    setter(value);
  }
  function reset() {
    setCity("all");
    setStage("all");
    setBedrooms("all");
    setLocated(null);
  }
  function chooseCity(value) {
    reset();
    setCity(value);
    setView("map");
  }
  function locate(p) {
    setLocated({ id: p.id, nonce: Date.now() });
    setView("map");
    requestAnimationFrame(() =>
      mapContainer.current?.scrollIntoView({
        behavior: "instant",
        block: "center",
      }),
    );
  }
  return (
    <>
      <section
        className="section container destinations"
        aria-labelledby="destinations-title"
      >
        <div className="section-head stacked-head">
          <div>
            
            <h2 id="destinations-title">One Island. Different ways to live</h2>
          </div>
          <p>Select a city to explore its neighbourhoods.</p>
        </div>
        <div className="cities">
          {[
            [
              "Colombo",
              "Connected city living",
              "Colombo skyline and coastline",
            ],
            [
              "Galle",
              "Southern coast & heritage",
              "Galle Lighthouse and palm trees",
            ],
            [
              "Negombo",
              "Coastal neighbourhoods",
              "Boats on a palm-lined beach in Negombo",
            ],
            ["Kandy", "A hill-country setting", "A temple beside the lake in Kandy"],
            [
              "Nuwara Eliya",
              "A cool hill-country escape",
              "Nuwara Eliya in Sri Lanka’s hill country",
            ],
          ].map(([name, label, alt]) => (
            <CityCard
              key={name}
              name={name}
              label={label}
              alt={alt}
              onSelect={chooseCity}
            />
          ))}
        </div>
      </section>
      <section
        id="properties"
        className="section collection"
        aria-labelledby="properties-title"
      >
        <div className="container">
          <div className="section-head stacked-head">
            <div>
              <p className="eyebrow">The Serendib Collection</p>
              <h2 id="properties-title">Find your kind of place.</h2>
            </div>
            <p>Compare locations, bedrooms and project stages.</p>
          </div>
          <form
            className="filters"
            aria-label="Filter properties"
            onSubmit={(e) => e.preventDefault()}
            onReset={reset}
          >
            
            <CustomDropdown
              label="City"
              value={city}
              searchable
              placeholder="Search cities..."
              onChange={(value) => update(setCity, value)}
              options={[
                { value: "all", label: "All Sri Lanka" },
                ...Object.keys(site.cities).map((name) => ({
                  value: name,
                  label: name,
                })),
              ]}
            />

            <CustomDropdown
              label="Project stage"
              value={stage}
              onChange={(value) => update(setStage, value)}
              options={[
                { value: "all", label: "All stages" },
                { value: "upcoming", label: "Upcoming" },
                { value: "ongoing", label: "Ongoing" },
                { value: "completed", label: "Completed" },
              ]}
            />

            <CustomDropdown
              label="Bedrooms"
              value={bedrooms}
              onChange={(value) => update(setBedrooms, value)}
              options={[
                { value: "all", label: "Any bedrooms" },
                { value: "1", label: "1 bedroom" },
                { value: "2", label: "2 bedrooms" },
                { value: "3", label: "3+ bedrooms" },
              ]}
            />

            <button
              type="reset"
              className="reset inline-flex items-center justify-center gap-2"
            >
              Reset filters
              <RotateCcw size={12} aria-hidden="true" />
            </button>
          </form>
          <div className="results-bar">
            <p role="status" aria-live="polite">
              {projects.length} {projects.length === 1 ? "project" : "projects"}{" "}
              · {city === "all" ? "All Sri Lanka" : city}
            </p>
            <div
              className="view-switch flex"
              role="group"
              aria-label="Property view"
            >
              <button
                type="button"
                className="inline-flex items-center gap-1.5"
                aria-pressed={view === "map"}
                onClick={() => setView("map")}
              >
                <Map size={13} aria-hidden="true" />
                Map
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
              >
                <LayoutGrid size={13} aria-hidden="true" />
                Grid
              </button>
            </div>
          </div>
          <div className={`explorer ${view === "grid" ? "grid-mode" : ""}`}>
            <div ref={mapContainer} className={view === "grid" ? "hidden" : ""}>
              <PropertyMap
                projects={projects}
                city={city}
                cities={site.cities}
                islandBounds={site.islandBounds}
                onDetails={details}
                located={located}
                visible={view === "map"}
              />
            </div>
            <div
              className="project-list"
              key={`${city}-${stage}-${bedrooms}`}
              aria-label="Matching projects"
            >
              {projects.length ? (
                projects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    onDetails={details}
                    onLocate={locate}
                    grid={view === "grid"}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <h3>No matching projects</h3>
                  <p>
                    {city === "Galle" || city === "Nuwara Eliya"
                      ? "No listings have been added in this city yet. You can still explore its streets on the map."
                      : "Try a different city, stage or bedroom count."}
                  </p>
                  <button className="text-button" onClick={reset}>
                    Show all projects ↗
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <ProjectDialog project={selected} onClose={close} email={site.email} />
    </>
  );
}
import Image from "next/image";
function CityCard({ name, label, alt, onSelect }) {
  return (
    <a href="#properties" onClick={() => onSelect(name)}>
      <Image
        src={`/assets/${name.toLowerCase().replaceAll(" ", "-")}.jpg`}
        alt={alt}
        width={640}
        height={400}
        sizes="(max-width: 760px) 45vw, 230px"
      />
      <strong>
        {name}
        <span aria-hidden="true">↗</span>
      </strong>
      <small>{label}</small>
    </a>
  );
}
