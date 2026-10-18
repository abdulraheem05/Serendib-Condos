import { announcement } from "@/data/site";

export default function AnnouncementBar() {
  return (
    <div
      id="announcement"
      className="relative z-[60] flex h-9 items-center justify-center gap-4 bg-brand-navy px-4 text-[0.6875rem] tracking-[0.08em] text-brand-gold md:justify-between md:px-10"
    >
      <p className="truncate font-medium uppercase tracking-[0.18em]">{announcement.lead}</p>
      <p className="hidden truncate text-white/70 md:block">{announcement.support}</p>
    </div>
  );
}
