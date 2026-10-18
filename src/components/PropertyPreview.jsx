import Image from "next/image";
import clsx from "clsx";
import { getStage } from "@/data/site";
import StageGlyph from "./StageGlyph";

/**
 * The single hover preview. It stays mounted and glides between markers (left/top transition),
 * so moving the pointer from one marker to another never stacks multiple previews.
 */
export default function PropertyPreview({ property, anchor, visible }) {
  if (!property || !anchor) return null;
  const stage = getStage(property.stage);
  const shiftX = anchor.left < 34 ? "-14%" : anchor.left > 66 ? "-86%" : "-50%";
  const below = anchor.top < 24;
  return (
    <div
      aria-hidden="true"
      style={{
        left: `${anchor.left}%`,
        top: `${anchor.top}%`,
        transform: `translate(${shiftX}, ${below ? "34px" : "calc(-100% - 30px)"})`,
      }}
      className={clsx(
        "pointer-events-none absolute z-40 w-[15.5rem] overflow-hidden rounded-md bg-paper text-brand-navy shadow-[0_18px_50px_rgba(0,0,0,0.45)] transition-[left,top,opacity] duration-500 ease-[var(--ease-cine)]",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div key={property.id} className="anim-fade-in">
        <div className="relative h-24 w-full bg-brand-navy">
          <Image src={property.image} alt="" fill sizes="248px" className="object-cover" />
        </div>
        <div className="p-3.5">
          <p className="flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-brand-navy/65">
            <StageGlyph stage={property.stage} className="h-4 w-4" />
            {stage.label}
          </p>
          <p className="mt-1.5 font-display text-xl font-bold leading-tight">{property.name}</p>
          <p className="mt-0.5 text-xs text-brand-navy/70">{property.area}</p>
        </div>
      </div>
    </div>
  );
}
