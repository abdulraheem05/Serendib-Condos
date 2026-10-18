import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Registers GSAP plugins exactly once (client only). Safe to call repeatedly. */
export function registerGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** Media-query conditions shared by every scroll scene. */
export const MOTION_QUERIES = {
  /** ≥ md AND the visitor has not asked for reduced motion → horizontal pinned storytelling. */
  horizontal: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  /** ≥ lg AND motion allowed → sticky/pinned editorial scenes. */
  desktopMotion: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  /** Any viewport where motion is allowed → reveals and scrubbed text. */
  motion: "(prefers-reduced-motion: no-preference)",
};

export const pad2 = (n) => String(n).padStart(2, "0");

/** Recalculates every ScrollTrigger once fonts and images have settled. */
export function refreshOnLoad() {
  if (typeof window === "undefined") return () => {};
  const { ScrollTrigger: ST } = registerGsap();
  const refresh = () => ST.refresh();
  let cancelled = false;
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (!cancelled) refresh();
    });
  }
  if (document.readyState === "complete") {
    const t = window.setTimeout(refresh, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }
  window.addEventListener("load", refresh, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", refresh);
  };
}
