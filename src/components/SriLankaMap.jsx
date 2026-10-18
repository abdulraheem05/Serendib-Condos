"use client";

import { useId } from "react";
import { sriLankaGeometry as G, mapCities } from "@/data/sriLankaGeometry";
import { MAP_ASPECT, MAP_VIEWBOX, project, propertyPoint, toPercent } from "@/lib/map-layout";
import MapMarker from "./MapMarker";
import PropertyPreview from "./PropertyPreview";

const [VX, VY, VW, VH] = MAP_VIEWBOX;
const LATS = [6, 7, 8, 9];
const LNGS = [80, 81];

/** Island artwork shared by the main map and the dialog's mini map. */
function IslandArtwork({ id, withGrid = true, withRings = true }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-land`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9A66B" stopOpacity="0.26" />
          <stop offset="1" stopColor="#C9A66B" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      {withGrid &&
        LATS.map((lat) => {
          const y = project(lat, 80).y;
          return (
            <g key={`lat-${lat}`}>
              <line x1={VX} x2={VX + VW} y1={y} y2={y} stroke="#FFFFFF" strokeOpacity="0.07" strokeDasharray="3 9" />
              <text x={VX + 14} y={y - 8} fontSize="22" fill="#FFFFFF" fillOpacity="0.32" className="font-sans">
                {lat}°N
              </text>
            </g>
          );
        })}
      {withGrid &&
        LNGS.map((lng) => {
          const x = project(7, lng).x;
          return (
            <g key={`lng-${lng}`}>
              <line x1={x} x2={x} y1={VY} y2={VY + VH} stroke="#FFFFFF" strokeOpacity="0.07" strokeDasharray="3 9" />
              <text x={x + 8} y={VY + VH - 18} fontSize="22" fill="#FFFFFF" fillOpacity="0.32" className="font-sans">
                {lng}°E
              </text>
            </g>
          );
        })}
      {withRings &&
        G.rings.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#C9A66B" strokeOpacity={0.3 - i * 0.07} strokeWidth="2" />
        ))}
      <path d={G.land} fill={`url(#${id}-land)`} stroke="#C9A66B" strokeWidth="3" strokeLinejoin="round" />
    </>
  );
}

/** Small locator map used inside the full-details dialog. */
export function IslandMiniMap({ property }) {
  const id = useId().replace(/:/g, "");
  const pt = propertyPoint(property);
  return (
    <svg
      viewBox={`${VX} ${VY} ${VW} ${VH}`}
      className="mx-auto h-56 w-auto rounded-md bg-brand-navy"
      role="img"
      aria-label={`Locator map: ${property.name} in ${property.area}, Sri Lanka`}
    >
      <IslandArtwork id={id} withGrid={false} />
      <circle cx={pt.x} cy={pt.y} r="46" fill="#C9A66B" fillOpacity="0.18" />
      <circle cx={pt.x} cy={pt.y} r="20" fill="#C9A66B" stroke="#FFFFFF" strokeWidth="6" />
    </svg>
  );
}

/**
 * The one unified map. Only the properties passed in `pins` (already stage + filter matched)
 * are drawn, so markers can never disagree with the list view.
 */
export default function SriLankaMap({ properties, layout, selectedId, preview, previewProperty, onSelect, onHover, onLeave }) {
  const id = useId().replace(/:/g, "");
  const visiblePoints = properties.map((p) => layout[p.id]).filter(Boolean);

  // Hide a context label when a project marker sits on top of it.
  const cityLabels = mapCities
    .map((c) => ({ ...c, ...project(c.lat, c.lng) }))
    .filter((c) => !visiblePoints.some((p) => Math.hypot(p.bx - c.x, p.by - c.y) < 95 || Math.hypot(p.x - c.x, p.y - c.y) < 95));

  const previewAnchor = previewProperty && layout[previewProperty.id] ? toPercent({ x: layout[previewProperty.id].bx, y: layout[previewProperty.id].by }) : null;

  return (
    <div
      className="relative mx-auto"
      style={{ width: "min(100%, calc(min(78svh, 880px) * " + MAP_ASPECT + "))", aspectRatio: `${VW} / ${VH}` }}
    >
      <svg
        viewBox={`${VX} ${VY} ${VW} ${VH}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Illustrated map of Sri Lanka showing the locations of the projects in the selected stage"
      >
        <IslandArtwork id={id} />
        {cityLabels.map((c) => (
          <g key={c.name}>
            <circle cx={c.x} cy={c.y} r="5" fill="#FFFFFF" fillOpacity="0.55" />
            <text
              x={c.side === "right" ? c.x + 16 : c.x - 16}
              y={c.y + 8}
              textAnchor={c.side === "right" ? "start" : "end"}
              fontSize="26"
              letterSpacing="2"
              fill="#FFFFFF"
              fillOpacity="0.55"
              className="font-sans"
              style={{ textTransform: "uppercase" }}
            >
              {c.name}
            </text>
          </g>
        ))}
        {visiblePoints.map((p) =>
          p.leader ? (
            <g key={`leader-${p.id}`}>
              <line x1={p.x} y1={p.y} x2={p.bx} y2={p.by} stroke="#C9A66B" strokeWidth="2.5" strokeOpacity="0.85" />
              <circle cx={p.x} cy={p.y} r="6.5" fill="#C9A66B" stroke="#0D1C31" strokeWidth="2.5" />
            </g>
          ) : null
        )}
      </svg>

      {properties.map((property, i) => {
        const pin = layout[property.id];
        if (!pin) return null;
        return (
          <MapMarker
            key={property.id}
            property={property}
            index={i}
            position={toPercent({ x: pin.bx, y: pin.by })}
            selected={selectedId === property.id}
            onSelect={onSelect}
            onHover={onHover}
            onLeave={onLeave}
          />
        );
      })}

      <PropertyPreview
        property={previewProperty}
        anchor={previewAnchor}
        visible={preview.visible && preview.id !== selectedId && Boolean(previewAnchor)}
      />
    </div>
  );
}
