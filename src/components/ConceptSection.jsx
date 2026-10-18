"use client";

import { useRef } from "react";
import { concept } from "@/data/site";
import { useScrollScene } from "@/hooks/useScrollAnimations";
import SplitWords from "./SplitWords";

export default function ConceptSection() {
  const rootRef = useRef(null);

  useScrollScene(rootRef, ({ gsap, q, motion }) => {
    if (!motion) return;
    const words = q("[data-word]");
    // Words brighten one after another as the paragraph travels through the viewport.
    gsap.fromTo(
      words,
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: { trigger: q("[data-concept-text]")[0], start: "top 82%", end: "bottom 48%", scrub: true },
      }
    );
    gsap.from(q("[data-concept-label]"), {
      opacity: 0,
      y: 16,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: rootRef.current, start: "top 70%", once: true },
    });
  });

  return (
    <section
      id="concept"
      ref={rootRef}
      aria-labelledby="concept-label"
      className="relative z-10 flex min-h-[78svh] items-center justify-center bg-paper px-6 py-28 md:px-10"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p id="concept-label" data-concept-label className="eyebrow mb-8 text-brand-navy/60">
          {concept.label}
        </p>
        <p
          data-concept-text
          className="font-display text-[clamp(1.75rem,3.9vw,3.6rem)] font-medium leading-[1.12] tracking-[-0.005em] text-brand-navy"
        >
          <SplitWords text={concept.text} />
        </p>
        <span className="mx-auto mt-12 block h-px w-24 bg-brand-gold" aria-hidden="true" />
      </div>
    </section>
  );
}
