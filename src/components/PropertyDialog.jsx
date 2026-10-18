"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { enquiryHref, getStage } from "@/data/site";
import StageGlyph from "./StageGlyph";
import { IslandMiniMap } from "./SriLankaMap";
import { ArrowUpRight, CloseIcon } from "./Icons";

/** Full project details. Focus is trapped, Escape closes, scrolling is locked, focus returns to the opener. */
export default function PropertyDialog({ property, onClose, returnFocusTo }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const stage = getStage(property.stage);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab" && dialogRef.current) {
        const items = Array.from(dialogRef.current.querySelectorAll("a[href], button:not([disabled])"));
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      if (returnFocusTo && document.contains(returnFocusTo)) returnFocusTo.focus();
    };
  }, [onClose, returnFocusTo]);

  const stats = [
    { label: "Project stage", value: stage.label },
    { label: "Location", value: property.city },
    { label: "Bedroom types", value: property.beds },
    { label: "Price", value: property.price },
  ];
  const osm = `https://www.openstreetmap.org/?mlat=${property.lat}&mlon=${property.lng}#map=14/${property.lat}/${property.lng}`;

  return (
    <div
      data-property-dialog
      className="anim-fade-in fixed inset-0 z-[80] overflow-y-auto bg-brand-navy/80 p-0 backdrop-blur-sm md:p-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-dialog-title"
        className="anim-panel-in relative mx-auto min-h-full max-w-4xl overflow-hidden bg-paper text-brand-navy md:min-h-0 md:rounded-md"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-paper shadow transition-colors hover:bg-brand-gold"
        >
          <CloseIcon />
        </button>

        <div className="relative h-60 bg-brand-navy md:h-72">
          <Image src={property.image} alt={property.imageAlt} fill sizes="(min-width: 896px) 56rem, 100vw" className="object-cover" />
        </div>

        <div className="p-5 md:p-8">
          <button type="button" onClick={onClose} className="text-xs font-semibold text-brand-navy underline decoration-brand-gold decoration-2 underline-offset-4">
            ← Back to properties
          </button>
          <p className="eyebrow mt-6 flex items-center gap-2 text-brand-navy/65">
            <StageGlyph stage={property.stage} className="h-4 w-4" />
            {property.city} / Sri Lanka · {stage.label}
          </p>
          <h2 id="property-dialog-title" className="mt-2 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-bold leading-[1.02]">
            {property.name}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-navy/75">{property.summary}</p>

          <dl className="mt-6 grid grid-cols-2 border border-brand-navy/15 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`p-4 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} md:border-r md:last:border-r-0 border-brand-navy/15`}>
                <dt className="eyebrow text-[0.625rem] text-brand-navy/55">{s.label}</dt>
                <dd className="mt-1 text-sm font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_17rem]">
            <div>
              <h3 className="font-display text-2xl font-bold">About this project</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-navy/75">{property.description}</p>
              <h3 className="mt-6 font-display text-2xl font-bold">Location</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-navy/75">{property.address}</p>
              <div className="mt-4">
                <IslandMiniMap property={property} />
                <p className="mt-2 text-center text-[0.6875rem] text-brand-navy/55">
                  Illustrative pin ·{" "}
                  <a href={osm} target="_blank" rel="noopener noreferrer" className="underline decoration-brand-gold underline-offset-2">
                    open in OpenStreetMap
                  </a>
                </p>
              </div>
            </div>
            <aside className="self-start rounded-md bg-paper-deep p-5">
              <p className="eyebrow text-brand-navy/60">Interested in this project?</p>
              <h3 className="mt-2 font-display text-2xl font-bold leading-tight">Let&apos;s talk about it.</h3>
              <p className="mt-2 text-xs leading-relaxed text-brand-navy/70">Request the latest availability, official pricing and payment terms.</p>
              <a href={enquiryHref(property.name)} className="btn btn-navy mt-4 w-full !whitespace-normal text-center">
                Enquire about this property <ArrowUpRight />
              </a>
              <p className="mt-4 text-[0.6875rem] leading-relaxed text-brand-navy/60">
                Confirm eligibility, contract terms, taxes and title with qualified professionals before committing.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
