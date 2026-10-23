"use client";
import { useEffect, useRef, useState } from "react";
import { stageLabel } from "@/lib/projects";
export default function PropertyMap({
  projects,
  city,
  cities,
  islandBounds,
  onDetails,
  located,
  visible,
}) {
  const container = useRef(null),
    mapRef = useRef(null),
    LRef = useRef(null),
    layerRef = useRef(null),
    markerRefs = useRef(new Map());
  const onDetailsRef = useRef(onDetails);
  const [ready, setReady] = useState(false),
    [status, setStatus] = useState("");
  useEffect(() => {
    onDetailsRef.current = onDetails;
  }, [onDetails]);
  useEffect(() => {
    let cancelled = false;
    let instance;
    import("leaflet")
      .then((module) => {
        if (cancelled) return;
        const L = module.default;
        LRef.current = L;
        instance = L.map(container.current, { scrollWheelZoom: false, zoomSnap: 0.25 });
        mapRef.current = instance;
        instance.fitBounds(islandBounds, { padding: [8, 8], animate: false });
        L.control
          .scale({ imperial: false, position: "bottomleft" })
          .addTo(instance);
        let errors = 0;
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          minZoom: 5,
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
        })
          .on("tileerror", () => {
            if (++errors >= 3 && !cancelled)
              setStatus(
                "Street tiles are unavailable. Check your connection; project cards still work.",
              );
          })
          .on("tileload", () => {
            errors = 0;
            if (!cancelled) setStatus("");
          })
          .addTo(instance);
        layerRef.current = L.layerGroup().addTo(instance);
        setReady(true);
      })
      .catch(() => {
        if (!cancelled)
          setStatus(
            "The map could not load. You can still explore all projects using the cards.",
          );
      });
    return () => {
      cancelled = true;
      instance?.remove();
      mapRef.current = null;
    };
  }, [islandBounds]);
  useEffect(() => {
    if (!ready || !visible || !mapRef.current) return;
    const L = LRef.current,
      map = mapRef.current,
      layer = layerRef.current;
    layer.clearLayers();
    markerRefs.current.clear();
    for (const p of projects) {
      if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) continue;
      const popup = document.createElement("div");
      popup.className = "popup";
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = p.imageAlt;
      img.width = 210;
      img.height = 105;
      img.loading = "lazy";
      const heading = document.createElement("h3");
      heading.textContent = p.name;
      const location = document.createElement("p");
      location.textContent = p.area;
      /* Image source credits are retained in assets/sources.json. */
      const note = document.createElement("small");
      note.textContent = p.demo
        ? "Demonstration listing · illustrative photo"
        : "Project information";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button";
      button.textContent = "View Details ↗";
      button.addEventListener("click", () => onDetailsRef.current(p));
      popup.append(img, heading, location, button);
      const pin = document.createElement("span");
      pin.className = ["upcoming", "ongoing", "completed"].includes(p.stage)
        ? p.stage
        : "ongoing";
      const marker = L.marker([p.lat, p.lng], {
        title: `${p.name} — ${p.area}`,
        alt: `${p.name}, ${stageLabel(p.stage)}${p.demo ? ", demonstration pin" : ""}`,
        icon: L.divIcon({
          className: "pin",
          html: pin,
          iconSize: [30, 36],
          iconAnchor: [13, 30],
          popupAnchor: [0, -30],
        }),
      });
      marker.bindPopup(popup, { maxWidth: 240 }).addTo(layer);
      markerRefs.current.set(p.id, marker);
    }
    if (cities[city]) {
      const config = cities[city];
      if (projects.length > 1)
        map.fitBounds(
          L.latLngBounds(projects.map((p) => [p.lat, p.lng])).extend(
            config.center,
          ),
          { padding: [42, 42], maxZoom: config.zoom, animate: false },
        );
      else
        map.setView(
          projects.length ? [projects[0].lat, projects[0].lng] : config.center,
          config.zoom,
          { animate: false },
        );
    } else map.fitBounds(islandBounds, { padding: [8, 8], animate: false });
  }, [ready, projects, city, cities, islandBounds, visible]);
  useEffect(() => {
    if (!ready || !visible || !mapRef.current) return;
    const map = mapRef.current;
    map.invalidateSize({ animate: false });
    if (located) {
      const marker = markerRefs.current.get(located.id);
      if (marker) {
        map.setView(marker.getLatLng(), 15, { animate: false });
        marker.openPopup();
      }
    }
  }, [ready, located, visible, projects]);
  return (
    <div className="map-panel">
      <div
        ref={container}
        id="map"
        role="region"
        aria-label="Interactive Sri Lanka project map"
      />
      <div className="map-hint">
        Zoom in for streets and landmarks · sample pins
      </div>
      {status && (
        <p id="map-status" role="status">
          {status}
        </p>
      )}
    </div>
  );
}
