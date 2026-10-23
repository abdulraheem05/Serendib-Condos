"use client";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
import { Map, LayoutGrid, RotateCcw } from "lucide-react";
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
            <label htmlFor="city">
              City
              <select
                id="city"
                value={city}
                onChange={(e) => update(setCity, e.target.value)}
              >
                <option value="all">All Sri Lanka</option>
                {Object.keys(site.cities).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label htmlFor="stage">
              Project stage
              <select
                id="stage"
                value={stage}
                onChange={(e) => update(setStage, e.target.value)}
              >
                <option value="all">All stages</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label htmlFor="bedrooms">
              Bedrooms
              <select
                id="bedrooms"
                value={bedrooms}
                onChange={(e) => update(setBedrooms, e.target.value)}
              >
                <option value="all">Any bedrooms</option>
                <option value="1">1 bedroom</option>
                <option value="2">2 bedrooms</option>
                <option value="3">3+ bedrooms</option>
              </select>
            </label>
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
