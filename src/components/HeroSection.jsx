"use client";

import { useRef } from "react";
import Image from "next/image";
import { CONSULTATION_HREF, hero } from "@/data/site";
import { useScrollScene } from "@/hooks/useScrollAnimations";
import { ArrowRight, ArrowUpRight } from "./Icons";

export default function HeroSection() {
  const rootRef = useRef(null);

  useScrollScene(rootRef, ({ gsap, q, motion }) => {
    if (!motion) return; // reduced motion: static hero, nothing hidden

    const bg = q("[data-hero-bg]");
    const photo = q("[data-hero-photo]");
    const word = q("[data-hero-word]");
    const letters = q("[data-letter]");
    const copy = q("[data-hero-copy]");
    const copyItems = q("[data-hero-copy-item]");
    const shade = q("[data-hero-shade]");
    const hint = q("[data-hero-hint]");

    // Intro (runs once on load) – animates different elements from the scrubbed exit below.
    gsap.from(photo, { scale: 1.16, duration: 2, ease: "power3.out" });
    gsap.from(letters, { yPercent: 38, opacity: 0, duration: 1.25, ease: "power4.out", stagger: 0.06, delay: 0.1 });
    gsap.from(copyItems, { y: 28, opacity: 0, duration: 0.95, ease: "power3.out", stagger: 0.1, delay: 0.7 });
    gsap.from(hint, { opacity: 0, duration: 1, delay: 1.4 });

    // Scroll exit: the hero stays pinned while the next (paper) section slides over it.
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
        },
      })
      .to(bg, { scale: 1.14 }, 0)
      .to(word, { yPercent: -16, scale: 0.94, opacity: 0.1 }, 0)
      .to(copy, { yPercent: -35, opacity: 0 }, 0)
      .to(shade, { opacity: 1 }, 0);
  });

  return (
    <section
      id="home"
      ref={rootRef}
      aria-label="Introduction"
      className="relative isolate h-[calc(100svh-2.25rem)] min-h-[640px] w-full overflow-hidden bg-brand-navy text-white"
    >
      <div data-hero-bg className="absolute inset-0 origin-center will-change-transform">
        <div data-hero-photo className="absolute inset-0">
          <Image
            src="/assets/images/hero-waterfront.jpg"
            alt="Illustrated dusk view of condominium towers on the Sri Lankan waterfront, with palms in silhouette"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_55%]"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/70 via-transparent to-brand-navy/80" aria-hidden="true" />
      <div data-hero-shade className="absolute inset-0 bg-brand-navy/45 opacity-0" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col justify-between px-4 pb-8 pt-[5.5rem] md:px-8 md:pb-10">
        <h1
          data-hero-word
          className="mt-[3vh] w-full origin-top text-center font-display whitespace-nowrap text-[clamp(3rem,19.6vw,34rem)] font-bold uppercase leading-[0.82] tracking-[-0.015em] text-white will-change-transform"
        >
          <span className="sr-only">Serendib Condos. {hero.headline} {hero.headlineAccent}</span>
          <span aria-hidden="true" className="block">
            {hero.wordmark.split("").map((ch, i) => (
              <span key={i} data-letter className="inline-block">
                {ch}
              </span>
            ))}
          </span>
        </h1>

        <div data-hero-copy className="grid items-end gap-8 md:grid-cols-[minmax(0,34rem)_1fr_auto]">
          <div>
            <p data-hero-copy-item className="eyebrow mb-4 text-brand-gold">
              {hero.eyebrow}
            </p>
            <p data-hero-copy-item className="font-display text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium leading-[1.08]">
              {hero.headline}
              <br />
              <span className="italic text-brand-gold">{hero.headlineAccent}</span>
            </p>
            <p data-hero-copy-item className="mt-4 max-w-md text-sm leading-relaxed text-white/80 md:text-[0.9375rem]">
              {hero.body}
            </p>
            <div data-hero-copy-item className="mt-6 flex flex-wrap gap-3">
              <a href="#properties" className="btn btn-gold">
                Explore properties <ArrowRight />
              </a>
              <a href="#contact" className="btn btn-ghost text-white">
                Talk to our team
              </a>
            </div>
          </div>

          <p data-hero-hint className="eyebrow pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 text-white/60 md:block">
            Scroll down
          </p>

          <a
            href={CONSULTATION_HREF}
            aria-label="Book a consultation by email"
            className="group relative hidden h-24 w-24 items-center justify-center justify-self-end rounded-full bg-white text-center text-brand-navy transition-colors hover:bg-brand-gold md:flex"
          >
            <span className="absolute -inset-1.5 rounded-full border border-white/50 transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
            <span className="flex flex-col items-center gap-1 text-[0.625rem] font-semibold uppercase leading-tight tracking-[0.14em]">
              Book a
              <br />
              consult
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
