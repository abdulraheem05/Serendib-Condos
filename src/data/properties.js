/**
 * SINGLE SOURCE OF TRUTH for every property shown on the site
 * (map markers, list view, hover previews, detail panel, dialog, filters).
 *
 * Content is carried over unchanged from `serendib_condos_website_sample_content.html`.
 * These are DEMONSTRATION records: names, prices, availability and map pins are illustrative
 * and must be replaced with verified listings and approved coordinates before publishing.
 *
 * Fields
 *  id          unique slug
 *  name        project name
 *  stage       "upcoming" | "ongoing" | "completed"
 *  city        filter value (matches LOCATIONS in site.js)
 *  area        human-readable location line
 *  lat, lng    illustrative coordinates (projected onto the illustrated map)
 *  mapNudge    optional [dx, dy] in map units – keeps coastal pins just inside the stylised coastline
 *  price       pricing label (not a verified price)
 *  beds        bedroom types, e.g. "1–3"
 *  image       local image path (replace with real photography)
 *  imageAlt    accessible description of the image
 *  summary     one-line summary
 *  description longer description (shown in the full-details dialog)
 *  address     address / location description
 */

const raw = [
  {
    id: "aurora",
    name: "Aurora Residences",
    stage: "upcoming",
    city: "Colombo",
    area: "Rajagiriya, Colombo",
    lat: 6.9065,
    lng: 79.895,
    mapNudge: [7.8, 0.7],
    price: "Request pricing",
    beds: "1–3",
    image: "/assets/images/property-aurora.jpg",
    imageAlt: "Illustrated dusk skyline of condominium towers with lit windows beside the sea",
    summary: "A contemporary city-living concept close to Colombo’s everyday conveniences.",
    description:
      "Sample project description. Replace with developer-approved information, amenities, specifications, construction milestones and official payment terms.",
    address: "Illustrative location near Rajagiriya, Colombo.",
  },
  {
    id: "coastline",
    name: "Coastline Living",
    stage: "upcoming",
    city: "Negombo",
    area: "Negombo, Western Province",
    lat: 7.2083,
    lng: 79.8358,
    mapNudge: [19.1, 0.1],
    price: "Request pricing",
    beds: "1–2",
    image: "/assets/images/property-coastline.jpg",
    imageAlt: "Illustrated beachfront residences framed by palm trees at sunset",
    summary: "A sample coastal-area project for buyers comparing lifestyle and location.",
    description:
      "Replace with verified project information, official payment schedule, developer details and availability.",
    address: "Illustrative location in Negombo.",
  },
  {
    id: "skyline",
    name: "Skyline Court",
    stage: "ongoing",
    city: "Colombo",
    area: "Colombo 05",
    lat: 6.8908,
    lng: 79.868,
    mapNudge: [16.6, 0],
    price: "Confirm with developer",
    beds: "1–3",
    image: "/assets/images/property-skyline.jpg",
    imageAlt: "Illustrated residential tower under construction with a tower crane at dusk",
    summary: "A sample in-progress development with information organised for overseas buyers.",
    description:
      "Add verified construction progress, completion estimate, specifications and the official payment schedule.",
    address: "Illustrative location in Colombo 05.",
  },
  {
    id: "garden",
    name: "Garden Residences",
    stage: "ongoing",
    city: "Kandy",
    area: "Kandy, Central Province",
    lat: 7.2906,
    lng: 80.6337,
    price: "Confirm with developer",
    beds: "2–3",
    image: "/assets/images/property-garden.jpg",
    imageAlt: "Illustrated terraced residences on a misty hill-country slope",
    summary: "A sample project showing how listings outside Colombo can be explored on the map.",
    description:
      "Replace with confirmed amenities, construction stage, access details, handover timing and contract terms.",
    address: "Illustrative location in Kandy.",
  },
  {
    id: "harbour",
    name: "Harbour View Apartments",
    stage: "completed",
    city: "Colombo",
    area: "Colombo 03",
    lat: 6.9147,
    lng: 79.848,
    mapNudge: [23.1, 3.7],
    price: "Enquire for availability",
    beds: "1–3",
    image: "/assets/images/property-harbour.jpg",
    imageAlt: "Illustrated harbour with sailing boats and apartment towers at golden hour",
    summary: "A sample completed property listing for buyers exploring ready developments.",
    description:
      "Completed status does not guarantee a unit is available. Add verified inventory, pricing, title and resale details.",
    address: "Illustrative location in Colombo 03.",
  },
  {
    id: "lake",
    name: "Lake Gardens",
    stage: "completed",
    city: "Colombo",
    area: "Battaramulla, Colombo District",
    lat: 6.9008,
    lng: 79.9185,
    price: "Enquire for availability",
    beds: "2–3",
    image: "/assets/images/property-lake.jpg",
    imageAlt: "Illustrated night view of lit apartment blocks reflected in still water",
    summary: "A sample finished development card with map and detail-page navigation.",
    description:
      "Use this page for approved images, unit layouts, exact coordinates and verified legal/ownership disclosures.",
    address: "Illustrative location near Battaramulla.",
  },
];

/** "1–3" -> { bedsMin: 1, bedsMax: 3 } so the bedroom filter can match ranges correctly. */
function withBedRange(property) {
  const numbers = (property.beds.match(/\d+/g) || []).map(Number);
  return {
    ...property,
    bedsMin: numbers.length ? Math.min(...numbers) : 0,
    bedsMax: numbers.length ? Math.max(...numbers) : 0,
  };
}

export const properties = raw.map(withBedRange);

export function getPropertyById(id) {
  return properties.find((p) => p.id === id) ?? null;
}
