"use client";

import { useRef } from "react";
import Image from "next/image";
import { CONSULTATION_HREF, consultation } from "@/data/site";
import { useScrollScene } from "@/hooks/useScrollAnimations";
import { ArrowUpRight } from "./Icons";

export default function ConsultationSection() {
  const rootRef = useRef(null);

  useScrollScene(rootRef, ({ gsap, q, motion }) => {
    if (!motion) return;
    gsap.fromTo(
      q("[data-cta-photo]"),
      { yPercent: -8, scale: 1.12 },
      { yPercent: 8, scale: 1, ease: "none", scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true } }
    );
    gsap.from(q("[data-cta-line]"), {
      yPercent: 50,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.14,
      scrollTrigger: { trigger: rootRef.current, start: "top 62%", once: true },
    });
  });

  return (
    <section
      id="contact"
      ref={rootRef}
      aria-labelledby="contact-title"
      className="relative z-10 isolate flex min-h-[88svh] items-center overflow-hidden bg-brand-navy px-5 py-24 text-white md:px-10"
    >
      <div data-cta-photo className="absolute inset-0 -z-10 will-change-transform">
        <Image src={consultation.image} alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-navy/90 via-brand-navy/55 to-brand-navy/20" aria-hidden="true" />

      <div className="mx-auto grid w-full max-w-[1500px] gap-12 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="eyebrow text-brand-gold">{consultation.eyebrow}</p>
          <h2 id="contact-title" className="mt-6 max-w-4xl">
            <span className="block overflow-hidden">
              <span data-cta-line className="block font-display text-[clamp(2.2rem,6.4vw,6.4rem)] font-bold uppercase leading-[0.92] tracking-[-0.01em]">
                {consultation.titleA}
              </span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span data-cta-line className="block font-display text-[clamp(2rem,5.4vw,5.4rem)] font-normal italic leading-[1] text-brand-gold">
                {consultation.titleB}
              </span>
            </span>
          </h2>
          <p className="mt-8 max-w-md text-base leading-relaxed text-white/80">{consultation.body}</p>
        </div>
        <a
          href={CONSULTATION_HREF}
          className="group relative flex h-44 w-44 items-center justify-center self-start rounded-full bg-brand-gold text-center text-brand-navy transition-colors duration-500 hover:bg-white md:h-52 md:w-52"
        >
          <span className="absolute -inset-2 rounded-full border border-brand-gold/70 transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-110" aria-hidden="true" />
          <span className="flex flex-col items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
            {consultation.cta}
            <ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </span>
        </a>
      </div>
    </section>
  );
}
