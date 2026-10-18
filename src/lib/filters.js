/** Pure filtering helpers – the map, the list view and every count use the same function. */

export function matchesBedrooms(property, bedrooms) {
  if (!bedrooms || bedrooms === "all") return true;
  const wanted = Number(bedrooms);
  if (wanted >= 3) return property.bedsMax >= 3;
  return property.bedsMin <= wanted && wanted <= property.bedsMax;
}

export function matchesLocation(property, location) {
  return !location || location === "all" || property.city === location;
}

export function filterProperties(list, { stage, location = "all", bedrooms = "all" }) {
  return list.filter(
    (p) => (!stage || p.stage === stage) && matchesLocation(p, location) && matchesBedrooms(p, bedrooms)
  );
}
