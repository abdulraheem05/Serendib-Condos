import clsx from "clsx";
import { ListIcon, MapIcon } from "./Icons";

const OPTIONS = [
  { id: "map", label: "Map View", Icon: MapIcon },
  { id: "list", label: "List View", Icon: ListIcon },
];

/** Map View / List View switch. Map View is the default; both buttons are real, keyboard-operable buttons. */
export default function MapListToggle({ value, onChange }) {
  return (
    <div role="group" aria-label="Property display" className="inline-flex rounded-full border border-white/25 bg-white/[0.05] p-1">
      {OPTIONS.map(({ id, label, Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={clsx(
              "flex min-h-10 items-center gap-2 rounded-full px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
              active ? "bg-brand-gold text-brand-navy" : "text-white/75 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
