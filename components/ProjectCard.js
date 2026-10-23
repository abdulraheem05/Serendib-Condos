import Image from "next/image";
import { ArrowUpRight, LocateFixed, BedDouble } from "lucide-react";
import { bedroomLabel, stageLabel } from "@/lib/projects";
export default function ProjectCard({ project: p, onDetails, onLocate, grid }) {
  return (
    <article className="project-card" aria-labelledby={`card-${p.id}`}>
      <div className="card-photo">
        <Image
          src={p.image}
          alt={p.imageAlt}
          fill
          sizes={
            grid
              ? "(max-width: 420px) 90vw, (max-width: 760px) 44vw, 360px"
              : "(max-width: 420px) 100px, 126px"
          }
        />
      </div>
      <div className="card-content">
        <span className={`badge ${p.stage}`}>{stageLabel(p.stage)}</span>
        <h3 id={`card-${p.id}`}>{p.name}</h3>
        <p>{p.area}</p>
        <div className="card-meta">
          <span className="inline-flex items-center gap-1">
            <BedDouble size={12} aria-hidden="true" />
            {bedroomLabel(p)} bedrooms
          </span>
          <span>{p.price}</span>
        </div>
        <div className="card-actions">
          <button
            className="text-button inline-flex items-center gap-1"
            onClick={() => onDetails(p)}
          >
            View Details
            <ArrowUpRight size={12} aria-hidden="true" />
          </button>
          <button
            className="text-button on-map inline-flex items-center gap-1"
            onClick={() => onLocate(p)}
          >
            Locate
            <LocateFixed size={12} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
