"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { how } from "@/data/site";
import { pad2 } from "@/lib/animation-utils";
import { useScrollScene } from "@/hooks/useScrollAnimations";

export default function HowItWorks() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);

  useScrollScene(rootRef, ({ gsap, ScrollTrigger, q, desktopMotion, motion }) => {
    if (motion) {
      gsap.from(q("[data-how-head]"), {
        y: 36,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: rootRef.current, start: "top 72%", once: true },
      });
    }
    if (!desktopMotion) return;
    // The sticky image follows whichever step is crossing the middle of the viewport.
    q("[data-step]").forEach((step, i) => {
      ScrollTrigger.create({
        trigger: step,
        start: "top 58%",
        end: "bottom 58%",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      });
    });
  });

  return (
    <section id="how" ref={rootRef} aria-labelledby="how-title" className="relative z-10 bg-paper px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
        {/* Sticky image column (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-28 h-[min(78vh,46rem)] overflow-hidden rounded-sm bg-brand-navy">
            {how.steps.map((step, i) => (
              <Image
                key={step.title}
                src={step.image}
                alt={step.alt}
                fill
                sizes="45vw"
                className={clsx(
                  "object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-cine)]",
                  active === i ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
                )}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent" aria-hidden="true" />
            <p className="absolute bottom-6 left-6 font-display text-6xl font-bold text-white md:text-7xl" aria-hidden="true">
              {pad2(active + 1)}
              <span className="text-2xl font-normal italic text-brand-gold"> / {pad2(how.steps.length)}</span>
            </p>
          </div>
        </div>

        <div>
          <p data-how-head className="eyebrow text-brand-navy/60">
            {how.eyebrow}
          </p>
          <h2
            id="how-title"
            data-how-head
            className="mt-5 font-display text-[clamp(2.3rem,5.2vw,5rem)] font-bold uppercase leading-[0.94] tracking-[-0.01em]"
          >
            Property exploration, <span className="italic font-normal normal-case">made simpler.</span>
          </h2>
          <p data-how-head className="mt-6 max-w-xl text-base leading-relaxed text-brand-navy/75">
            {how.intro}
          </p>

          <ol className="mt-12 flex flex-col">
            {how.steps.map((step, i) => (
              <li
                key={step.title}
                data-step
                className={clsx(
                  "border-t border-brand-navy/20 py-10 transition-opacity duration-500 lg:min-h-[48vh] lg:py-14",
                  active === i ? "lg:opacity-100" : "lg:opacity-45"
                )}
              >
                <div className="relative mb-8 h-64 overflow-hidden rounded-sm bg-brand-navy sm:h-80 lg:hidden">
                  <Image src={step.image} alt={step.alt} fill sizes="(min-width: 640px) 80vw, 100vw" className="object-cover" />
                </div>
                <div className="flex gap-6">
                  <span className="font-display text-5xl font-medium leading-none text-brand-gold md:text-6xl">{pad2(i + 1)}</span>
                  <div>
                    <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold leading-tight">{step.title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-navy/70 md:text-base">{step.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-4 border-l-[3px] border-brand-gold bg-paper-deep p-4 text-xs leading-relaxed text-brand-navy/75">
            <b className="font-semibold text-brand-navy">Please note:</b> {how.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
