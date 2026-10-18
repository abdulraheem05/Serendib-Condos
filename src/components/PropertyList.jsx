import Image from "next/image";
import clsx from "clsx";
import { getStage } from "@/data/site";
import StageGlyph from "./StageGlyph";
import { ArrowUpRight, PinIcon } from "./Icons";

/** List View – the same property records, same selection, as the map. */
export default function PropertyList({ properties, selectedId, onSelect }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {properties.map((property, i) => {
        const stage = getStage(property.stage);
        const selected = property.id === selectedId;
        return (
          <li key={property.id} className="anim-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <button
              type="button"
              data-list-item={property.id}
              aria-pressed={selected}
              onClick={(e) => onSelect(property.id, e.currentTarget)}
              className={clsx(
                "group block w-full overflow-hidden rounded-md border bg-white/[0.04] text-left transition-[border-color,background-color,transform] duration-500 ease-[var(--ease-cine)] hover:-translate-y-0.5 hover:bg-white/[0.08]",
                selected ? "border-brand-gold" : "border-white/15"
              )}
            >
              <span className="relative block h-44 w-full overflow-hidden bg-brand-navy">
                <Image
                  src={property.image}
                  alt={property.imageAlt}
                  fill
                  sizes="(min-width: 1280px) 22rem, (min-width: 640px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-cine)] group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-brand-navy">
                  <StageGlyph stage={property.stage} className="h-4 w-4" />
                  {stage.label}
                </span>
              </span>
              <span className="block p-5">
                <span className="block font-display text-2xl font-bold leading-tight">{property.name}</span>
                <span className="mt-1.5 flex items-center gap-1.5 text-xs text-white/70">
                  <PinIcon className="h-3.5 w-3.5 text-brand-gold" />
                  {property.area}
                </span>
                <span className="mt-4 block text-sm font-semibold text-brand-gold">{property.price}</span>
                <span className="mt-1 block text-[0.6875rem] text-white/55">Pricing and availability to be confirmed</span>
                <span className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-[0.6875rem] text-white/70">
                  <span>{property.beds} bedrooms · Apartments</span>
                  <span className="flex shrink-0 items-center gap-1 whitespace-nowrap font-semibold uppercase tracking-[0.14em] text-white">
                    View project <ArrowUpRight className="h-3.5 w-3.5 text-brand-gold" />
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
