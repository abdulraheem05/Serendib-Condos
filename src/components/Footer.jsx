import Image from "next/image";
import { CONTACT_EMAIL, footer, navLinks } from "@/data/site";

export default function Footer() {
  return (
    <footer id="about" className="relative z-10 bg-brand-navy px-5 pb-10 pt-20 text-white md:px-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-12 border-b border-white/15 pb-14 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-20">
          <a href="#home" aria-label="Serendib Condos – back to top" className="block w-fit rounded-lg bg-white/95 p-2">
            <Image src="/assets/logo/serendib-condos-logo.png" alt="Serendib Condos" width={350} height={341} className="h-24 w-auto" />
          </a>
          <div>
            <p className="eyebrow text-brand-gold">About Serendib Condos</p>
            <p className="mt-4 max-w-xl font-display text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.1]">{footer.message}</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-6 inline-block text-sm text-white/75 underline decoration-brand-gold underline-offset-4 hover:text-brand-gold">
              {CONTACT_EMAIL}
            </a>
          </div>
          <nav aria-label="Footer">
            <ul className="grid gap-3 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-white/75 transition-colors hover:text-brand-gold">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="pt-8 text-xs leading-relaxed text-white/55">
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Serendib Condos · {footer.disclaimer}
        </p>
      </div>
    </footer>
  );
}
