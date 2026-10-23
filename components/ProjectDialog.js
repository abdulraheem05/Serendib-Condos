"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import EnquiryButton from "./EnquiryButton";
import { X, ArrowUpRight } from "lucide-react";
import { bedroomLabel, stageLabel, emailLink } from "@/lib/projects";
export default function ProjectDialog({ project: p, onClose, email }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!p) return;
    const el = ref.current;
    const focused = document.activeElement;
    if (!el.open) el.showModal();
    return () => {
      if (el.open) el.close();
      if (focused?.isConnected) focused.focus();
    };
  }, [p]);
  function backdrop(e) {
    if (e.target !== ref.current) return;
    const r = ref.current.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      onClose();
  }
  return (
    <dialog
      ref={ref}
      aria-labelledby="detail-title"
      onClose={onClose}
      onCancel={onClose}
      onClick={backdrop}
    >
      {p && (
        <>
          <button
            className="close-dialog flex items-center justify-center"
            aria-label="Close project details"
            onClick={onClose}
            autoFocus
          >
            <X size={20} />
          </button>
          <Image
            className="detail-photo"
            src={p.image}
            alt={p.imageAlt}
            width={900}
            height={600}
            sizes="(max-width: 680px) 90vw, 680px"
          />
          <div className="detail-body">
            <span className={`badge ${p.stage}`}>{stageLabel(p.stage)}</span>
            <h2 id="detail-title">{p.name}</h2>
            <p>{p.area}</p>
            <p>{p.summary}</p>
            <dl>
              <div>
                <dt>Bedrooms</dt>
                <dd>{bedroomLabel(p)}</dd>
              </div>
              <div>
                <dt>Pricing</dt>
                <dd>{p.price}</dd>
              </div>
              <div>
                <dt>City</dt>
                <dd>{p.city}</dd>
              </div>
            </dl>
            <EnquiryButton className="button" projectId={p.id} projectName={p.name}>
              Enquire about this project
              <ArrowUpRight size={15} aria-hidden="true" />
            </EnquiryButton>
          </div>
        </>
      )}
    </dialog>
  );
}
