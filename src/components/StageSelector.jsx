"use client";

import { useRef } from "react";
import clsx from "clsx";
import { STAGES } from "@/data/site";
import { pad2 } from "@/lib/animation-utils";
import StageGlyph from "./StageGlyph";

/** Upcoming / Ongoing / Completed – an ARIA tablist with arrow-key navigation. */
export default function StageSelector({ value, counts, onChange, panelId }) {
  const refs = useRef({});

  const onKeyDown = (e) => {
    const i = STAGES.findIndex((s) => s.id === value);
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % STAGES.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + STAGES.length) % STAGES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = STAGES.length - 1;
    if (next === null) return;
    e.preventDefault();
    const id = STAGES[next].id;
    onChange(id);
    refs.current[id]?.focus();
  };

  return (
    <div role="tablist" aria-label="Project stage" aria-orientation="vertical" onKeyDown={onKeyDown} className="grid grid-cols-3 gap-2 xl:grid-cols-1 xl:gap-0">
      {STAGES.map((stage, i) => {
        const active = stage.id === value;
        const count = counts[stage.id] ?? 0;
        return (
          <button
            key={stage.id}
            ref={(el) => {
              refs.current[stage.id] = el;
            }}
            id={`stage-tab-${stage.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={panelId}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(stage.id)}
            className={clsx(
              "group relative flex flex-col gap-1 border border-white/15 px-3 py-3 text-left transition-colors duration-500 ease-[var(--ease-cine)] xl:flex-row xl:items-start xl:gap-5 xl:border-0 xl:border-t xl:px-0 xl:py-6",
              "xl:last:border-b xl:last:border-white/15",
              active ? "border-brand-gold bg-white/[0.07] xl:bg-transparent" : "hover:bg-white/[0.04]"
            )}
          >
            <span
              aria-hidden="true"
              className={clsx(
                "absolute left-0 top-0 hidden h-px bg-brand-gold transition-[width] duration-700 ease-[var(--ease-cine)] xl:block",
                active ? "w-full" : "w-0"
              )}
            />
            <span className="eyebrow hidden pt-2 text-brand-gold xl:block">{pad2(i + 1)}</span>
            <span className="flex-1">
              <span className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <StageGlyph stage={stage.id} className="h-5 w-5 shrink-0 xl:h-6 xl:w-6" />
                <span
                  className={clsx(
                    "font-display text-[0.95rem] font-bold leading-none transition-colors sm:text-xl xl:text-[2.4rem] xl:leading-[1.05]",
                    active ? "text-white" : "text-white/55 group-hover:text-white/85"
                  )}
                >
                  {stage.label}
                </span>
              </span>
              <span className="mt-2 hidden max-w-[16rem] text-sm leading-relaxed text-white/65 xl:block">{stage.blurb}</span>
              <span className="mt-1 block text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-brand-gold xl:mt-3">
                {count} {count === 1 ? "project" : "projects"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
