/** Shared site copy, navigation and stage metadata. Edit text here, not in components. */

export const CONTACT_EMAIL = "hello@serendibcondos.com";
export const CONSULTATION_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Serendib Condos Consultation")}`;

export function enquiryHref(propertyName) {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Enquiry about " + propertyName)}`;
}

export const announcement = {
  lead: "A bridge between Canada and Sri Lanka",
  support: "Property guidance, wherever you call home.",
};

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Properties", href: "#properties" },
  { label: "How it works", href: "#how" },
  { label: "About us", href: "#about" },
  { label: "Consultation", href: "#contact" },
];

/** Stage order matters: the first entry is the default selection. */
export const STAGES = [
  {
    id: "upcoming",
    label: "Upcoming",
    blurb: "Be among the first to explore new projects.",
  },
  {
    id: "ongoing",
    label: "Ongoing",
    blurb: "Explore projects currently under development.",
  },
  {
    id: "completed",
    label: "Completed",
    blurb: "See finished developments and available opportunities.",
  },
];

export const DEFAULT_STAGE = STAGES[0].id;

export function getStage(id) {
  return STAGES.find((s) => s.id === id) ?? STAGES[0];
}

/**
 * Location filter values. "Galle" is kept from the original prototype's search form
 * (there is intentionally no Galle demo project, so it demonstrates the empty state).
 */
export const LOCATIONS = ["Colombo", "Negombo", "Kandy", "Galle"];

export const BEDROOM_OPTIONS = [
  { value: "all", label: "Any" },
  { value: "1", label: "1 bedroom" },
  { value: "2", label: "2 bedrooms" },
  { value: "3", label: "3+ bedrooms" },
];

export const hero = {
  wordmark: "SERENDIB",
  eyebrow: "Your next chapter starts here",
  headline: "A place to call home.",
  headlineAccent: "A connection to Sri Lanka.",
  body: "Explore condominium opportunities across Sri Lanka with guidance designed for buyers living in Canada.",
};

export const concept = {
  label: "Concept",
  text: "Condominium living across Sri Lanka — from the city life of Colombo to coastal escapes and the cool hill country — explored from wherever you call home.",
};

export const gallery = [
  {
    image: "/assets/images/gallery-coast.jpg",
    alt: "Illustrated coastal residences and palms at sunset",
    title: "Coastal escapes",
    caption: "Sea-facing living along the island’s western shore.",
  },
  {
    image: "/assets/images/gallery-city.jpg",
    alt: "Illustrated night skyline of condominium towers",
    title: "City addresses",
    caption: "Colombo’s skyline, close to everyday conveniences.",
  },
  {
    image: "/assets/images/gallery-hills.jpg",
    alt: "Illustrated terraced homes on a misty hill-country slope",
    title: "Hill-country calm",
    caption: "Cooler air and green views around Kandy.",
  },
  {
    image: "/assets/images/gallery-harbour.jpg",
    alt: "Illustrated harbour with boats and apartment towers",
    title: "Harbour & waterfront",
    caption: "Ready developments beside the water.",
  },
];

export const editorial = {
  eyebrow: "Sri Lanka, with a clearer view",
  headlineA: "Explore the island.",
  headlineB: "One project at a time.",
  body: "From Colombo's city life to coastal escapes, compare locations, project stages and key details in one place.",
  cta: "Explore the collection",
  places: [
    { name: "Colombo", note: "The capital: city life and everyday convenience.", image: "/assets/images/gallery-city.jpg" },
    { name: "Negombo", note: "A coastal city on the western shore.", image: "/assets/images/gallery-coast.jpg" },
    { name: "Kandy", note: "Hill-country calm in the Central Province.", image: "/assets/images/gallery-hills.jpg" },
    { name: "Galle", note: "The historic southern coast.", image: "/assets/images/gallery-harbour.jpg" },
  ],
  locationCaption: {
    index: "01 / Location",
    title: "Find the right area for you.",
    body: "Use the interactive map to explore each project's neighbourhood.",
  },
};

export const explorer = {
  eyebrow: "The Serendib Collection",
  title: "Explore properties across the island",
  intro: "Choose a project stage, then explore one map of Sri Lanka. Switch between map view and list view.",
  searchTitle: "Find your kind of place",
  note: "Prototype note: Names, prices, availability and map pins are demonstration content only. Replace with verified listings and exact approved coordinates before publishing.",
};

export const how = {
  eyebrow: "A more informed journey",
  title: "Property exploration, made simpler.",
  intro: "Buying property from overseas can feel complicated. Compare projects and ask the right questions before taking the next step.",
  steps: [
    {
      title: "Explore verified project details",
      text: "Review location, development stage, features and available information.",
      image: "/assets/images/journey-explore.jpg",
      alt: "Illustrated skyline of condominium towers at dusk",
    },
    {
      title: "Discuss payment options",
      text: "Ask for the official payment schedule and terms for each development.",
      image: "/assets/images/journey-payment.jpg",
      alt: "Illustrated seafront residences and palms at sunset",
    },
    {
      title: "Connect with the project team",
      text: "Arrange a conversation and seek independent legal advice before committing.",
      image: "/assets/images/journey-team.jpg",
      alt: "Illustrated hill-country homes in evening mist",
    },
  ],
  disclaimer:
    "Always confirm official project information independently and seek appropriate legal advice before committing to a purchase.",
};

export const consultation = {
  eyebrow: "Let's start a conversation",
  titleA: "Your Sri Lanka property journey",
  titleB: "starts with a question.",
  body: "Tell us what you're looking for and we'll help you understand the next steps.",
  cta: "Book a consultation",
  image: "/assets/images/cta-sunrise.jpg",
};

export const footer = {
  message: "Connecting Canadian buyers with property opportunities in Sri Lanka.",
  disclaimer: "Verify all property details independently.",
};
