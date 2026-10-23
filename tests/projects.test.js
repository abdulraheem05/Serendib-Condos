import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { site } from "../lib/data.js";
import { filterProjects, emailLink, bedroomLabel } from "../lib/projects.js";
test("retains six unique demonstration listings with valid Sri Lankan coordinates", () => {
  assert.equal(site.projects.length, 6);
  assert.equal(new Set(site.projects.map((p) => p.id)).size, 6);
  assert.equal(new Set(site.projects.map((p) => p.image)).size, 6);
  for (const p of site.projects) {
    assert.ok(site.cities[p.city]);
    assert.ok(p.bedsMin <= p.bedsMax);
    assert.ok(p.lat >= 5.75 && p.lat <= 9.95);
    assert.ok(p.lng >= 79.35 && p.lng <= 82.1);
    assert.ok(existsSync(new URL(`../public${p.image}`, import.meta.url)));
  }
});
test("city filters return the correct inventory and preserve genuine empty cities", () => {
  for (const [city, count] of [
    ["Colombo", 4],
    ["Kandy", 1],
    ["Negombo", 1],
    ["Galle", 0],
    ["Nuwara Eliya", 0],
  ])
    assert.equal(filterProjects(site.projects, { city }).length, count);
  assert.equal(filterProjects(site.projects).length, 6);
});
test("combined filters respect bedroom ranges, including 3+ bedrooms", () => {
  assert.equal(
    filterProjects(site.projects, {
      city: "Colombo",
      stage: "completed",
      bedrooms: "3",
    }).length,
    2,
  );
  assert.equal(
    filterProjects(site.projects, { city: "Kandy", bedrooms: "1" }).length,
    0,
  );
  assert.equal(
    filterProjects(
      [{ city: "Colombo", stage: "ongoing", bedsMin: 4, bedsMax: 5 }],
      { bedrooms: "3" },
    ).length,
    1,
  );
  let cases = 0;
  for (const city of ["all", ...Object.keys(site.cities)])
    for (const stage of ["all", "upcoming", "ongoing", "completed"])
      for (const bedrooms of ["all", "1", "2", "3"]) {
        const result = filterProjects(site.projects, { city, stage, bedrooms });
        const expected = site.projects.filter(
          (p) =>
            (city === "all" || p.city === city) &&
            (stage === "all" || p.stage === stage) &&
            (bedrooms === "all" ||
              (Number(bedrooms) === 3
                ? p.bedsMax >= 3
                : p.bedsMin <= Number(bedrooms) &&
                  p.bedsMax >= Number(bedrooms))),
        );
        assert.deepEqual(result, expected);
        cases++;
      }
  assert.equal(cases, 96);
});
test("enquiry links encode subjects safely and bedroom labels match data", () => {
  assert.equal(
    emailLink("team@example.com", "Enquiry: A & B"),
    "mailto:team%40example.com?subject=Enquiry%3A%20A%20%26%20B",
  );
  assert.equal(bedroomLabel({ bedsMin: 2, bedsMax: 2 }), "2");
  assert.equal(bedroomLabel({ bedsMin: 1, bedsMax: 3 }), "1–3");
});
test("all five city photos and source credits are included locally", () => {
  const credits = JSON.parse(
    readFileSync(
      new URL("../public/assets/sources.json", import.meta.url),
      "utf8",
    ),
  );
  for (const city of Object.keys(site.cities)) {
    const key = city.toLowerCase().replaceAll(" ", "-");
    assert.ok(
      existsSync(new URL(`../public/assets/${key}.jpg`, import.meta.url)),
    );
    assert.ok(credits[key].source.includes("User-supplied"));
  }
});
