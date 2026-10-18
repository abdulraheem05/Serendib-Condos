"use client";

import { useRef } from "react";
import Image from "next/image";
import { gallery } from "@/data/site";
import { pad2 } from "@/lib/animation-utils";
import { useScrollScene } from "@/hooks/useScrollAnimations";

/**
 * Horizontal image storytelling. On ≥ md (with motion allowed) the section is pinned and the
 * panels slide sideways, scrubbed by the scroll position; each image drifts inside its panel.
 * On phones / reduced motion the same markup renders as a calm vertical sequence.
 */
export default function ImageStorySection() {
  const rootRef = useRef(null);

  useScrollScene(rootRef, ({ gsap, q, horizontal }) => {
    if (!horizontal) return;
    const root = rootRef.current;
    const stage = q("[data-stage]")[0];
    const track = q("[data-track]")[0];
    const panels = q("[data-panel]");
    const bar = q("[data-progress]")[0];
    if (!stage || !track || !panels.length) return;

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    // 1) The image panel rises out of the paper section, expanding to full bleed.
    gsap.fromTo(
      stage,
      { clipPath: "inset(12% 7% 0% 7% round 28px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: true },
      }
    );

    // 2) Pinned horizontal travel, scrubbed with scroll progress.
    const travel = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${distance()}`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (bar) bar.style.transform = `scaleX(${self.progress})`;
        },
      },
    });

    // 3) Each photograph drifts slightly inside its panel (parallax) while it crosses the viewport.
    panels.forEach((panel) => {
      const img = panel.querySelector("[data-panel-img]");
      if (!img) return;
      gsap.fromTo(
        img,
        { xPercent: -6 },
        {
          xPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: panel, containerAnimation: travel, start: "left right", end: "right left", scrub: true },
        }
      );
    });
  });

  return (
    <section
      id="story"
      ref={rootRef}
      aria-label="Sri Lanka living – image gallery"
      className="relative z-10 bg-paper motion-safe:md:h-screen"
    >
      <div data-stage className="relative h-full overflow-hidden bg-brand-navy text-white">
        <div data-track className="flex flex-col motion-safe:md:h-full motion-safe:md:w-max motion-safe:md:flex-row">
          {gallery.map((item, i) => (
            <article
              key={item.title}
              data-panel
              className="relative h-[78svh] w-full shrink-0 overflow-hidden motion-safe:md:h-full motion-safe:md:w-screen"
            >
              <div data-panel-img className="absolute inset-y-0 left-0 w-full motion-safe:md:-left-[7%] motion-safe:md:w-[114%]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 114vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/10 to-brand-navy/40" aria-hidden="true" />

              <div className="absolute left-5 top-24 flex items-center gap-3 md:left-10 md:top-28">
                <span className="rounded-full border border-white/50 px-3 py-1 text-[0.625rem] font-medium uppercase tracking-[0.2em]">
                  Gallery
                </span>
                <span className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-white/70">Sri Lanka living</span>
              </div>

              <div className="absolute inset-x-5 bottom-14 flex flex-col gap-4 md:inset-x-10 md:bottom-16 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-display text-lg italic text-brand-gold md:text-2xl">
                    {pad2(i + 1)}
                    <span className="text-white/60"> / {pad2(gallery.length)}</span>
                  </p>
                  <h2 className="mt-2 font-display text-[clamp(2.5rem,7vw,6.5rem)] font-bold uppercase leading-[0.9] tracking-tight">
                    {item.title}
                  </h2>
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-white/80 md:pb-3 md:text-right">{item.caption}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-5 bottom-6 hidden h-px bg-white/25 motion-safe:md:block md:inset-x-10" aria-hidden="true">
          <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-brand-gold" />
        </div>
      </div>
    </section>
  );
}
