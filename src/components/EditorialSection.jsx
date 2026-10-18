"use client";

import { useRef } from "react";
import Image from "next/image";
import { STAGES, editorial } from "@/data/site";
import { properties } from "@/data/properties";
import { sriLankaGeometry } from "@/data/sriLankaGeometry";
import { pad2 } from "@/lib/animation-utils";
import { useScrollScene } from "@/hooks/useScrollAnimations";
import { ArrowRight } from "./Icons";

const cityCount = new Set(properties.map((p) => p.city)).size;
const stats = [
  { value: properties.length, label: "Demonstration projects", note: "One shared dataset powers the map and the list." },
  { value: STAGES.length, label: "Project stages", note: "Upcoming, ongoing and completed." },
  { value: cityCount, label: "Cities with projects", note: "Colombo, Negombo and Kandy." },
];

export default function EditorialSection() {
  const rootRef = useRef(null);
  const railRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  useScrollScene(rootRef, ({ gsap, q, motion }) => {
    if (!motion) return;
    gsap.from(q("[data-line]"), {
      yPercent: 40,
      opacity: 0,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: { trigger: rootRef.current, start: "top 70%", once: true },
    });
    gsap.from(q("[data-card]"), {
      x: 60,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: railRef.current, start: "top 88%", once: true },
    });
    // The faint island outline drifts slowly against the scroll.
    gsap.fromTo(
      q("[data-island]"),
      { yPercent: 6 },
      { yPercent: -6, ease: "none", scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true } }
    );
  });

  // Mouse drag-to-scroll for the rail (touch and trackpads scroll natively).
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || !railRef.current) return;
    drag.current = { active: true, startX: e.clientX, scrollLeft: railRef.current.scrollLeft, moved: false };
    railRef.current.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.active || !railRef.current) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 4) d.moved = true;
    railRef.current.scrollLeft = d.scrollLeft - dx;
  };
  const endDrag = (e) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    railRef.current?.releasePointerCapture?.(e.pointerId);
  };

  const { index, title, body } = editorial.locationCaption;

  return (
    <section
      id="location"
      ref={rootRef}
      aria-labelledby="editorial-title"
      className="relative z-10 overflow-hidden bg-paper px-5 py-24 md:px-10 md:py-32"
    >
      {/* Restrained map artwork: the real silhouette, drawn as a hairline */}
      <svg
        data-island
        viewBox={sriLankaGeometry.viewBox.join(" ")}
        className="pointer-events-none absolute -right-[8%] top-[6%] hidden h-[110%] w-auto opacity-[0.55] md:block"
        aria-hidden="true"
        focusable="false"
      >
        {sriLankaGeometry.rings.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#C9A66B" strokeOpacity={0.35 - i * 0.08} strokeWidth="2" />
        ))}
        <path d={sriLankaGeometry.land} fill="none" stroke="#C9A66B" strokeWidth="3" />
      </svg>

      <div className="relative mx-auto max-w-[1500px]">
        <p className="eyebrow mb-8 text-brand-navy/60">{editorial.eyebrow}</p>
        <h2 id="editorial-title" className="max-w-5xl">
          <span className="block overflow-hidden">
            <span data-line className="block font-display text-[clamp(2.6rem,7.4vw,7.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.01em]">
              {editorial.headlineA}
            </span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span data-line className="block font-display text-[clamp(2.2rem,6vw,6rem)] font-normal italic leading-[1] text-brand-navy/80">
              {editorial.headlineB}
            </span>
          </span>
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,26rem)_1fr] md:items-end">
          <p className="text-base leading-relaxed text-brand-navy/75">{editorial.body}</p>
          <div className="flex flex-wrap items-center gap-6">
            <a href="#properties" className="btn btn-navy">
              {editorial.cta} <ArrowRight />
            </a>
            <div className="border-l border-brand-gold pl-4">
              <p className="eyebrow text-brand-navy/55">{index}</p>
              <p className="mt-1 font-display text-lg font-medium">{title}</p>
              <p className="text-xs text-brand-navy/65">{body}</p>
            </div>
          </div>
        </div>

        <div
          ref={railRef}
          role="region"
          aria-label="Sri Lanka at a glance – scrollable cards"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="rail-scroll -mx-5 mt-16 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 active:cursor-grabbing md:-mx-10 md:mt-20 md:px-10"
        >
          {stats.map((s) => (
            <article
              key={s.label}
              data-card
              className="relative flex h-[22rem] w-[min(78vw,19rem)] shrink-0 snap-start flex-col justify-between rounded-sm bg-paper-deep p-6"
            >
              <div className="flex items-start justify-between">
                <span className="font-display text-[6.5rem] font-medium leading-[0.8]">{pad2(s.value)}</span>
                <span className="eyebrow mt-2 text-brand-navy/55">Overview</span>
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium leading-tight">{s.label}</h3>
                <p className="mt-2 text-sm text-brand-navy/65">{s.note}</p>
              </div>
            </article>
          ))}
          {editorial.places.map((place, i) => (
            <article
              key={place.name}
              data-card
              className="group relative flex h-[22rem] w-[min(78vw,19rem)] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-sm bg-brand-navy p-6 text-white"
            >
              <Image
                src={place.image}
                alt=""
                fill
                sizes="(min-width: 768px) 19rem, 78vw"
                draggable={false}
                className="object-cover opacity-80 transition-[transform,opacity] duration-700 ease-[var(--ease-cine)] group-hover:scale-105 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/30 to-transparent" aria-hidden="true" />
              <span className="absolute left-6 top-6 eyebrow text-brand-gold">{pad2(i + 1)}</span>
              <div className="relative">
                <h3 className="font-display text-3xl font-bold uppercase leading-none">{place.name}</h3>
                <p className="mt-2 text-sm text-white/80">{place.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
