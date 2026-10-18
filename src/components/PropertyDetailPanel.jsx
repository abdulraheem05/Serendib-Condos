"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { enquiryHref, getStage } from "@/data/site";
import StageGlyph from "./StageGlyph";
import { ArrowUpRight, CloseIcon, PinIcon } from "./Icons";

/**
 * Selected-property card. Floating bottom sheet on phones/tablets, in-flow column on xl.
 * It stays open until the visitor closes it or selects something else – never on pointer exit.
 */
export default function PropertyDetailPanel({ property, onClose, onOpenDialog }) {
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);
  const closeRef = useRef(null);
  const stage = getStage(property.stage);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onClose();
  };
  const requestClose = () => setLeaving(true);

  // Safety net so the card always closes even if the animationend event is skipped.
  useEffect(() => {
    if (!leaving) return undefined;
    const t = window.setTimeout(finish, 450);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving]);

  // Expose the close request to the Escape handler in the explorer.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && !document.querySelector("[data-property-dialog]")) {
        e.preventDefault();
        setLeaving(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <aside
      role="region"
      aria-label={`${property.name} – project details`}
      data-detail-panel={property.id}
      onAnimationEnd={(e) => {
        if (leaving && e.target === e.currentTarget) finish();
      }}
      className={clsx(
        leaving ? "anim-panel-out" : "anim-panel-in",
        "fixed inset-x-0 bottom-0 z-[55] mx-auto max-h-[84svh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-paper text-brand-navy shadow-[0_-24px_70px_rgba(0,0,0,0.5)] md:max-w-2xl",
        "xl:static xl:z-auto xl:mx-0 xl:max-h-none xl:max-w-none xl:overflow-visible xl:rounded-md xl:shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      )}
    >
      <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-brand-navy/20 xl:hidden" aria-hidden="true" />

      <div className="relative mt-2 h-52 overflow-hidden bg-brand-navy xl:mt-0 xl:h-56 xl:rounded-t-md">
        <div key={property.id} className="anim-img-in absolute inset-0">
          <Image src={property.image} alt={property.imageAlt} fill sizes="(min-width: 1280px) 24rem, (min-width: 768px) 42rem, 100vw" className="object-cover" />
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={requestClose}
          aria-label={`Close ${property.name} details`}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper text-brand-navy shadow transition-colors hover:bg-brand-gold"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em]">
          <StageGlyph stage={property.stage} className="h-4 w-4" />
          {stage.label}
        </span>
      </div>

      <div key={`${property.id}-body`} className="anim-fade-in p-6">
        <p className="eyebrow text-brand-navy/60">
          {property.city} / Sri Lanka
        </p>
        <h3 className="mt-2 font-display text-[2.1rem] font-bold leading-[1.02]">{property.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-brand-navy/75">{property.summary}</p>

        <dl className="mt-5 grid grid-cols-2 border border-brand-navy/15 text-sm">
          <div className="border-b border-r border-brand-navy/15 p-3">
            <dt className="eyebrow text-[0.625rem] text-brand-navy/55">Stage</dt>
            <dd className="mt-1 font-semibold">{stage.label}</dd>
          </div>
          <div className="border-b border-brand-navy/15 p-3">
            <dt className="eyebrow text-[0.625rem] text-brand-navy/55">Bedroom types</dt>
            <dd className="mt-1 font-semibold">{property.beds}</dd>
          </div>
          <div className="border-r border-brand-navy/15 p-3">
            <dt className="eyebrow text-[0.625rem] text-brand-navy/55">Location</dt>
            <dd className="mt-1 font-semibold">{property.area}</dd>
          </div>
          <div className="p-3">
            <dt className="eyebrow text-[0.625rem] text-brand-navy/55">Pricing</dt>
            <dd className="mt-1 font-semibold">{property.price}</dd>
          </div>
        </dl>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-brand-navy/65">
          <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy" />
          {property.address}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={enquiryHref(property.name)} className="btn btn-navy">
            Enquire <ArrowUpRight />
          </a>
          <button type="button" onClick={(e) => onOpenDialog(property.id, e.currentTarget)} className="btn btn-ghost text-brand-navy">
            Full details
          </button>
        </div>
        <p className="mt-4 text-[0.6875rem] leading-relaxed text-brand-navy/55">
          Demonstration content. Pricing and availability to be confirmed with the developer.
        </p>
      </div>
    </aside>
  );
}
