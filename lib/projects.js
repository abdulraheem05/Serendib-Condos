export function filterProjects(
  projects,
  { city = "all", stage = "all", bedrooms = "all" } = {},
) {
  return projects.filter((p) => {
    const beds = Number(bedrooms);
    return (
      (city === "all" || p.city === city) &&
      (stage === "all" || p.stage === stage) &&
      (bedrooms === "all" ||
        (beds >= 3
          ? p.bedsMax >= beds
          : p.bedsMin <= beds && p.bedsMax >= beds))
    );
  });
}
export const stageLabel = (stage) =>
  ({ upcoming: "Upcoming", ongoing: "Ongoing", completed: "Completed" })[
    stage
  ] || stage;
export const bedroomLabel = (p) =>
  p.bedsMin === p.bedsMax ? `${p.bedsMin}` : `${p.bedsMin}–${p.bedsMax}`;
export const emailLink = (email, subject) =>
  `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}`;
