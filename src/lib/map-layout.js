import { sriLankaGeometry as G } from "@/data/sriLankaGeometry";

const [VX, VY, VW, VH] = G.viewBox;
export const MAP_VIEWBOX = G.viewBox;
export const MAP_ASPECT = VW / VH;

/** lat/lng → map units (the stylised silhouette's coordinate space). */
export function project(lat, lng) {
  const { ax, bx, ay, by } = G.fit;
  return { x: ax + bx * lng, y: ay + by * lat };
}

/** map units → CSS percentages inside the map frame. */
export function toPercent({ x, y }) {
  return { left: ((x - VX) / VW) * 100, top: ((y - VY) / VH) * 100 };
}

export function propertyPoint(property) {
  const p = project(property.lat, property.lng);
  const [dx, dy] = property.mapNudge || [0, 0];
  return { x: p.x + dx, y: p.y + dy };
}

function coastX(table, y) {
  const { step, x } = table;
  const i = Math.max(0, Math.min(x.length - 1, Math.round(y / step)));
  if (x[i] != null) return x[i];
  for (let d = 1; d < x.length; d += 1) {
    if (x[i - d] != null) return x[i - d];
    if (x[i + d] != null) return x[i + d];
  }
  return VX + 120;
}

export const coastWestX = (y) => coastX(G.coastWest, y);

const CLUSTER_DISTANCE = 70; // map units – closer than this and pins would overlap
const BADGE_STEP = 78; // vertical spacing of spread-out badges

/**
 * Positions one badge per property. Isolated properties sit exactly on their location.
 * Properties that would overlap (e.g. several Colombo projects) keep a small dot on the true
 * location and get a badge spread out into the sea, joined by a leader line.
 */
export function layoutPins(properties) {
  const pts = properties
    .map((p) => ({ property: p, ...propertyPoint(p) }))
    .sort((a, b) => a.y - b.y || a.x - b.x || a.property.id.localeCompare(b.property.id));

  // simple single-link clustering
  const groups = [];
  pts.forEach((pt) => {
    const group = groups.find((g) => g.some((o) => Math.hypot(o.x - pt.x, o.y - pt.y) < CLUSTER_DISTANCE));
    if (group) group.push(pt);
    else groups.push([pt]);
  });

  const out = {};
  groups.forEach((group) => {
    if (group.length === 1) {
      const [pt] = group;
      out[pt.property.id] = { id: pt.property.id, x: pt.x, y: pt.y, bx: pt.x, by: pt.y, leader: false };
      return;
    }
    const cy = group.reduce((s, g) => s + g.y, 0) / group.length;
    const bx = Math.max(VX + 46, coastWestX(cy) - 118);
    const start = cy - ((group.length - 1) * BADGE_STEP) / 2;
    group.forEach((pt, i) => {
      out[pt.property.id] = { id: pt.property.id, x: pt.x, y: pt.y, bx, by: start + i * BADGE_STEP, leader: true };
    });
  });
  return out;
}
